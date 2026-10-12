import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../api/api";

function Checkout() {
    const navigate = useNavigate();

    const {
        cartItems,
        subtotal,
        clearCart,
    } = useCart();
    const delivery = cartItems.length > 0 ? 300 : 0;
    const total = subtotal + delivery;

    const [formData, setFormData] = useState({
        customer_name: "",
        phone: "",
        email: "",
        delivery_location: "",
        delivery_notes: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setIsSubmitting(true);
        setError("");

        const orderData = {
            ...formData,

            subtotal: subtotal,
            delivery_fee: delivery,
            total: total,

            items: cartItems.map((item) => ({
                product: item.id,
                product_name: item.name,
                price: item.price,
                quantity: item.quantity,
                size: item.size || "",
            })),
        };

        try {
            // Step 1: Create the order
            const orderResponse = await api.post(
                "orders/",
                orderData
            );

            
const order = orderResponse.data;

// Save this order's private token for the payment confirmation page.
if (!order.public_token) {
    throw new Error(
        "The order access token was not returned. Please contact support before retrying payment."
    );
}

sessionStorage.setItem(
    `orderToken_${order.id}`,
    order.public_token
);

// Initialize Paystack payment using the private order token.
const paymentResponse = await api.post(
    `orders/${order.id}/paystack-payment/`,
    {},
    {
        headers: {
            "X-Order-Token": order.public_token,
        },
    }
);

// Redirect to Paystack checkout.
window.location.href =
    paymentResponse.data.authorization_url;


            console.log("Order created:", order);

            console.log(
                "Paystack payment initialized:",
                paymentResponse.data
            );

        

        } catch (error) {
            console.error(
                "Error creating order or initializing payment:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Something went wrong while starting your payment. Please try again."
            );

            setIsSubmitting(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <main className="checkout-page">

                <div className="empty-checkout">

                    <p className="section-tagline">
                        CHECKOUT
                    </p>

                    <h1>Your Cart is Empty</h1>

                    <p>
                        Add some products before proceeding to checkout.
                    </p>

                    <Link
                        to="/shop"
                        className="continue-shopping"
                    >
                        Continue Shopping →
                    </Link>

                </div>

            </main>
        );
    }

    return (
        <main className="checkout-page">

            <div className="checkout-container">

                {/* HEADER */}

                <div className="checkout-header">

                    <p className="section-tagline">
                        HAVENHOMESTYLES
                    </p>

                    <h1>Checkout</h1>

                    <p>
                        Complete your details below to place your order.
                    </p>

                </div>


                {/* CHECKOUT LAYOUT */}

                <div className="checkout-layout">

                    {/* CUSTOMER FORM */}

                    <div className="checkout-form-section">

                        <h2>Delivery Information</h2>

                        <form onSubmit={handleSubmit}>

                            <div className="form-group">

                                <label htmlFor="customer_name">
                                    Full Name
                                </label>

                                <input
                                    id="customer_name"
                                    name="customer_name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={formData.customer_name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="form-row">

                                <div className="form-group">

                                    <label htmlFor="phone">
                                        Phone Number
                                    </label>

                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="07XXXXXXXX"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label htmlFor="email">
                                        Email Address
                                    </label>

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>


                            <div className="form-group">

                                <label htmlFor="delivery_location">
                                    Delivery Location
                                </label>

                                <input
                                    id="delivery_location"
                                    name="delivery_location"
                                    type="text"
                                    placeholder="e.g. Kilimani, Nairobi"
                                    value={formData.delivery_location}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label htmlFor="delivery_notes">
                                    Delivery Notes
                                </label>

                                <textarea
                                    id="delivery_notes"
                                    name="delivery_notes"
                                    placeholder="Any additional delivery instructions..."
                                    value={formData.delivery_notes}
                                    onChange={handleChange}
                                    rows="4"
                                />

                            </div>


                            {error && (
                                <p className="checkout-error">
                                    {error}
                                </p>
                            )}


                            <button
                                type="submit"
                                className="place-order-button"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? "Preparing Payment..."
                                    : "Pay Now"}
                            </button>

                        </form>

                    </div>


                    {/* ORDER SUMMARY */}

                    <div className="checkout-summary">

                        <h2>Your Order</h2>

                        <div className="checkout-items">

                            {cartItems.map((item) => (

                                <div
                                    className="checkout-item"
                                    key={`${item.id}-${item.size}`}
                                >

                                    <div className="checkout-item-image">

                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                            />
                                        ) : (
                                            <span>HavenHomeStyles</span>
                                        )}

                                    </div>


                                    <div className="checkout-item-info">

                                        <h3>{item.name}</h3>

                                        {item.size && (
                                            <p>Size: {item.size}</p>
                                        )}

                                        <p>
                                            Quantity: {item.quantity}
                                        </p>

                                        <strong>
                                            KSh{" "}
                                            {(
                                                Number(item.price) *
                                                item.quantity
                                            ).toLocaleString()}
                                        </strong>

                                    </div>

                                </div>

                            ))}

                        </div>


                        <div className="checkout-divider"></div>


                        <div className="checkout-summary-row">

                            <span>Subtotal</span>

                            <span>
                                KSh {subtotal.toLocaleString()}
                            </span>

                        </div>


                        <div className="checkout-summary-row">

                            <span>Delivery</span>

                            <span>
                                KSh {delivery.toLocaleString()}
                            </span>

                        </div>


                        <div className="checkout-divider"></div>


                        <div className="checkout-total">

                            <span>Total</span>

                            <span>
                                KSh {total.toLocaleString()}
                            </span>

                        </div>


                        <p className="checkout-payment-note">
                            Payment will be completed after your order
                            details have been submitted.
                        </p>

                    </div>

                </div>

            </div>

        </main>
    );
}

export default Checkout;