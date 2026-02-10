import './Header.css';

function Header() {
  return (
    <header className="header">
      <a href="/" className="logo">yasiru.</a>
      <nav className="nav">
        <a href="#home" className="nav-link desktop-only">home</a>
        <a href="#publications" className="nav-link desktop-only">publications</a>
        <a href="#blog" className="nav-link">blog</a>
        <a href="#projects" className="nav-link">projects</a>
      </nav>
    </header>
  );
}

export default Header;
