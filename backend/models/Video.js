const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Weddings', 'Commercial', 'Events', 'Reels', 'YouTube']
  },
  platform: {
    type: String,
    enum: ['youtube', 'vimeo', 'self-hosted'],
    default: 'youtube'
  },
  videoId: String,
  videoUrl: String,
  thumbnail: String,
  status: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Video', videoSchema);