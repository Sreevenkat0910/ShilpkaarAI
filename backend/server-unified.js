const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import database connection
const dbConnection = require('./config/database');

// Import middleware
const { errorHandler } = require('./middleware/validation');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const profileRoutes = require('./routes/profile');
const analyticsRoutes = require('./routes/analytics');
const reviewRoutes = require('./routes/reviews');
const favoriteRoutes = require('./routes/favorites');
const artisanRoutes = require('./routes/artisans');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 5001;
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000,
      message: {
        success: false,
        message: 'Too many requests, please try again later.'
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use(limiter);

    // CORS configuration
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      optionsSuccessStatus: 200
    }));

    // Body parsing middleware
    this.app.use(express.json({ 
      limit: process.env.MAX_FILE_SIZE || '10mb' 
    }));
    this.app.use(express.urlencoded({ 
      extended: true,
      limit: process.env.MAX_FILE_SIZE || '10mb'
    }));

    // Request logging middleware
    this.app.use((req, res, next) => {
      const timestamp = new Date().toISOString();
      console.log(`${timestamp} - ${req.method} ${req.path} - ${req.ip}`);
      next();
    });
  }

  setupRoutes() {
    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/products', productRoutes);
    this.app.use('/api/orders', orderRoutes);
    this.app.use('/api/profile', profileRoutes);
    this.app.use('/api/analytics', analyticsRoutes);
    this.app.use('/api/reviews', reviewRoutes);
    this.app.use('/api/favorites', favoriteRoutes);
    this.app.use('/api/artisans', artisanRoutes);

    // Health check endpoint
    this.app.get('/api/health', (req, res) => {
      const dbStatus = dbConnection.getConnectionStatus();
      res.json({
        success: true,
        message: 'ShilpkaarAI API is running',
        timestamp: new Date().toISOString(),
        database: dbStatus,
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
      });
    });

    // API documentation endpoint
    this.app.get('/api', (req, res) => {
      res.json({
        success: true,
        message: 'ShilpkaarAI API Documentation',
        version: '1.0.0',
        endpoints: {
          auth: '/api/auth',
          products: '/api/products',
          orders: '/api/orders',
          profile: '/api/profile',
          analytics: '/api/analytics',
          reviews: '/api/reviews',
          favorites: '/api/favorites',
          artisans: '/api/artisans'
        },
        documentation: 'https://github.com/your-repo/shilpkaarai-backend'
      });
    });
  }

  setupErrorHandling() {
    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
      });
    });

    // Global error handler
    this.app.use(errorHandler);
  }

  async start() {
    try {
      // Connect to database
      await dbConnection.connect();
      
      // Create database indexes
      await dbConnection.createIndexes();

      // Start server
      this.app.listen(this.port, () => {
        console.log('🚀 Server started successfully!');
        console.log(`📡 Port: ${this.port}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
        console.log(`🔗 API URL: http://localhost:${this.port}/api`);
        console.log(`❤️ Health Check: http://localhost:${this.port}/api/health`);
        console.log('📚 API Documentation: http://localhost:${this.port}/api');
      });

      // Graceful shutdown
      process.on('SIGTERM', this.shutdown.bind(this));
      process.on('SIGINT', this.shutdown.bind(this));

    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  async shutdown() {
    console.log('🛑 Shutting down server gracefully...');
    
    try {
      await dbConnection.disconnect();
      console.log('✅ Server shutdown complete');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  }
}

// Create and start server
const server = new Server();
server.start();

module.exports = server;
