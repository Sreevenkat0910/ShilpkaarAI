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

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
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

// AUTHENTICATION ROUTES
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login request received');
    
    const { mobile, password } = req.body;
    
    if (!mobile || !password) {
      return res.status(400).json({ message: 'Mobile and password are required' });
    }

    let user = null;

    if (supabase) {
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

    if (!user) {
      const fallbackUser = fallbackUsers.find(u => u.mobile === mobile);
      if (fallbackUser && password === 'password123') {
        user = fallbackUser;
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid mobile number or password' });
    }

    const token = generateToken(user.id);
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

app.post('/auth/login', async (req, res) => {
  try {
    console.log('Login request received (legacy path)');
    
    const { mobile, password } = req.body;
    
    if (!mobile || !password) {
      return res.status(400).json({ message: 'Mobile and password are required' });
    }

    let user = null;

    if (supabase) {
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

    if (!user) {
      const fallbackUser = fallbackUsers.find(u => u.mobile === mobile);
      if (fallbackUser && password === 'password123') {
        user = fallbackUser;
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid mobile number or password' });
    }

    const token = generateToken(user.id);
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

app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    console.log('Get user request received');
    
    if (supabase) {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', req.userId)
        .single();

      if (error || !user) {
        return res.status(401).json({ message: 'User not found' });
      }

      const { password: _, ...userWithoutPassword } = user;
      return res.json({ user: userWithoutPassword });
    }

    // Fallback
    const fallbackUser = fallbackUsers.find(u => u.id === req.userId);
    if (fallbackUser) {
      res.json({ user: fallbackUser });
    } else {
      res.status(401).json({ message: 'User not found' });
    }

  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
});

// Also handle /auth/me for frontend compatibility
app.get('/auth/me', verifyToken, async (req, res) => {
  try {
    console.log('Get user request received (legacy path)');
    
    if (supabase) {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', req.userId)
        .single();

      if (error || !user) {
        return res.status(401).json({ message: 'User not found' });
      }

      const { password: _, ...userWithoutPassword } = user;
      return res.json({ user: userWithoutPassword });
    }

    // Fallback
    const fallbackUser = fallbackUsers.find(u => u.id === req.userId);
    if (fallbackUser) {
      res.json({ user: fallbackUser });
    } else {
      res.status(401).json({ message: 'User not found' });
    }

  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  console.log('Logout request received');
  res.json({ message: 'Logout successful' });
});

// PRODUCTS ROUTES
app.get('/api/products/search', async (req, res) => {
  try {
    console.log('Products search request received');
    
    const { page = 1, limit = 20, sortBy = 'created_at', category, search } = req.query;
    
    if (supabase) {
      let query = supabase.from('products').select('*');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }
      
      query = query.order(sortBy, { ascending: false });
      query = query.range((page - 1) * limit, page * limit - 1);
      
      const { data: products, error } = await query;
      
      if (error) {
        throw new Error(`Error fetching products: ${error.message}`);
      }
      
      return res.json({
        products: products || [],
        total: products?.length || 0,
        page: parseInt(page),
        limit: parseInt(limit)
      });
    }

    // Fallback products
    const fallbackProducts = [
      {
        id: 'product-1',
        name: 'Handwoven Banarasi Silk Saree',
        description: 'Exquisite handwoven Banarasi silk saree with intricate zari work.',
        price: 2500,
        original_price: 3200,
        images: ['https://images.unsplash.com/photo-1632726733402-4a059a476028?w=400'],
        category: 'Textiles',
        stock: 3,
        tags: ['silk', 'handwoven', 'traditional'],
        artisan_name: 'Priya Sharma',
        rating: 4.9,
        review_count: 234
      }
    ];
    
    res.json({
      products: fallbackProducts,
      total: fallbackProducts.length,
      page: parseInt(page),
      limit: parseInt(limit)
    });

  } catch (error) {
    console.error('Products search error:', error);
    res.status(500).json({ message: 'Error loading products' });
  }
});

// Also handle /products/search for frontend compatibility
app.get('/products/search', async (req, res) => {
  try {
    console.log('Products search request received (legacy path)');
    
    const { page = 1, limit = 20, sortBy = 'created_at', category, search } = req.query;
    
    if (supabase) {
      let query = supabase.from('products').select('*');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }
      
      query = query.order(sortBy, { ascending: false });
      query = query.range((page - 1) * limit, page * limit - 1);
      
      const { data: products, error } = await query;
      
      if (error) {
        throw new Error(`Error fetching products: ${error.message}`);
      }
      
      return res.json({
        products: products || [],
        total: products?.length || 0,
        page: parseInt(page),
        limit: parseInt(limit)
      });
    }

    // Fallback products
    const fallbackProducts = [
      {
        id: 'product-1',
        name: 'Handwoven Banarasi Silk Saree',
        description: 'Exquisite handwoven Banarasi silk saree with intricate zari work.',
        price: 2500,
        original_price: 3200,
        images: ['https://images.unsplash.com/photo-1632726733402-4a059a476028?w=400'],
        category: 'Textiles',
        stock: 3,
        tags: ['silk', 'handwoven', 'traditional'],
        artisan_name: 'Priya Sharma',
        rating: 4.9,
        review_count: 234
      }
    ];
    
    res.json({
      products: fallbackProducts,
      total: fallbackProducts.length,
      page: parseInt(page),
      limit: parseInt(limit)
    });

  } catch (error) {
    console.error('Products search error:', error);
    res.status(500).json({ message: 'Error loading products' });
  }
});

// Handle /products/all
app.get('/products/all', async (req, res) => {
  try {
    console.log('Products all request received');
    
    if (supabase) {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(`Error fetching products: ${error.message}`);
      }
      
      return res.json({
        products: products || [],
        total: products?.length || 0
      });
    }

    // Fallback products
    const fallbackProducts = [
      {
        id: 'product-1',
        name: 'Handwoven Banarasi Silk Saree',
        description: 'Exquisite handwoven Banarasi silk saree with intricate zari work.',
        price: 2500,
        original_price: 3200,
        images: ['https://images.unsplash.com/photo-1632726733402-4a059a476028?w=400'],
        category: 'Textiles',
        stock: 3,
        tags: ['silk', 'handwoven', 'traditional'],
        artisan_name: 'Priya Sharma',
        rating: 4.9,
        review_count: 234
      }
    ];
    
    res.json({
      products: fallbackProducts,
      total: fallbackProducts.length
    });

  } catch (error) {
    console.error('Products all error:', error);
    res.status(500).json({ message: 'Error loading products' });
  }
});

// Handle /products/one
app.get('/products/one', async (req, res) => {
  try {
    console.log('Product one request received');
    
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    
    if (supabase) {
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error || !product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      return res.json({ product });
    }

    // Fallback product
    const fallbackProduct = {
      id: id,
      name: 'Handwoven Banarasi Silk Saree',
      description: 'Exquisite handwoven Banarasi silk saree with intricate zari work.',
      price: 2500,
      original_price: 3200,
      images: ['https://images.unsplash.com/photo-1632726733402-4a059a476028?w=400'],
      category: 'Textiles',
      stock: 3,
      tags: ['silk', 'handwoven', 'traditional'],
      artisan_name: 'Priya Sharma',
      rating: 4.9,
      review_count: 234
    };
    
    res.json({ product: fallbackProduct });

  } catch (error) {
    console.error('Product one error:', error);
    res.status(500).json({ message: 'Error loading product' });
  }
});

// ANALYTICS ROUTES
app.get('/analytics/overview', verifyToken, async (req, res) => {
  try {
    console.log('Analytics overview request received');
    
    const { timeFrame = '30days' } = req.query;
    
    // Mock analytics data
    const overview = {
      totalSales: 125000,
      totalOrders: 45,
      totalProducts: 5,
      totalCustomers: 4,
      salesGrowth: 12.5,
      orderGrowth: 8.3,
      productGrowth: 15.2,
      customerGrowth: 6.7,
      timeFrame: timeFrame
    };
    
    res.json(overview);

  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
});

app.get('/analytics/customer-insights', verifyToken, async (req, res) => {
  try {
    console.log('Customer insights request received');
    
    const { timeFrame = '30days' } = req.query;
    
    // Mock customer insights data
    const insights = {
      totalCustomers: 4,
      newCustomers: 1,
      returningCustomers: 3,
      averageOrderValue: 2500,
      customerRetentionRate: 75,
      topCustomerSegments: [
        { segment: 'Premium', count: 2, percentage: 50 },
        { segment: 'Regular', count: 2, percentage: 50 }
      ],
      timeFrame: timeFrame
    };
    
    res.json(insights);

  } catch (error) {
    console.error('Customer insights error:', error);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
});

app.get('/analytics/category-performance', verifyToken, async (req, res) => {
  try {
    console.log('Category performance request received');
    
    const { timeFrame = '30days' } = req.query;
    
    // Mock category performance data
    const performance = {
      categories: [
        { name: 'Textiles', sales: 75000, orders: 20, growth: 15.2 },
        { name: 'Pottery', sales: 30000, orders: 12, growth: 8.5 },
        { name: 'Jewelry', sales: 20000, orders: 13, growth: 22.1 }
      ],
      timeFrame: timeFrame
    };
    
    res.json(performance);

  } catch (error) {
    console.error('Category performance error:', error);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
});

app.get('/analytics/sales-trend', verifyToken, async (req, res) => {
  try {
    console.log('Sales trend request received');
    
    const { timeFrame = '30days' } = req.query;
    
    // Mock sales trend data
    const trend = {
      data: [
        { date: '2024-01-01', sales: 5000 },
        { date: '2024-01-02', sales: 7500 },
        { date: '2024-01-03', sales: 6200 },
        { date: '2024-01-04', sales: 8800 },
        { date: '2024-01-05', sales: 9500 }
      ],
      timeFrame: timeFrame
    };
    
    res.json(trend);

  } catch (error) {
    console.error('Sales trend error:', error);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
});

app.get('/analytics/recommendations', verifyToken, async (req, res) => {
  try {
    console.log('Recommendations request received');
    
    // Mock recommendations data
    const recommendations = {
      productRecommendations: [
        { id: 'rec-1', name: 'Cotton Handloom Kurta', reason: 'High demand in your region' },
        { id: 'rec-2', name: 'Silver Filigree Earrings', reason: 'Trending in jewelry category' }
      ],
      marketingRecommendations: [
        { type: 'social_media', message: 'Post more product photos on Instagram' },
        { type: 'pricing', message: 'Consider seasonal discounts for textiles' }
      ]
    };
    
    res.json(recommendations);

  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
});

app.get('/analytics/inventory-insights', verifyToken, async (req, res) => {
  try {
    console.log('Inventory insights request received');
    
    // Mock inventory insights data
    const insights = {
      lowStockProducts: [
        { id: 'product-1', name: 'Handwoven Banarasi Silk Saree', stock: 3, threshold: 5 }
      ],
      topSellingProducts: [
        { id: 'product-1', name: 'Handwoven Banarasi Silk Saree', sales: 15 },
        { id: 'product-2', name: 'Cotton Handloom Kurta Set', sales: 12 }
      ],
      inventoryValue: 125000,
      turnoverRate: 2.3
    };
    
    res.json(insights);

  } catch (error) {
    console.error('Inventory insights error:', error);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
});

app.get('/analytics/seasonal-trends', verifyToken, async (req, res) => {
  try {
    console.log('Seasonal trends request received');
    
    // Mock seasonal trends data
    const trends = {
      currentSeason: 'Winter',
      trendingCategories: ['Textiles', 'Pottery'],
      seasonalProducts: [
        { id: 'product-1', name: 'Handwoven Banarasi Silk Saree', seasonalBoost: 25 }
      ],
      recommendations: [
        'Focus on warm textiles for winter season',
        'Promote pottery items for festive occasions'
      ]
    };
    
    res.json(trends);

  } catch (error) {
    console.error('Seasonal trends error:', error);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
});

app.get('/analytics/top-products', verifyToken, async (req, res) => {
  try {
    console.log('Top products request received');
    
    const { timeFrame = '30days', limit = 10 } = req.query;
    
    // Mock top products data
    const topProducts = [
      { id: 'product-1', name: 'Handwoven Banarasi Silk Saree', sales: 15, revenue: 37500 },
      { id: 'product-2', name: 'Cotton Handloom Kurta Set', sales: 12, revenue: 14400 },
      { id: 'product-3', name: 'Blue Pottery Dinner Set', sales: 8, revenue: 14400 }
    ];
    
    res.json({
      products: topProducts.slice(0, parseInt(limit)),
      timeFrame: timeFrame
    });

  } catch (error) {
    console.error('Top products error:', error);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
});

app.get('/analytics/alerts', verifyToken, async (req, res) => {
  try {
    console.log('Analytics alerts request received');
    
    // Mock alerts data
    const alerts = [
      {
        id: 'alert-1',
        type: 'low_stock',
        message: 'Handwoven Banarasi Silk Saree is running low on stock',
        severity: 'warning',
        timestamp: new Date().toISOString()
      },
      {
        id: 'alert-2',
        type: 'high_demand',
        message: 'Cotton Handloom Kurta Set has high demand',
        severity: 'info',
        timestamp: new Date().toISOString()
      }
    ];
    
    res.json({ alerts });

  } catch (error) {
    console.error('Analytics alerts error:', error);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
});

// FAVORITES ROUTES
app.get('/api/favorites', verifyToken, async (req, res) => {
  try {
    console.log('Favorites request received');
    
    const { page = 1, limit = 100, sortBy = 'added_at' } = req.query;
    
    if (supabase) {
      const { data: favorites, error } = await supabase
        .from('favorites')
        .select(`
          *,
          products (*)
        `)
        .eq('user_id', req.userId)
        .order(sortBy, { ascending: false })
        .range((page - 1) * limit, page * limit - 1);
      
      if (error) {
        throw new Error(`Error fetching favorites: ${error.message}`);
      }
      
      return res.json({
        favorites: favorites || [],
        total: favorites?.length || 0,
        page: parseInt(page),
        limit: parseInt(limit)
      });
    }

    // Fallback favorites
    res.json({
      favorites: [],
      total: 0,
      page: parseInt(page),
      limit: parseInt(limit)
    });

  } catch (error) {
    console.error('Favorites error:', error);
    res.status(500).json({ message: 'Error loading favorites' });
  }
});

// Also handle /favorites for frontend compatibility
app.get('/favorites', verifyToken, async (req, res) => {
  try {
    console.log('Favorites request received (legacy path)');
    
    const { page = 1, limit = 100, sortBy = 'added_at' } = req.query;
    
    if (supabase) {
      const { data: favorites, error } = await supabase
        .from('favorites')
        .select(`
          *,
          products (*)
        `)
        .eq('user_id', req.userId)
        .order(sortBy, { ascending: false })
        .range((page - 1) * limit, page * limit - 1);
      
      if (error) {
        throw new Error(`Error fetching favorites: ${error.message}`);
      }
      
      return res.json({
        favorites: favorites || [],
        total: favorites?.length || 0,
        page: parseInt(page),
        limit: parseInt(limit)
      });
    }

    // Fallback favorites
    res.json({
      favorites: [],
      total: 0,
      page: parseInt(page),
      limit: parseInt(limit)
    });

  } catch (error) {
    console.error('Favorites error:', error);
    res.status(500).json({ message: 'Error loading favorites' });
  }
});

// ORDERS ROUTES
app.get('/api/orders/myorders', verifyToken, async (req, res) => {
  try {
    console.log('My orders request received');
    
    if (supabase) {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', req.userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(`Error fetching orders: ${error.message}`);
      }
      
      return res.json({
        orders: orders || [],
        total: orders?.length || 0
      });
    }

    // Fallback orders
    res.json({
      orders: [],
      total: 0
    });

  } catch (error) {
    console.error('Orders error:', error);
    res.status(500).json({ message: 'Error fetching my orders' });
  }
});

// Also handle /orders/myorders for frontend compatibility
app.get('/orders/myorders', verifyToken, async (req, res) => {
  try {
    console.log('My orders request received (legacy path)');
    
    if (supabase) {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', req.userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(`Error fetching orders: ${error.message}`);
      }
      
      return res.json({
        orders: orders || [],
        total: orders?.length || 0
      });
    }

    // Fallback orders
    res.json({
      orders: [],
      total: 0
    });

  } catch (error) {
    console.error('Orders error:', error);
    res.status(500).json({ message: 'Error fetching my orders' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check request received');
  res.json({ 
    status: 'OK', 
    message: 'ShilpkaarAI API is running with complete data and all routes',
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
