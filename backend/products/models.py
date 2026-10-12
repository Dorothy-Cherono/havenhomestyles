
import secrets

from django.db import models





class Product(models.Model):
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    image = models.ImageField(upload_to="products/", blank=True, null=True)
    stock = models.PositiveIntegerField(default=0)
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Order(models.Model):

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("processing", "Processing"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]

    customer_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    delivery_location = models.CharField(max_length=255)
    delivery_notes = models.TextField(blank=True)

    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending",
    )

    payment_status = models.CharField(
        max_length=20,
        choices=[
            ("unpaid", "Unpaid"),
            ("pending", "Pending"),
            ("paid", "Paid"),
            ("failed", "Failed"),
        ],
        
        default="unpaid",
    )

    paystack_reference = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        unique=True,
    )

    paid_at = models.DateTimeField(
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    
    public_token = models.CharField(
    max_length=64,
    default=secrets.token_urlsafe,
    editable=False,
 )

    def __str__(self):
        return f"Order #{self.id} - {self.customer_name}"

class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        related_name="items",
        on_delete=models.CASCADE,
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
    )

    product_name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    size = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"{self.product_name} x {self.quantity}"