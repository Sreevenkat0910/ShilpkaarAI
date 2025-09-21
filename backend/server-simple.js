const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
};

// Simple auth routes for testing
app.post('/api/auth/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;
    
    if (!mobile || !password) {
      return res.status(400).json({ message: 'Mobile and password are required' });
    }

    // For now, return a simple success response
    // TODO: Implement actual Supabase authentication
    const token = generateToken('test-user-id');
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: 'test-user-id',
        name: 'Test User',
        mobile: mobile,
        role: 'customer',
        email: 'test@example.com',
        location: 'Mumbai',
        craft: '',
        isVerified: true
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, mobile, password, role } = req.body;
    
    if (!name || !mobile || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // For now, return a simple success response
    // TODO: Implement actual Supabase registration
    const token = generateToken('new-user-id');
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: 'new-user-id',
        name: name,
        mobile: mobile,
        role: role,
        email: '',
        location: '',
        craft: '',
        isVerified: false
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // For now, return a simple user response
    // TODO: Implement actual token verification
    res.json({
      user: {
        id: 'test-user-id',
        name: 'Test User',
        mobile: '9876543213',
        role: 'customer',
        email: 'test@example.com',
        location: 'Mumbai',
        craft: '',
        isVerified: true
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ShilpkaarAI API is running',
    timestamp: new Date().toISOString(),
    database: 'Supabase PostgreSQL',
    frontend_url: process.env.FRONTEND_URL || 'not set'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Database: Supabase PostgreSQL`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export for Vercel
module.exports = app;
