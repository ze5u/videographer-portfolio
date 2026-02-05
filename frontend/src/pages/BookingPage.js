import React, { useState } from 'react';
import axios from 'axios';
import './BookingPage.css';

const BookingPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    eventLocation: '',
    budgetRange: '',
    projectDescription: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    if (file) {
      formDataToSend.append('referenceFile', file);
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/bookings',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setSubmitStatus('success');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          eventType: '',
          eventDate: '',
          eventLocation: '',
          budgetRange: '',
          projectDescription: ''
        });
        setFile(null);
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">
      <div className="container">
        <h1>Book Your Project</h1>
        <p className="subtitle">Let's create something amazing together</p>

        {submitStatus === 'success' ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Booking Request Received!</h2>
            <p>Thank you for your interest. I'll get back to you within 24 hours.</p>
            <div className="success-actions">
              <a 
                href="https://wa.me/YOUR_NUMBER" 
                className="btn btn-whatsapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 Chat on WhatsApp
              </a>
              <button 
                className="btn btn-secondary"
                onClick={() => setSubmitStatus(null)}
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          <form className="booking-form" onSubmit={handleSubmit}>
            {submitStatus === 'error' && (
              <div className="error-message">
                {errorMessage}
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone / WhatsApp *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Event Type *</label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select event type</option>
                  <option value="wedding">Wedding</option>
                  <option value="commercial">Commercial Ad</option>
                  <option value="event">Event</option>
                  <option value="product">Product Video</option>
                  <option value="reel">Social Media Reel</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Event Date *</label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label>Event Location *</label>
                <input
                  type="text"
                  name="eventLocation"
                  value={formData.eventLocation}
                  onChange={handleChange}
                  placeholder="City, State"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Budget Range *</label>
                <select
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select budget range</option>
                  <option value="under-1000">Under $1,000</option>
                  <option value="1000-3000">$1,000 - $3,000</option>
                  <option value="3000-5000">$3,000 - $5,000</option>
                  <option value="5000-10000">$5,000 - $10,000</option>
                  <option value="above-10000">Above $10,000</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Project Description *</label>
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Tell me about your project, vision, and any specific requirements..."
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Reference File (Optional)</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                />
                <small>Upload a reference image or video (Max 10MB)</small>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-submit"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Booking Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingPage;