import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
  const [featuredVideos, setFeaturedVideos] = useState([]);

  useEffect(() => {
    fetchFeaturedVideos();
  }, []);

  const fetchFeaturedVideos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/videos');
      setFeaturedVideos(response.data.slice(0, 6)); // Get first 6 videos
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">
              Cinematic stories that bring brands & moments to life.
            </h1>
            <p className="hero-subtitle">
              Professional videography for weddings, commercials, events, and more
            </p>
            <div className="hero-buttons">
              <Link to="/portfolio" className="btn btn-primary">
                🎬 View Portfolio
              </Link>
              <Link to="/booking" className="btn btn-secondary">
                📅 Book Me
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">💍</div>
              <h3>Wedding Films</h3>
              <p>Emotional, cinematic wedding videos that capture your special day</p>
            </div>
            <div className="service-card">
              <div className="service-icon">📺</div>
              <h3>Commercial Ads</h3>
              <p>Brand stories that convert and engage your audience</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🎉</div>
              <h3>Events</h3>
              <p>Corporate and social events professionally documented</p>
            </div>
            <div className="service-card">
              <div className="service-icon">📦</div>
              <h3>Product Videos</h3>
              <p>Showcase your products with stunning visuals</p>
            </div>
            <div className="service-card">
              <div className="service-icon">📱</div>
              <h3>Social Media Reels</h3>
              <p>Viral-ready short-form content for maximum engagement</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Featured Work</h2>
          <div className="video-grid">
            {featuredVideos.map((video) => (
              <div key={video._id} className="video-card">
                <img src={video.thumbnail || '/placeholder.jpg'} alt={video.title} />
                <div className="video-info">
                  <h3>{video.title}</h3>
                  <p>{video.category}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/portfolio" className="btn btn-primary">
              View All Work
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Create Something Amazing?</h2>
          <p>Let's bring your vision to life with professional videography</p>
          <Link to="/booking" className="btn btn-primary btn-large">
            Book Your Project
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;