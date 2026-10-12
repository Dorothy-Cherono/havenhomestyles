
from decimal import Decimal

from django.db import transaction
from rest_framework import serializers

from .models import Product, Order, OrderItem


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            "product",
            "product_name",
            "price",
            "quantity",
            "size",
        ]

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError(
                "Quantity must be at least 1."
            )
        return value


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "customer_name",
            "phone",
            "email",
            "delivery_location",
            "delivery_notes",
            "subtotal",
            "delivery_fee",
            "total",
            "status",
            "payment_status",
            "paystack_reference",
            "paid_at",
            "created_at",
            "items",
        ]
        read_only_fields = [
            "id",
            "subtotal",
            "delivery_fee",
            "total",
            "status",
            "payment_status",
            "paystack_reference",
            "paid_at",
            "created_at",
        ]

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop("items")

        if not items_data:
            raise serializers.ValidationError({
                "items": "An order must contain at least one item."
            })

        # Lock products while checking stock and creating the order.
        product_ids = {
            item["product"].pk for item in items_data
        }
        locked_products = {
            product.pk: product
            for product in Product.objects.select_for_update().filter(
                pk__in=product_ids
            ).order_by("pk")
        }

        subtotal = Decimal("0.00")
        order_items = []

        for item_data in items_data:
            product = locked_products.get(
                item_data["product"].pk
            )
            quantity = item_data["quantity"]

            if product is None:
                raise serializers.ValidationError({
                    "items": "One or more selected products do not exist."
                })

            if not product.available:
                raise serializers.ValidationError({
                    "items": f"{product.name} is currently unavailable."
                })

            if quantity > product.stock:
                raise serializers.ValidationError({
                    "items": (
                        f"Only {product.stock} unit(s) of "
                        f"{product.name} are currently available."
                    )
                })

            price = product.price
            subtotal += price * quantity

            order_items.append({
                "product": product,
                "product_name": product.name,
                "price": price,
                "quantity": quantity,
                "size": item_data.get("size", ""),
            })

        # Keep the existing KSh 300 delivery fee for non-empty orders.
        delivery_fee = Decimal("300.00")
        total = subtotal + delivery_fee

        order = Order.objects.create(
            **validated_data,
            subtotal=subtotal,
            delivery_fee=delivery_fee,
            total=total,
        )

        for item in order_items:
            OrderItem.objects.create(
                order=order,
                **item,
            )

        return order
