const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Trust proxy for Vercel (CRITICAL FIX)
app.set('trust proxy', true);

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

// Simple auth routes for testing
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    
    const { mobile, password } = req.body;
    
    if (!mobile || !password) {
      return res.status(400).json({ message: 'Mobile and password are required' });
    }

    // Return a simple success response
    res.json({
      message: 'Login successful',
      token: 'test-token-123',
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
    console.log('Register request received:', req.body);
    
    const { name, mobile, password, role } = req.body;
    
    if (!name || !mobile || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Return a simple success response
    res.status(201).json({
      message: 'User registered successfully',
      token: 'test-token-123',
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
    console.log('Get user request received');
    
    // Return a simple user response
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
  console.log('Logout request received');
  res.json({ message: 'Logout successful' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check request received');
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
  console.log('404 - Route not found:', req.method, req.originalUrl);
  res.status(404).json({ message: 'Route not found' });
});

// Export for Vercel
module.exports = app;
