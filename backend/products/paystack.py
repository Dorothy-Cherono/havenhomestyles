
from decimal import Decimal, InvalidOperation

import requests
from django.conf import settings


PAYSTACK_INITIALIZE_URL = (
    "https://api.paystack.co/transaction/initialize"
)
PAYSTACK_VERIFY_URL = (
    "https://api.paystack.co/transaction/verify"
)


def _headers():
    secret_key = getattr(settings, "PAYSTACK_SECRET_KEY", None)

    if not secret_key:
        raise RuntimeError("Paystack secret key is not configured.")

    return {
        "Authorization": f"Bearer {secret_key}",
        "Content-Type": "application/json",
    }


def _amount_in_subunits(amount):
    try:
        decimal_amount = Decimal(str(amount))
    except (InvalidOperation, TypeError, ValueError) as exc:
        raise ValueError("Invalid payment amount.") from exc

    if not decimal_amount.is_finite() or decimal_amount <= 0:
        raise ValueError("Payment amount must be positive.")

    subunits = decimal_amount * Decimal("100")

    if subunits != subunits.to_integral_value():
        raise ValueError(
            "Payment amount cannot have fractions smaller than a cent."
        )

    return int(subunits)


def initialize_payment(
    email,
    amount,
    reference,
    callback_url=None,
):
    """Initialize a KES payment with Paystack."""

    payload = {
        "email": email,
        "amount": _amount_in_subunits(amount),
        "currency": "KES",
        "reference": reference,
    }

    if callback_url:
        payload["callback_url"] = callback_url

    try:
        response = requests.post(
            PAYSTACK_INITIALIZE_URL,
            json=payload,
            headers=_headers(),
            timeout=30,
        )
        response.raise_for_status()
        data = response.json()
    except (requests.RequestException, ValueError) as exc:
        raise RuntimeError(
            "Paystack payment initialization could not be completed."
        ) from exc

    if not data.get("status") or not isinstance(data.get("data"), dict):
        raise RuntimeError("Paystack did not initialize the payment.")

    payment_data = data["data"]

    if not payment_data.get("authorization_url"):
        raise RuntimeError(
            "Paystack did not return a checkout URL."
        )

    if payment_data.get("reference") != reference:
        raise RuntimeError(
            "Paystack returned an unexpected payment reference."
        )

    return payment_data


def verify_payment(reference):
    """Retrieve transaction details from Paystack for verification."""

    if not reference:
        raise ValueError("A payment reference is required.")

    url = f"{PAYSTACK_VERIFY_URL}/{reference}"

    try:
        response = requests.get(
            url,
            headers=_headers(),
            timeout=30,
        )
        response.raise_for_status()
        data = response.json()
    except (requests.RequestException, ValueError) as exc:
        raise RuntimeError(
            "Paystack transaction verification could not be completed."
        ) from exc

    if not data.get("status") or not isinstance(data.get("data"), dict):
        raise RuntimeError(
            "Paystack did not return transaction details."
        )

    return data["data"]
