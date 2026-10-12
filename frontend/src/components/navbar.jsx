import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/" className="logo">
          HavenHome<span>Styles</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <Link to="/cart" className="cart">
          🛒
          <span>Cart</span>

          {cartCount > 0 && (
            <span className="cart-count">
              {cartCount}
            </span>
          )}
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;