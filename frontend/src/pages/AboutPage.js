import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="container">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-content">
            <h1>Hi, I'm [Your Name]</h1>
            <p className="tagline">Cinematic Storyteller & Visual Artist</p>
          </div>
          <div className="about-image">
            <img src="/profile.jpg" alt="Profile" />
          </div>
        </section>

        {/* Story Section */}
        <section className="story-section">
          <h2>My Story</h2>
          <p>
            For the past 8 years, I've been crafting cinematic stories that 
            capture the essence of moments and elevate brands. My approach combines 
            technical expertise with artistic vision to create videos that don't 
            just document—they emotionally connect.
          </p>
          <p>
            From intimate weddings to high-energy commercial shoots, I believe 
            every project deserves the same level of passion, precision, and 
            creative storytelling.
          </p>
        </section>

        {/* Skills Section */}
        <section className="skills-section">
          <h2>Skills & Tools</h2>
          <div className="skills-grid">
            <div className="skill-category">
              <h3>Cameras</h3>
              <ul>
                <li>Sony A7S III</li>
                <li>Canon R5</li>
                <li>DJI Ronin</li>
                <li>Blackmagic</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>Drones</h3>
              <ul>
                <li>DJI Mavic 3 Pro</li>
                <li>DJI FPV</li>
                <li>Aerial Cinematography</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>Editing Software</h3>
              <ul>
                <li>DaVinci Resolve</li>
                <li>Premiere Pro</li>
                <li>After Effects</li>
                <li>Final Cut Pro</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>Specialties</h3>
              <ul>
                <li>Color Grading</li>
                <li>Sound Design</li>
                <li>Motion Graphics</li>
                <li>Storytelling</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">8+</div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">200+</div>
              <div className="stat-label">Projects Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">150+</div>
              <div className="stat-label">Happy Clients</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">10+</div>
              <div className="stat-label">Awards Won</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;