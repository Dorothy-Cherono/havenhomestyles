
import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const emailSubject = encodeURIComponent(
      formData.subject || "HavenHomeStyles customer enquiry"
    );

    const emailBody = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );

    window.location.href =
      `mailto:YOUR_BUSINESS_EMAIL?subject=${emailSubject}&body=${emailBody}`;

    setSubmitted(true);
  };

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <p className="section-tagline">WE'RE HERE TO HELP</p>
        <h1>Get in Touch</h1>
        <p>
          Have a question about our products or your order?
          We'd love to hear from you.
        </p>
      </section>

      <section className="contact-content">
        <div className="contact-information">
          <p className="section-tagline">CONTACT US</p>
          <h2>Let's Talk About Your Home</h2>
          <p className="contact-intro">
            Whether you need help choosing a product or have a question
            about an order, send us a message and we'll be happy to help.
          </p>

          <div className="contact-detail">
            <span className="contact-detail-icon">✉</span>
            <div>
              <h3>Email</h3>
              <p>cheronodorothy84@gmail.com</p>
            </div>
          </div>

          <div className="contact-detail">
            <span className="contact-detail-icon">⌖</span>
            <div>
              <h3>Location</h3>
              <p>Nairobi, Kenya</p>
            </div>
          </div>

          <div className="contact-detail">
            <span className="contact-detail-icon">♡</span>
            <div>
              <h3>Customer Care</h3>
              <p>We're happy to assist with product and order enquiries.</p>
            </div>
          </div>
        </div>

        <div className="contact-form-container">
          <h2>Send Us a Message</h2>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form-row">
              <div className="contact-field">
                <label htmlFor="contact-name">Full Name</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-field">
                <label htmlFor="contact-email">Email Address</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="contact-field">
              <label htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                placeholder="What can we help you with?"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="contact-field">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows="6"
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="contact-submit-button">
              Send Message →
            </button>

            {submitted && (
              <p className="contact-notice">
                Your email application should open with your message.
                Please send the email there to complete your enquiry.
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}

export default Contact;
