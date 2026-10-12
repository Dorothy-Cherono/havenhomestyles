
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  return (
    <main className="about-page">
      <section className="about-hero">
        <p className="section-tagline">WELCOME TO HAVENHOMESTYLES</p>
        <h1>Making Every House Feel Like Home</h1>
        <p className="about-hero-description">
          We believe that a beautiful home begins with the little things.
          From comfortable bedding to thoughtful décor, we help you create
          spaces that feel warm, welcoming, and uniquely yours.
        </p>

        <button
          type="button"
          className="about-primary-button"
          onClick={() => navigate("/shop")}
        >
          Explore Our Collection →
        </button>
      </section>

      <section className="about-story">
        <div className="about-story-content">
          <p className="section-tagline">OUR STORY</p>
          <h2>A Little More Comfort. A Lot More Home.</h2>
          <p>
            HavenHomeStyles was created around a simple idea: your home
            should be a place where comfort meets style. The right bedding,
            décor, and everyday essentials can make ordinary moments feel
            special.
          </p>
          <p>
            Our goal is to make discovering those pieces simple and enjoyable,
            helping you find items that complement your space and your
            lifestyle.
          </p>
        </div>

        <div className="about-story-decoration">
          <div className="about-decoration-inner">
            <span>HAVEN</span>
            <span>HOME</span>
            <span>STYLES</span>
            <p>Comfort lives here.</p>
          </div>
        </div>
      </section>

      <section className="about-mission">
        <p className="section-tagline">WHAT WE BELIEVE</p>
        <h2>Our Mission</h2>
        <p>
          To help people create comfortable, beautiful living spaces through
          thoughtfully selected home essentials, inspiring décor, and a
          convenient shopping experience.
        </p>
      </section>

      <section className="about-values">
        <div className="about-values-heading">
          <p className="section-tagline">THE HAVEN EXPERIENCE</p>
          <h2>Why Choose HavenHomeStyles?</h2>
        </div>

        <div className="about-values-grid">
          <article className="about-value-card">
            <span className="about-value-number">01</span>
            <h3>Comfort First</h3>
            <p>
              Discover bedding and essentials designed to help make your
              everyday spaces more comfortable.
            </p>
          </article>

          <article className="about-value-card">
            <span className="about-value-number">02</span>
            <h3>Thoughtful Style</h3>
            <p>
              Explore pieces that bring warmth, character, and a personal
              touch to your home.
            </p>
          </article>

          <article className="about-value-card">
            <span className="about-value-number">03</span>
            <h3>Easy Shopping</h3>
            <p>
              Browse our collections and discover home essentials in one
              convenient online store.
            </p>
          </article>
        </div>
      </section>

      <section className="about-cta">
        <p className="section-tagline">YOUR HOME, YOUR HAVEN</p>
        <h2>Let's Make Your Space Feel Special</h2>
        <p>Find something you'll love for your home.</p>
        <button
          type="button"
          className="about-primary-button"
          onClick={() => navigate("/shop")}
        >
          Shop Our Collection →
        </button>
      </section>
    </main>
  );
}

export default About;
