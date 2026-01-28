import './Contact.css';

function Contact() {
  return (
    <section className="contact">
      <div className="contact-container">
        <div className="contact-left">
          <h2 className="contact-title">Get in touch</h2>
          <p className="contact-text">
            Open to collaborations, research discussions, and interesting conversations.
          </p>
        </div>
        <div className="contact-links">
          <a href="mailto:hello@yasiru.com" className="contact-link">
            <span className="link-label">Email</span>
            <span className="link-value">hello@yasiru.com</span>
          </a>
          <a
            href="https://twitter.com/yasiru"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            <span className="link-label">Twitter</span>
            <span className="link-value">@yasiru</span>
          </a>
          <a
            href="https://github.com/yasiru"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            <span className="link-label">GitHub</span>
            <span className="link-value">github.com/yasiru</span>
          </a>
          <a
            href="https://scholar.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            <span className="link-label">Scholar</span>
            <span className="link-value">Google Scholar</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Contact;
