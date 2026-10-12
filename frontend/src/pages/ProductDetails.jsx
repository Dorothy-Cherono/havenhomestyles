import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../api/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("King");

  useEffect(() => {
    api
      .get(`products/${id}/`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, [id]);

  const increaseQuantity = () => {
  if (quantity < product.stock) {
    setQuantity(quantity + 1);
  }
};

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (!product) {
    return (
      <main className="product-details-page">
        <div className="product-details-container">
          <p>Loading product...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="product-details-page">

      <div className="product-details-container">

      <div className="product-details-image">
  {product.image ? (
    <img
      src={product.image}
      alt={product.name}
    />
  ) : (
    <span>HavenHomeStyles</span>
  )}
</div>

        <div className="product-details-info">

          <p className="product-details-category">
            {product.category}
          </p>

          <h1>{product.name}</h1>

          <p className="product-details-price">
            KSh {Number(product.price).toLocaleString()}
          </p>

          <div className="product-divider"></div>

          <p className="product-description">
            {product.description}
          </p>

          <div className="product-option">
            <h3>Size</h3>

            <div className="size-options">
              {["Single", "Double", "Queen", "King"].map((size) => (
                <button
                  key={size}
                  className={selectedSize === size ? "selected" : ""}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="product-option">
            <h3>Quantity</h3>

            <div className="quantity-selector">

              <button onClick={decreaseQuantity}>
                −
              </button>

              <span>{quantity}</span>

              <button onClick={increaseQuantity}>
                +
              </button>

            </div>
          </div>

          {/* STOCK STATUS */}
<div className="product-stock">

  {product.stock === 0 ? (
    <p className="out-of-stock">
      ✕ Out of Stock
    </p>
  ) : product.stock <= 3 ? (
    <p className="low-stock">
      ⚠ Only {product.stock} left
    </p>
  ) : (
    <p className="in-stock">
      ✓ In Stock
    </p>
  )}

</div>


{/* ADD TO CART */}
<button
  className="details-add-cart"
  disabled={
    product.stock === 0 ||
    quantity > product.stock
  }
  onClick={() => {

    addToCart(
      {
        ...product,
        size: selectedSize,
      },
      quantity
    );

    navigate("/cart");

  }}
>
  {product.stock === 0
    ? "Out of Stock"
    : quantity > product.stock
    ? "Quantity Unavailable"
    : "Add to Cart"}
</button>

          <div className="product-extra-info">
            <p>✓ Quality checked</p>
            <p>✓ Carefully packaged</p>
            <p>✓ Delivery available</p>
          </div>

        </div>

      </div>

    </main>
  );
}

export default ProductDetails;