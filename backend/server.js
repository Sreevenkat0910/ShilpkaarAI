const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth-supabase');
const productRoutes = require('./routes/products-supabase');
const orderRoutes = require('./routes/orders-supabase');
const profileRoutes = require('./routes/profile-supabase');
const analyticsRoutes = require('./routes/analytics-supabase');
const reviewRoutes = require('./routes/reviews-supabase');
const favoriteRoutes = require('./routes/favorites-supabase');
const artisanRoutes = require('./routes/artisans-supabase');

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'null'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Test Supabase connection
const { supabaseAdmin } = require('./models/supabase');

async function testConnection() {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Connected to Supabase');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection error:', error.message);
    return false;
  }
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/artisans', artisanRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const isConnected = await testConnection();
  
  res.json({
    success: true,
    status: 'OK',
    message: 'ShilpkaarAI API is running',
    timestamp: new Date().toISOString(),
    database: isConnected ? 'Connected' : 'Disconnected',
    environment: process.env.NODE_ENV || 'development',
    version: '3.0.0'
  });
});

// Root endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'ShilpkaarAI API Server',
    version: '3.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      profile: '/api/profile',
      analytics: '/api/analytics',
      reviews: '/api/reviews',
      favorites: '/api/favorites',
      artisans: '/api/artisans',
      health: '/api/health'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Start server
async function startServer() {
  try {
    // Test connection before starting
    const isConnected = await testConnection();
    
    app.listen(PORT, () => {
      console.log('🚀 Server started successfully!');
      console.log(`📡 Port: ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      console.log(`🔗 API URL: http://localhost:${PORT}/api`);
      console.log(`❤️ Health Check: http://localhost:${PORT}/api/health`);
      console.log(isConnected ? '✅ Connected to Supabase' : '❌ Supabase connection failed');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();

module.exports = app;