import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ darkMode, setDarkMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="logo">
          🎬 YourName
        </Link>

        <button 
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/portfolio" onClick={() => setMenuOpen(false)}>Portfolio</Link>
          <Link to="/booking" onClick={() => setMenuOpen(false)}>Booking</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          
          <button 
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;