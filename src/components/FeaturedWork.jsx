import { Link } from 'react-router-dom';
import './FeaturedWork.css';

const works = [
  {
    id: 1,
    category: 'macroeconomics',
    title: 'The Sri Lankan Banking Thesis: A Closer Look',
    excerpt:
      'Examining the viral investment thesis around HNB and COMB on the Colombo Stock Exchange — credit expansion, low multiples, and the case for patient capital.',
    date: 'March 2026',
    link: '/blog/sri-lankan-banking-thesis',
  },
];

function FeaturedWork() {
  return (
    <section className="featured-work">
      <div className="featured-work-container">
        <h2 className="section-title">Recent Work</h2>
        <div className="works-grid">
          {works.map((work) => (
            <Link to={work.link} key={work.id} className="work-card-link">
              <article className="work-card">
                <span className="work-category">{work.category}</span>
                <h3 className="work-title">{work.title}</h3>
                <p className="work-excerpt">{work.excerpt}</p>
                <span className="work-date">{work.date}</span>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedWork;
