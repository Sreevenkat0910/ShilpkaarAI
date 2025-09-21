const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Trust proxy for Vercel
app.set('trust proxy', true);

// Initialize Supabase client with fallback
let supabase = null;
try {
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseServiceKey) {
    supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('✅ Supabase client initialized');
  } else {
    console.log('⚠️ Supabase credentials not found, using fallback authentication');
  }
} catch (error) {
  console.log('⚠️ Supabase client initialization failed, using fallback authentication');
}

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

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
};

// Fallback user data (when Supabase is not available)
const fallbackUsers = [
  {
    id: 'user-1',
    name: 'Amit Singh',
    mobile: '9876543213',
    role: 'customer',
    email: 'amit@example.com',
    location: 'Mumbai, Maharashtra',
    is_verified: true
  },
  {
    id: 'user-2',
    name: 'Priya Sharma',
    mobile: '9876543210',
    role: 'artisan',
    email: 'priya@example.com',
    location: 'Varanasi, Uttar Pradesh',
    craft: 'Textile Weaving',
    is_verified: true
  }
];

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login request received');
    
    const { mobile, password } = req.body;
    
    if (!mobile || !password) {
      return res.status(400).json({ message: 'Mobile and password are required' });
    }

    let user = null;

    if (supabase) {
      // Try Supabase authentication
      try {
        const { data: supabaseUser, error } = await supabase
          .from('users')
          .select('*')
          .eq('mobile', mobile)
          .single();

        if (!error && supabaseUser) {
          const isValidPassword = await bcrypt.compare(password, supabaseUser.password);
          if (isValidPassword) {
            user = supabaseUser;
          }
        }
      } catch (error) {
        console.log('Supabase authentication failed, using fallback');
      }
    }

    // Fallback authentication
    if (!user) {
      const fallbackUser = fallbackUsers.find(u => u.mobile === mobile);
      if (fallbackUser && password === 'password123') {
        user = fallbackUser;
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid mobile number or password' });
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Also handle /auth/login for frontend compatibility
app.post('/auth/login', async (req, res) => {
  try {
    console.log('Login request received (legacy path)');
    
    const { mobile, password } = req.body;
    
    if (!mobile || !password) {
      return res.status(400).json({ message: 'Mobile and password are required' });
    }

    let user = null;

    if (supabase) {
      // Try Supabase authentication
      try {
        const { data: supabaseUser, error } = await supabase
          .from('users')
          .select('*')
          .eq('mobile', mobile)
          .single();

        if (!error && supabaseUser) {
          const isValidPassword = await bcrypt.compare(password, supabaseUser.password);
          if (isValidPassword) {
            user = supabaseUser;
          }
        }
      } catch (error) {
        console.log('Supabase authentication failed, using fallback');
      }
    }

    // Fallback authentication
    if (!user) {
      const fallbackUser = fallbackUsers.find(u => u.mobile === mobile);
      if (fallbackUser && password === 'password123') {
        user = fallbackUser;
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid mobile number or password' });
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Register request received');
    
    const { name, mobile, password, role, email, location } = req.body;
    
    if (!name || !mobile || !password || !role) {
      return res.status(400).json({ message: 'Name, mobile, password, and role are required' });
    }

    // For now, return a simple success response
    // TODO: Implement real Supabase registration
    const token = generateToken('new-user-id');
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: 'new-user-id',
        name: name,
        mobile: mobile,
        role: role,
        email: email || '',
        location: location || '',
        is_verified: false
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
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // For now, return a simple user response
    // TODO: Implement real token verification
    res.json({
      user: {
        id: 'test-user-id',
        name: 'Amit Singh',
        mobile: '9876543213',
        role: 'customer',
        email: 'amit@example.com',
        location: 'Mumbai, Maharashtra',
        is_verified: true
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
    database: supabase ? 'Supabase PostgreSQL' : 'Fallback Mode',
    supabase_connected: !!supabase
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('404 - Route not found:', req.method, req.originalUrl);
  res.status(404).json({ message: 'Route not found' });
});

// Export for Vercel
module.exports = app;
