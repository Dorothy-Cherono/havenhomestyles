import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function Shop() {
    const [products, setProducts] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortOption, setSortOption] = useState("default");

    useEffect(() => {
        api
            .get("products/")
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, []);

    // Get unique categories
    const categories = [
        "All",
        ...new Set(products.map((product) => product.category)),
    ];

    // Filter products
    let filteredProducts = products.filter((product) => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // Sort products
    if (sortOption === "price-low") {
        filteredProducts = [...filteredProducts].sort(
            (a, b) => Number(a.price) - Number(b.price)
        );
    }

    if (sortOption === "price-high") {
        filteredProducts = [...filteredProducts].sort(
            (a, b) => Number(b.price) - Number(a.price)
        );
    }

    if (sortOption === "newest") {
        filteredProducts = [...filteredProducts].sort(
            (a, b) =>
                new Date(b.created_at) - new Date(a.created_at)
        );
    }

    return (
        <main className="shop-page">

            {/* SHOP HEADER */}
            <section className="shop-header">

                <p className="section-tagline">
                    HAVENHOMESTYLES
                </p>

                <h1>Shop Our Collection</h1>

                <p>
                    Discover beautiful pieces carefully selected to make your
                    home comfortable, stylish and welcoming.
                </p>

            </section>


            {/* SHOP CONTENT */}
            <section className="shop-content">

                {/* FILTER BAR */}
                <div className="shop-filters">

                    {/* SEARCH */}
                    <div className="shop-search">

                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                        />

                    </div>


                    {/* CATEGORY */}
                    <div className="shop-category">

                        <select
                            value={selectedCategory}
                            onChange={(event) =>
                                setSelectedCategory(event.target.value)
                            }
                        >
                            {categories.map((category) => (
                                <option
                                    key={category}
                                    value={category}
                                >
                                    {category}
                                </option>
                            ))}
                        </select>

                    </div>


                    {/* SORT */}
                    <div className="shop-sort">

                        <select
                            value={sortOption}
                            onChange={(event) =>
                                setSortOption(event.target.value)
                            }
                        >
                            <option value="default">
                                Sort by
                            </option>

                            <option value="price-low">
                                Price: Low to High
                            </option>

                            <option value="price-high">
                                Price: High to Low
                            </option>

                            <option value="newest">
                                Newest
                            </option>

                        </select>

                    </div>

                </div>


                {/* PRODUCT COUNT */}
                <div className="shop-top">

                    <p>
                        {filteredProducts.length}{" "}
                        {filteredProducts.length === 1
                            ? "product"
                            : "products"}
                    </p>

                </div>


                {/* PRODUCTS */}
                {filteredProducts.length > 0 ? (

                    <div className="shop-grid">

                        {filteredProducts.map((product) => (

                            <div
                                className="shop-product-card"
                                key={product.id}
                            >

                                <div className="shop-product-image">

                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                        />
                                    ) : (
                                        <span>
                                            HavenHomeStyles
                                        </span>
                                    )}

                                </div>


                                <div className="shop-product-info">

                                    <p className="shop-product-category">
                                        {product.category}
                                    </p>

                                    <h3>
                                        {product.name}
                                    </h3>

                                    <p className="shop-product-price">
                                        KSh{" "}
                                        {Number(product.price).toLocaleString()}
                                    </p>

                                    <Link
                                        to={`/product/${product.id}`}
                                        className="view-product"
                                    >
                                        View Product →
                                    </Link>

                                </div>

                            </div>

                        ))}

                    </div>

                ) : (

                    <div className="no-products">

                        <h2>No products found</h2>

                        <p>
                            Try changing your search or category.
                        </p>

                    </div>

                )}

            </section>

        </main>
    );
}

export default Shop;