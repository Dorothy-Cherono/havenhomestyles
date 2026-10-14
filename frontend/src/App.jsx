import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Hero from "./components/Hero";
import CategorySection from "./components/CategorySection";
import FeaturedProducts from "./components/FeaturedProducts";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/checkout";

import OrderSuccess from "./pages/ordersuccess.jsx";

import Categories from "./pages/Categories";
import About from "./pages/About";
import Contact from "./pages/Contact";
import "./App.css";

function Home() {
  return (
    <div>
      <Hero />
      <CategorySection />
      <FeaturedProducts />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/about" element={<About />} />
        
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;