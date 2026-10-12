
import { useNavigate } from "react-router-dom";

function CategorySection() {
  const navigate = useNavigate();

  const categories = [
    {
      name: "Beddings",
      description: "Comfortable and beautiful bedding for every bedroom.",
    },
    {
      name: "Home Décor",
      description: "Elegant pieces that bring personality to your space.",
    },
    {
      name: "Home Essentials",
      description: "Practical essentials designed for everyday living.",
    },
  ];

  const handleShopCollection = (categoryName) => {
    navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="category-section">
      <div className="section-heading">
        <p className="section-tagline">EXPLORE OUR COLLECTIONS</p>

        <h2>Shop by Category</h2>

        <p>
          Find carefully selected pieces to make your home more comfortable,
          beautiful and uniquely yours.
        </p>
      </div>

      <div className="category-grid">
        {categories.map((category) => (
          <div className="category-card" key={category.name}>
            <div className="category-image">
              <span>{category.name}</span>
            </div>

            <div className="category-info">
              <h3>{category.name}</h3>

              <p>{category.description}</p>

              <button
                type="button"
                onClick={() => handleShopCollection(category.name)}
              >
                Shop Collection →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CategorySection;
