import { Link } from 'react-router-dom';
import './Hero.css';

const socials = [
  { href: 'mailto:hello@yasiru.com', label: 'Email', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13L2 4"/></svg>
  )},
  { href: 'https://twitter.com/yasiru', label: 'Twitter', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  )},
  { href: 'https://github.com/yasiru', label: 'GitHub', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
  )},
  { href: 'https://scholar.google.com', label: 'Scholar', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 100 14 7 7 0 000-14z"/></svg>
  )},
];

const works = [
  {
    id: 1,
    category: 'macroeconomics',
    title: 'The Sri Lankan Banking Thesis: A Closer Look',
    excerpt:
      'Credit expansion, low multiples, and the case for patient capital on the Colombo Stock Exchange.',
    date: 'March 2026',
    link: '/blog/sri-lankan-banking-thesis',
  },
];

function Hero() {
  return (
    <section id="home" className="hero">
      {/* Left — image */}
      <div className="hero-image-col">
        <img
          src="/assets/hero.jpg"
          alt=""
          className="hero-feature-img"
        />
      </div>

      {/* Right — intro + work */}
      <div className="hero-content-col">
        <div className="hero-intro">
          <span className="hero-label">Portfolio / 2026</span>
          <h1 className="hero-name">Exploring Markets</h1>
          <div className="hero-line" />
          <p className="hero-tagline">
            macro-financial research<br />
            & Sri Lankan markets
          </p>
          <div className="hero-socials">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith('mailto') ? undefined : '_blank'}
                rel={s.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                className="social-icon"
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="hero-work">
          <span className="hero-work-label">Recent Work</span>
          {works.map((work) => (
            <Link to={work.link} key={work.id} className="hero-work-card">
              <div className="hero-work-card-inner">
                <div>
                  <span className="hero-work-category">{work.category}</span>
                  <h3 className="hero-work-title">{work.title}</h3>
                  <p className="hero-work-excerpt">{work.excerpt}</p>
                  <span className="hero-work-date">{work.date}</span>
                </div>
                <span className="hero-work-arrow">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
