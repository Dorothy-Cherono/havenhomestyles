
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../api/api";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [addingProductId, setAddingProductId] = useState(null);
  const [addedProductId, setAddedProductId] = useState(null);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("products/")
      .then((response) => {
        setProducts(response.data.slice(0, 4));
      })
      .catch((error) => {
        console.error("Error fetching featured products:", error);
      });
  }, []);

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      return;
    }

    setAddingProductId(product.id);

    addToCart(
      {
        ...product,
        size: "King",
      },
      1
    );

    setAddedProductId(product.id);
    setAddingProductId(null);

    // Reset the button label after a short interval.
    setTimeout(() => {
      setAddedProductId((currentId) =>
        currentId === product.id ? null : currentId
      );
    }, 2000);
  };

  return (
    <section className="featured-section">
      <div className="section-heading">
        <p className="section-tagline">OUR FAVOURITES</p>
        <h2>Featured Products</h2>
        <p>
          Discover some of our most loved pieces, carefully selected
          for beautiful and comfortable homes.
        </p>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-image">
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <span>HavenHomeStyles</span>
              )}
            </div>

            <div className="product-info">
              <h3>{product.name}</h3>

              <p className="product-price">
                KSh {Number(product.price).toLocaleString()}
              </p>

              <button
                type="button"
                className="add-to-cart"
                disabled={product.stock <= 0 || addingProductId === product.id}
                onClick={() => handleAddToCart(product)}
              >
                {product.stock <= 0
                  ? "Out of Stock"
                  : addedProductId === product.id
                  ? "Added to Cart ✓"
                  : "Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="view-all-container">
        <button
          type="button"
          className="view-all-button"
          onClick={() => navigate("/shop")}
        >
          View All Products →
        </button>
      </div>
    </section>
  );
}

export default FeaturedProducts;
