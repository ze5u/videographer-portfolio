import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: your.email@gmail.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>

          <div className="footer-section">
            <h3>Follow Me</h3>
            <div className="social-links">
              <a href="https://instagram.com/yourhandle" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a href="https://youtube.com/yourchannel" target="_blank" rel="noopener noreferrer">
                YouTube
              </a>
              <a href="https://vimeo.com/yourhandle" target="_blank" rel="noopener noreferrer">
                Vimeo
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <a href="/portfolio">Portfolio</a>
            <a href="/booking">Book Me</a>
            <a href="/about">About</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 YourName Videography. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;