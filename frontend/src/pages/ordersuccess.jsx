
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../api/api";

function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();

  const [status, setStatus] = useState("verifying");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const verifyPayment = async () => {
      const orderId = searchParams.get("order");

      if (!orderId || !/^\d+$/.test(orderId)) {
        setStatus("error");
        setError("No valid order information was provided.");
        return;
      }

      const token = sessionStorage.getItem(
        `orderToken_${orderId}`
      );

      if (!token) {
        setStatus("error");
        setError(
          "We couldn't find this order's access token in this browser session. Please contact support if you completed payment."
        );
        return;
      }

      const config = {
        headers: {
          "X-Order-Token": token,
        },
      };

      try {
        const response = await api.get(
          `orders/${orderId}/verify-payment/`,
          config
        );

        if (cancelled) return;

        if (response.data.payment_status !== "paid") {
          setStatus("error");
          setError(
            "Your payment has not yet been confirmed. If money was deducted, please contact us before trying to pay again."
          );
          return;
        }

        const orderResponse = await api.get(
          `orders/${orderId}/`,
          config
        );

        if (cancelled) return;

        setOrder(orderResponse.data);
        setStatus("success");
        clearCart();

        // Remove the token after successful confirmation.
        sessionStorage.removeItem(`orderToken_${orderId}`);
      } catch (err) {
        if (cancelled) return;

        setStatus("error");
        setError(
          err.response?.data?.message ||
            "We could not verify your payment. If money was deducted, please contact us."
        );
      }
    };

    verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [searchParams, clearCart]);

  if (status === "verifying") {
    return (
      <main className="order-success-page">
        <div className="order-success-container">
          <p className="section-tagline">HAVENHOMESTYLES</p>
          <h1>Verifying Payment...</h1>
          <p className="success-message">
            Please wait while we confirm your payment.
            Do not close this page.
          </p>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="order-success-page">
        <div className="order-success-container">
          <div className="success-icon">!</div>
          <p className="section-tagline">HAVENHOMESTYLES</p>
          <h1>Payment Not Confirmed</h1>
          <p className="success-message">{error}</p>

          <div className="success-actions">
            <Link to="/shop" className="continue-shopping">
              Return to Shop
            </Link>
            <Link to="/" className="back-home">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="order-success-page">
      <div className="order-success-container">
        <div className="success-icon">✓</div>
        <p className="section-tagline">HAVENHOMESTYLES</p>
        <h1>Payment Successful!</h1>
        <p className="success-message">
          Thank you for shopping with HavenHomeStyles.
          Your payment has been confirmed and we've
          received your order.
        </p>

        {order && (
          <div className="order-number">
            <span>Order Number</span>
            <strong>#{order.id}</strong>
          </div>
        )}

        <div className="success-actions">
          <Link to="/shop" className="continue-shopping">
            Continue Shopping →
          </Link>
          <Link to="/" className="back-home">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default OrderSuccess;
