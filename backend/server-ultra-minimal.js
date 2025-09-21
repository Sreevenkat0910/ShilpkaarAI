const express = require('express');
const cors = require('cors');

const app = express();

// Trust proxy for Vercel
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple auth routes
app.post('/api/auth/login', (req, res) => {
  console.log('Login request received');
  
  const { mobile, password } = req.body;
  
  if (!mobile || !password) {
    return res.status(400).json({ message: 'Mobile and password are required' });
  }

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
});

// Also handle /auth/login for frontend compatibility
app.post('/auth/login', (req, res) => {
  console.log('Login request received (legacy path)');
  
  const { mobile, password } = req.body;
  
  if (!mobile || !password) {
    return res.status(400).json({ message: 'Mobile and password are required' });
  }

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
});

app.post('/api/auth/register', (req, res) => {
  console.log('Register request received');
  
  const { name, mobile, password, role } = req.body;
  
  if (!name || !mobile || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

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
});

// Also handle /auth/register for frontend compatibility
app.post('/auth/register', (req, res) => {
  console.log('Register request received (legacy path)');
  
  const { name, mobile, password, role } = req.body;
  
  if (!name || !mobile || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

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
});

app.get('/api/auth/me', (req, res) => {
  console.log('Get user request received');
  
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
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('404 - Route not found:', req.method, req.originalUrl);
  res.status(404).json({ message: 'Route not found' });
});

// Export for Vercel
module.exports = app;
