import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('videos');
  const [videos, setVideos] = useState([]);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await axios.get('http://localhost:5000/api/admin/verify', {
        withCredentials: true
      });
      setIsAuthenticated(true);
      fetchData();
    } catch (error) {
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const [videosRes, bookingsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/videos', { withCredentials: true }),
        axios.get('http://localhost:5000/api/admin/bookings', { withCredentials: true })
      ]);
      
      setVideos(videosRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/admin/logout', {}, {
        withCredentials: true
      });
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/bookings/${bookingId}`,
        { status },
        { withCredentials: true }
      );
      fetchData();
      alert('Booking status updated!');
    } catch (error) {
      alert('Error updating booking status');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!isAuthenticated) return null;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </div>

      <div className="admin-content">
        <div className="admin-tabs">
          <button
            className={activeTab === 'videos' ? 'active' : ''}
            onClick={() => setActiveTab('videos')}
          >
            📹 Videos ({videos.length})
          </button>
          <button
            className={activeTab === 'bookings' ? 'active' : ''}
            onClick={() => setActiveTab('bookings')}
          >
            📅 Bookings ({bookings.length})
          </button>
        </div>

        {activeTab === 'videos' && (
          <div className="videos-section">
            <h2>Manage Videos</h2>
            <div className="videos-list">
              {videos.length === 0 ? (
                <p>No videos uploaded yet</p>
              ) : (
                videos.map(video => (
                  <div key={video._id} className="video-item">
                    <img 
                      src={`http://localhost:5000${video.thumbnail}`} 
                      alt={video.title}
                      width="100"
                    />
                    <div className="video-details">
                      <h3>{video.title}</h3>
                      <p>{video.category}</p>
                      <span className={`status ${video.status}`}>
                        {video.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bookings-section">
            <h2>Manage Bookings</h2>
            <div className="bookings-list">
              {bookings.length === 0 ? (
                <p>No bookings yet</p>
              ) : (
                bookings.map(booking => (
                  <div key={booking._id} className="booking-item">
                    <div className="booking-header">
                      <h3>{booking.fullName}</h3>
                      <span className={`status ${booking.status}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="booking-details">
                      <p><strong>Event:</strong> {booking.eventType}</p>
                      <p><strong>Date:</strong> {new Date(booking.eventDate).toLocaleDateString()}</p>
                      <p><strong>Location:</strong> {booking.eventLocation}</p>
                      <p><strong>Budget:</strong> {booking.budgetRange}</p>
                      <p><strong>Email:</strong> {booking.email}</p>
                      <p><strong>Phone:</strong> {booking.phone}</p>
                      <p><strong>Description:</strong> {booking.projectDescription}</p>
                    </div>
                    {booking.status === 'pending' && (
                      <div className="booking-actions">
                        <button
                          className="btn btn-success"
                          onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                        >
                          Confirm
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => updateBookingStatus(booking._id, 'rejected')}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;