import './FeaturedWork.css';

const works = [
  {
    id: 1,
    category: 'mechanistic interpretability',
    title: 'Decomposing Attention Heads in Small Language Models',
    excerpt:
      'An exploration of how attention mechanisms in transformer architectures encode semantic relationships, with implications for alignment research.',
    date: 'January 2026',
  },
  {
    id: 2,
    category: 'macroeconomics',
    title: 'Revisiting the Phillips Curve in Post-Pandemic Economies',
    excerpt:
      'Examining the relationship between inflation and unemployment in the context of unprecedented monetary policy interventions.',
    date: 'December 2025',
  },
  {
    id: 3,
    category: 'financial modelling',
    title: 'Stochastic Volatility Models for Emerging Markets',
    excerpt:
      'Adapting classical volatility models to capture the unique dynamics of emerging market equities and currencies.',
    date: 'November 2025',
  },
];

function FeaturedWork() {
  return (
    <section className="featured-work">
      <div className="featured-work-container">
        <h2 className="section-title">Recent Work</h2>
        <div className="works-grid">
          {works.map((work) => (
            <article key={work.id} className="work-card">
              <span className="work-category">{work.category}</span>
              <h3 className="work-title">{work.title}</h3>
              <p className="work-excerpt">{work.excerpt}</p>
              <span className="work-date">{work.date}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedWork;
