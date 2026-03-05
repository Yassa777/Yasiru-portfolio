import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo">yasiru.</Link>
      <nav className="nav">
        <Link to="/" className="nav-link desktop-only">home</Link>
        <a href="#publications" className="nav-link desktop-only">publications</a>
        <Link to="/blog/sri-lankan-banking-thesis" className="nav-link">blog</Link>
        <a href="#projects" className="nav-link">projects</a>
      </nav>
    </header>
  );
}

export default Header;
