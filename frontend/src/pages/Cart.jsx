import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    subtotal,
  } = useCart();

  const delivery = cartItems.length > 0 ? 300 : 0;
  const total = subtotal + delivery;

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">

        <div className="empty-cart">

          <p className="section-tagline">
            YOUR SHOPPING BAG
          </p>

          <h1>Your Cart is Empty</h1>

          <p>
            You haven't added anything to your cart yet.
          </p>

          <Link to="/shop" className="continue-shopping">
            Continue Shopping →
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="cart-page">

      <div className="cart-container">

        <div className="cart-header">

          <p className="section-tagline">
            YOUR SHOPPING BAG
          </p>

          <h1>Your Cart</h1>

          <p>
            Review your selected items before proceeding to checkout.
          </p>

        </div>

        <div className="cart-layout">

          {/* Cart Items */}

          <div className="cart-items">

            {cartItems.map((item) => (

              <div
                className="cart-item"
                key={`${item.id}-${item.size}`}
              >

                <div className="cart-item-image">
                  <span>HavenHomeStyles</span>
                </div>

                <div className="cart-item-details">

                  <p className="cart-item-category">
                    {item.category}
                  </p>

                  <h3>{item.name}</h3>

                  <p>
                    Size: {item.size}
                  </p>

                  <p className="cart-item-price">
                    KSh {item.price.toLocaleString()}
                  </p>

                  <div className="cart-item-actions">

                    <div className="cart-quantity">

                      <button
                        onClick={() =>
                          decreaseQuantity(item.id, item.size)
                        }
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          increaseQuantity(item.id, item.size)
                        }
                      >
                        +
                      </button>

                    </div>

                    <button
                      className="remove-button"
                      onClick={() =>
                        removeFromCart(item.id, item.size)
                      }
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* Order Summary */}

          <div className="cart-summary">

            <h2>Order Summary</h2>

            <div className="summary-row">

              <span>Subtotal</span>

              <span>
                KSh {subtotal.toLocaleString()}
              </span>

            </div>

            <div className="summary-row">

              <span>Delivery</span>

              <span>
                KSh {delivery.toLocaleString()}
              </span>

            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">

              <span>Total</span>

              <span>
                KSh {total.toLocaleString()}
              </span>

            </div>

            <Link
  to="/checkout"
  className="checkout-button"
>
  Proceed to Checkout
</Link>

            <p className="secure-payment">
              Secure checkout • Safe & reliable payment
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Cart;