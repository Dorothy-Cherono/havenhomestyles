
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-tagline">WELCOME TO HAVENHOMESTYLES</p>

        <h1>
          Make Your Home
          <br />
          Feel Like Home.
        </h1>

        <p className="hero-description">
          Discover beautiful beddings, home décor and everyday essentials
          thoughtfully selected to make your space comfortable and beautiful.
        </p>

        <div className="hero-buttons">
          <button
            className="primary-button"
            onClick={() => navigate("/shop")}
          >
            Shop Now
          </button>

          <button
            className="secondary-button"
            onClick={() => navigate("/shop")}
          >
            Explore Collections
          </button>
        </div>
      </div>

      <div className="hero-image">
        <div className="hero-image-placeholder">
          <span>HavenHomeStyles</span>
          <p>Beautiful living starts here.</p>
        </div>
      </div>
    </section>
  );
}

export default Hero;
