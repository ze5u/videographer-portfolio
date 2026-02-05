const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

// Import models (in backend/models, one level up from uploads)
const Video = require('../models/Video');
const Booking = require('../models/Booking');
const Admin = require('../models/Admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('✅ MongoDB connected successfully');
  createDefaultAdmin(); // Create default admin on first run
})
.catch(err => console.error('❌ MongoDB connection error:', err));

// Create default admin user
async function createDefaultAdmin() {
  try {
    const adminExists = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      const admin = new Admin({
        username: process.env.ADMIN_USERNAME,
        password: hashedPassword,
        email: process.env.ADMIN_EMAIL
      });
      await admin.save();
      console.log('✅ Default admin user created');
    }
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

// File Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos allowed.'));
    }
  }
});

// Email Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify email configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready');
  }
});

// ============================================
// PUBLIC API ROUTES
// ============================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Get all public videos
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await Video.find({ status: 'public' }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Error fetching videos' });
  }
});

// Get single video
app.get('/api/videos/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching video' });
  }
});

// Submit booking
app.post('/api/bookings', upload.single('referenceFile'), async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      referenceFile: req.file ? req.file.path : null
    };

    const booking = new Booking(bookingData);
    await booking.save();

    // Send confirmation email to client
    const clientEmailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: '✅ Booking Confirmation - Your Request Received',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0066ff;">Thank you for your booking request!</h2>
          <p>Hi ${booking.fullName},</p>
          <p>I've received your booking request and I'm excited to learn more about your project!</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Booking Details:</h3>
            <p><strong>Event Type:</strong> ${booking.eventType}</p>
            <p><strong>Event Date:</strong> ${new Date(booking.eventDate).toLocaleDateString()}</p>
            <p><strong>Location:</strong> ${booking.eventLocation}</p>
            <p><strong>Budget Range:</strong> ${booking.budgetRange}</p>
          </div>
          
          <p>I'll review your project details and get back to you within 24 hours with next steps.</p>
          
          <p>Best regards,<br>
          <strong>[Your Name]</strong><br>
          Professional Videographer</p>
        </div>
      `
    };

    // Send notification email to admin
    const adminEmailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: '🎬 New Booking Request Received',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0066ff;">New Booking Request</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
            <h3>Client Information:</h3>
            <p><strong>Name:</strong> ${booking.fullName}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Phone:</strong> ${booking.phone}</p>
            
            <h3 style="margin-top: 20px;">Event Details:</h3>
            <p><strong>Type:</strong> ${booking.eventType}</p>
            <p><strong>Date:</strong> ${new Date(booking.eventDate).toLocaleDateString()}</p>
            <p><strong>Location:</strong> ${booking.eventLocation}</p>
            <p><strong>Budget:</strong> ${booking.budgetRange}</p>
            
            <h3 style="margin-top: 20px;">Project Description:</h3>
            <p>${booking.projectDescription}</p>
          </div>
          
          <p style="margin-top: 20px;">
            <a href="http://localhost:5000/admin" 
               style="background: #0066ff; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              View in Admin Panel
            </a>
          </p>
        </div>
      `
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(clientEmailOptions),
      transporter.sendMail(adminEmailOptions)
    ]);

    res.status(201).json({ 
      success: true,
      message: 'Booking submitted successfully',
      booking: {
        id: booking._id,
        fullName: booking.fullName,
        eventType: booking.eventType
      }
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error submitting booking. Please try again.' 
    });
  }
});

// ============================================
// ADMIN AUTHENTICATION
// ============================================

// Admin middleware
const isAdmin = (req, res, next) => {
  if (req.session && req.session.adminId) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized. Please login.' });
  }
};

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.adminId = admin._id;
    res.json({ 
      success: true,
      message: 'Login successful',
      admin: {
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login error. Please try again.' });
  }
});

// Admin logout
app.post('/api/admin/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Verify admin session
app.get('/api/admin/verify', isAdmin, (req, res) => {
  res.json({ authenticated: true });
});

// ============================================
// ADMIN API ROUTES
// ============================================

// Get all videos (admin)
app.get('/api/admin/videos', isAdmin, async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching videos' });
  }
});

// Upload new video (admin)
app.post('/api/admin/videos', isAdmin, upload.single('thumbnail'), async (req, res) => {
  try {
    const videoData = {
      ...req.body,
      thumbnail: req.file ? `/uploads/${req.file.filename}` : null
    };

    const video = new Video(videoData);
    await video.save();

    res.status(201).json({ 
      success: true,
      message: 'Video uploaded successfully',
      video 
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ error: 'Error uploading video' });
  }
});

// Update video (admin)
app.put('/api/admin/videos/:id', isAdmin, upload.single('thumbnail'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.thumbnail = `/uploads/${req.file.filename}`;
    }

    const video = await Video.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json({ 
      success: true,
      message: 'Video updated successfully',
      video 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating video' });
  }
});

// Delete video (admin)
app.delete('/api/admin/videos/:id', isAdmin, async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json({ 
      success: true,
      message: 'Video deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting video' });
  }
});

// Get all bookings (admin)
app.get('/api/admin/bookings', isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bookings' });
  }
});

// Update booking status (admin)
app.patch('/api/admin/bookings/:id', isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Send status update email to client
    let emailSubject = '';
    let emailHtml = '';

    if (status === 'confirmed') {
      emailSubject = '🎉 Your Booking is Confirmed!';
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0066ff;">Great News!</h2>
          <p>Hi ${booking.fullName},</p>
          <p>Your booking for <strong>${booking.eventType}</strong> has been confirmed!</p>
          <p>I'm excited to work with you on this project. I'll be in touch soon with the next steps.</p>
          <p>Best regards,<br>[Your Name]</p>
        </div>
      `;
    } else if (status === 'rejected') {
      emailSubject = 'Regarding Your Booking Request';
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Update on Your Booking Request</h2>
          <p>Hi ${booking.fullName},</p>
          <p>Thank you for your interest in my videography services.</p>
          <p>Unfortunately, I'm not available for your requested date. However, I'd love to discuss alternative dates or refer you to a trusted colleague.</p>
          <p>Please feel free to reach out if you'd like to explore other options.</p>
          <p>Best regards,<br>[Your Name]</p>
        </div>
      `;
    }

    if (emailSubject) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: booking.email,
        subject: emailSubject,
        html: emailHtml
      });
    }

    res.json({ 
      success: true,
      message: 'Booking status updated',
      booking 
    });
  } catch (error) {
    console.error('Booking update error:', error);
    res.status(500).json({ error: 'Error updating booking' });
  }
});

// Delete booking (admin)
app.delete('/api/admin/bookings/:id', isAdmin, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ 
      success: true,
      message: 'Booking deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting booking' });
  }
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
  ✅ Server is running!
  📡 Port: ${PORT}
  🌍 API: http://localhost:${PORT}
  🔗 Frontend: ${process.env.FRONTEND_URL}
  `);
});

// Error handling
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});