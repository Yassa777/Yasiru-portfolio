import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedWork from './components/FeaturedWork';
import Contact from './components/Contact';
import BlogPost from './components/BlogPost';
import './App.css';

function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedWork />
      <Contact />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog/sri-lankan-banking-thesis" element={<BlogPost />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Yasiru. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
