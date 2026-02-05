import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PortfolioPage.css';

const PortfolioPage = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Weddings', 'Commercial', 'Events', 'Reels', 'YouTube'];

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/videos');
      setVideos(response.data);
      setFilteredVideos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setLoading(false);
    }
  };

  const filterVideos = (category) => {
    setActiveCategory(category);
    if (category === 'All') {
      setFilteredVideos(videos);
    } else {
      setFilteredVideos(videos.filter(video => video.category === category));
    }
  };

  const openVideo = (video) => {
    setSelectedVideo(video);
    document.body.style.overflow = 'hidden';
  };

  const closeVideo = () => {
    setSelectedVideo(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="portfolio-page">
      <div className="container">
        <h1>Portfolio</h1>
        <p className="subtitle">Explore my cinematic work</p>

        {/* Category Filters */}
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => filterVideos(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        {loading ? (
          <div className="loading">Loading videos...</div>
        ) : filteredVideos.length === 0 ? (
          <div className="no-videos">No videos found in this category</div>
        ) : (
          <div className="video-grid">
            {filteredVideos.map(video => (
              <div 
                key={video._id} 
                className="video-card"
                onClick={() => openVideo(video)}
              >
                <div className="video-thumbnail">
                  <img 
                    src={`http://localhost:5000${video.thumbnail}` || '/placeholder.jpg'}
                    alt={video.title}
                    loading="lazy"
                  />
                  <div className="play-overlay">
                    <div className="play-button">▶</div>
                  </div>
                </div>
                <div className="video-info">
                  <h3>{video.title}</h3>
                  <p>{video.description}</p>
                  <span className="video-category">{video.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="video-modal" onClick={closeVideo}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeVideo}>✕</button>
            
            <div className="video-player">
              {selectedVideo.platform === 'youtube' && (
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
              {selectedVideo.platform === 'vimeo' && (
                <iframe
                  src={`https://player.vimeo.com/video/${selectedVideo.videoId}`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              )}
              {selectedVideo.platform === 'self-hosted' && (
                <video controls autoPlay>
                  <source src={selectedVideo.videoUrl} type="video/mp4" />
                </video>
              )}
            </div>
            
            <div className="video-details">
              <h2>{selectedVideo.title}</h2>
              <p>{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;