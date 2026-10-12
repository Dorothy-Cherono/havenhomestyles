
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Categories() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("products/")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const categories = [
    {
      name: "Beddings",
      description: "Discover comfortable bedding for restful nights.",
    },
    {
      name: "Home Decor",
      description: "Add warmth and personality to your living space.",
    },
    {
      name: "Home Essentials",
      description: "Find practical essentials for a beautiful home.",
    },
  ];

  const getCategoryProducts = (categoryName) =>
    products.filter(
      (product) =>
        product.category?.toLowerCase() === categoryName.toLowerCase()
    );

  return (
    <main className="categories-page">
      <section className="categories-header">
        <p className="section-tagline">EXPLORE OUR COLLECTIONS</p>
        <h1>Shop by Category</h1>
        <p>
          Discover thoughtfully selected pieces to make your home
          comfortable, beautiful, and uniquely yours.
        </p>
      </section>

      <section className="categories-grid">
        {categories.map((category) => {
          const categoryProducts = getCategoryProducts(category.name);

          return (
            <article className="category-card" key={category.name}>
              <div className="category-card-image">
                {categoryProducts[0]?.image ? (
                  <img
                    src={categoryProducts[0].image}
                    alt={category.name}
                  />
                ) : (
                  <span>{category.name}</span>
                )}
              </div>

              <div className="category-card-content">
                <h2>{category.name}</h2>
                <p>{category.description}</p>
                <p className="category-product-count">
                  {loading
                    ? "Loading products..."
                    : `${categoryProducts.length} products`}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/shop?category=${encodeURIComponent(category.name)}`
                    )
                  }
                >
                  Shop Collection →
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default Categories;
