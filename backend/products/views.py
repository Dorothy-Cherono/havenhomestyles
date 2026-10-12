
from decimal import Decimal

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

from .models import Product, Order
from .serializers import ProductSerializer, OrderSerializer
from .paystack import initialize_payment, verify_payment


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAdminUser()]


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by("-created_at")
    serializer_class = OrderSerializer

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]

        if self.action in [
            "retrieve",
            "paystack_payment",
            "verify_paystack_payment",
        ]:
            # The order's private token is checked through get_queryset().
            return [AllowAny()]

        # Listing, editing and deleting orders require staff access.
        return [IsAdminUser()]

    def get_queryset(self):
        queryset = Order.objects.all().order_by("-created_at")

        # Staff can manage orders through the authenticated API.
        if getattr(self.request.user, "is_staff", False):
            return queryset

        # Customers must provide their private order token.
        token = self.request.headers.get("X-Order-Token")

        if not token:
            return queryset.none()

        return queryset.filter(public_token=token)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)

        if response.status_code == status.HTTP_201_CREATED:
            order = Order.objects.get(pk=response.data["id"])
            response.data = dict(response.data)
            response.data["public_token"] = order.public_token

        return response

    @action(
        detail=True,
        methods=["post"],
        url_path="paystack-payment",
    )
    def paystack_payment(self, request, pk=None):
        order = self.get_object()

        if order.payment_status == "paid":
            return Response(
                {"message": "This order has already been paid."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not order.email:
            return Response(
                {"message": "An email address is required for payment."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        frontend_url = getattr(
            settings,
            "FRONTEND_URL",
            "http://localhost:5173",
        ).rstrip("/")

        try:
            reference = (
                order.paystack_reference or f"HHS-ORDER-{order.id}"
            )

            payment_data = initialize_payment(
                email=order.email,
                amount=order.total,
                reference=reference,
                callback_url=(
                    f"{frontend_url}/order-success?order={order.id}"
                ),
            )

            order.paystack_reference = payment_data["reference"]
            order.payment_status = "pending"
            order.save(
                update_fields=[
                    "paystack_reference",
                    "payment_status",
                ]
            )

            return Response(
                {
                    "message": "Payment initialized successfully.",
                    "authorization_url": payment_data["authorization_url"],
                    "reference": payment_data["reference"],
                },
                status=status.HTTP_200_OK,
            )

        except Exception:
            return Response(
                {
                    "message": (
                        "Unable to initialize Paystack payment. "
                        "Please try again."
                    )
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )

    @action(
        detail=True,
        methods=["get"],
        url_path="verify-payment",
    )
    def verify_paystack_payment(self, request, pk=None):
        order = self.get_object()

        if order.payment_status == "paid":
            return Response(
                {
                    "message": "Payment is already confirmed.",
                    "payment_status": "paid",
                    "reference": order.paystack_reference,
                },
                status=status.HTTP_200_OK,
            )

        if not order.paystack_reference:
            return Response(
                {
                    "message": (
                        "This order does not have a Paystack payment reference."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            payment_data = verify_payment(order.paystack_reference)

            provider_status = payment_data.get("status")
            provider_reference = payment_data.get("reference")
            provider_currency = payment_data.get("currency")
            provider_amount = payment_data.get("amount")

            expected_amount = int(order.total * Decimal("100"))

            if (
                provider_status == "success"
                and provider_reference == order.paystack_reference
                and provider_currency == "KES"
                and provider_amount == expected_amount
            ):
                with transaction.atomic():
                    locked_order = Order.objects.select_for_update().get(
                        pk=order.pk
                    )

                    if locked_order.payment_status != "paid":
                        locked_order.payment_status = "paid"
                        locked_order.paid_at = timezone.now()
                        locked_order.save(
                            update_fields=[
                                "payment_status",
                                "paid_at",
                            ]
                        )

                return Response(
                    {
                        "message": "Payment verified successfully.",
                        "payment_status": "paid",
                        "reference": order.paystack_reference,
                    },
                    status=status.HTTP_200_OK,
                )

            if provider_status == "failed":
                order.payment_status = "failed"
                order.save(update_fields=["payment_status"])

                return Response(
                    {
                        "message": "Paystack reports that this payment failed.",
                        "payment_status": "failed",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            return Response(
                {
                    "message": (
                        "Payment is not yet confirmed. "
                        "Please wait and check again."
                    ),
                    "payment_status": provider_status or "pending",
                },
                status=status.HTTP_202_ACCEPTED,
            )

        except Exception:
            return Response(
                {
                    "message": (
                        "We could not verify the payment right now. "
                        "Please try again shortly."
                    )
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )
