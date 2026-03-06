import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo">yasiru.</Link>
      <nav className="nav">
        <Link to="/" className="nav-link">home</Link>
        <Link to="/about" className="nav-link">about</Link>
        <Link to="/blog/sri-lankan-banking-thesis" className="nav-link">blog</Link>
      </nav>
    </header>
  );
}

export default Header;
