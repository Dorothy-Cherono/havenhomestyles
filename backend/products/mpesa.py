import base64
import requests

from datetime import datetime
from django.conf import settings


def format_phone_number(phone_number):
    phone_number = phone_number.strip()
    phone_number = phone_number.replace(" ", "")
    phone_number = phone_number.replace("-", "")

    if phone_number.startswith("+254"):
        phone_number = phone_number[1:]

    elif phone_number.startswith("0"):
        phone_number = "254" + phone_number[1:]

    elif phone_number.startswith("7") or phone_number.startswith("1"):
        phone_number = "254" + phone_number

    return phone_number


def get_mpesa_access_token():
    url = (
        "https://sandbox.safaricom.co.ke/"
        "oauth/v1/generate?grant_type=client_credentials"
    )

    response = requests.get(
        url,
        auth=(
            settings.MPESA_CONSUMER_KEY,
            settings.MPESA_CONSUMER_SECRET,
        ),
        timeout=20,
    )

    response.raise_for_status()

    return response.json()["access_token"]


def initiate_stk_push(
    phone_number,
    amount,
    account_reference,
    transaction_desc,
):
    access_token = get_mpesa_access_token()

    phone_number = format_phone_number(phone_number)

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

    password_string = (
        settings.MPESA_SHORTCODE
        + settings.MPESA_PASSKEY
        + timestamp
    )

    password = base64.b64encode(
        password_string.encode()
    ).decode("utf-8")

    url = (
        "https://sandbox.safaricom.co.ke/"
        "mpesa/stkpush/v1/processrequest"
    )

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }

    payload = {
        "BusinessShortCode": settings.MPESA_SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(amount),
        "PartyA": phone_number,
        "PartyB": settings.MPESA_SHORTCODE,
        "PhoneNumber": phone_number,
        "CallBackURL": settings.MPESA_CALLBACK_URL,
        "AccountReference": account_reference,
        "TransactionDesc": transaction_desc,
    }

    response = requests.post(
        url,
        json=payload,
        headers=headers,
        timeout=20,
    )

    print("Safaricom HTTP status:", response.status_code)
    print("Safaricom response:", response.text)

    response.raise_for_status()

    return response.json()