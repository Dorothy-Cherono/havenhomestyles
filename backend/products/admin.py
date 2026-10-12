
from django.contrib import admin
from .models import Product, Order, OrderItem


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "price",
        "stock",
        "available",
        "created_at",
    )

    list_filter = (
        "category",
        "available",
    )

    search_fields = (
        "name",
        "category",
    )


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = (
        "product",
        "product_name",
        "price",
        "quantity",
        "size",
    )


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "customer_name",
        "phone",
        "total",
        "status",
        "payment_status",
        "paystack_reference",
        "paid_at",
        "created_at",
    )

    list_filter = (
        "status",
        "payment_status",
        "created_at",
    )

    search_fields = (
        "customer_name",
        "phone",
        "email",
        "paystack_reference",
    )

    readonly_fields = (
        "subtotal",
        "delivery_fee",
        "total",
        "paystack_reference",
        "paid_at",
        "created_at",
    )

    inlines = (OrderItemInline,)


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "product_name",
        "quantity",
        "price",
        "size",
        "order",
    )

    search_fields = (
        "product_name",
    )
