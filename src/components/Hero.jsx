import { useEffect, useState } from 'react';
import './Hero.css';

function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="home" className="hero">
      <div
        className="hero-bg"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <img
          src="/assets/newspaper.png"
          alt=""
          className="newspaper-bg"
        />
      </div>

      <div className="hero-content">
        <p className="tagline">
          I write about ideas ranging from
          <br />
          macroeconomics to financial modelling
          <br />
          to econometrics to mechanistic
          <br />
          interpretability
        </p>

        <div className="hero-socials">
          <a href="https://twitter.com/yasiru" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>

          <a href="mailto:hello@yasiru.com" className="social-link" aria-label="Email">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </a>

          <a href="https://linkedin.com/in/yasiru" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
          </a>

          <a href="https://scholar.google.com/citations?user=XXXX" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Google Scholar">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5z"/>
            </svg>
          </a>
        </div>
      </div>

      <div
        className="plant-container"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      >
        <img
          src="/assets/plant.png"
          alt="Decorative botanical illustration"
          className="plant"
        />
      </div>

      <div className="scroll-indicator" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
        <span className="scroll-text">recent work</span>
        <div className="scroll-arrow"></div>
      </div>

      <div className="petals-container">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`petal petal-${i + 1}`}></div>
        ))}
      </div>
    </section>
  );
}

export default Hero;
