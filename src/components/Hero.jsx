import { useEffect, useState, useMemo } from 'react';
import './Hero.css';

const ANIMAL_IMAGES = ['tiger', 'horse', 'flower'];

function Hero() {
  const [scrollY, setScrollY] = useState(0);

  const selectedAnimal = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * ANIMAL_IMAGES.length);
    return ANIMAL_IMAGES[randomIndex];
  }, []);

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
        <div className="animal-image-container">
          <img
            src={`/assets/${selectedAnimal}.png`}
            alt="Decorative illustration"
            className="animal-image"
          />
        </div>

        <div className="text-content">
          <p className="topic">Post AGI Economics.</p>
          <p className="topic">Macroforecasting.</p>
          <p className="topic">
            Neural Forecasting<br />
            Interpretability.
          </p>

          <p className="tagline">
            I write about ideas ranging from
            <br />
            macroeconomics to financial
            <br />
            modelling to econometrics to
            <br />
            mechanistic interpretability
          </p>
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
    </section>
  );
}

export default Hero;
