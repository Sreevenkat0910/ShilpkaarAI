const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Trust proxy for Vercel
app.set('trust proxy', true);

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://shilpkaar-ai.vercel.app', process.env.FRONTEND_URL].filter(Boolean),
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Supabase client
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  console.log('✅ Supabase client initialized');
} else {
  console.log('⚠️ Supabase environment variables not set, using fallback data');
}

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Helper function to get user by ID
const getUserById = async (userId) => {
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }
  
  return data;
};

// Helper function to get user by mobile
const getUserByMobile = async (mobile) => {
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('mobile', mobile)
    .single();
  
  if (error) {
    console.error('Error fetching user by mobile:', error);
    return null;
  }
  
  return data;
};

// ===== AUTHENTICATION ROUTES =====

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, mobile, password, role, email, location, craft, bio } = req.body;

    if (!name || !mobile || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (supabase) {
      // Check if user already exists
      const existingUser = await getUserByMobile(mobile);
      if (existingUser) {
        return res.status(400).json({ message: 'User with this mobile number already exists' });
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, 10);

      // Create user
      const userData = {
        name,
        mobile,
        password: password_hash,
        role,
        email: email || null,
        location: location || null,
        craft: craft || null,
        bio: bio || null,
        is_verified: false,
        workshop_offered: false,
        experience: 0,
        rating: 0.00,
        review_count: 0,
        products_count: 0
      };

      const { data: user, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();

      if (error) throw error;

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, mobile: user.mobile, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          name: user.name,
          mobile: user.mobile,
          role: user.role,
          email: user.email,
          location: user.location,
          craft: user.craft,
          bio: user.bio,
          is_verified: user.is_verified,
          workshop_offered: user.workshop_offered,
          experience: user.experience,
          rating: user.rating,
          review_count: user.review_count,
          products_count: user.products_count
        },
        token
      });
    } else {
      // Fallback for development
      const token = jwt.sign(
        { userId: 'dev-user', mobile, role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'User registered successfully (dev mode)',
        user: { id: 'dev-user', name, mobile, role, email, location, craft, bio },
        token
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({ message: 'Mobile and password are required' });
    }

    if (supabase) {
      // Find user by mobile
      const user = await getUserByMobile(mobile);
      if (!user) {
        return res.status(401).json({ message: 'Invalid mobile number or password' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid mobile number or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, mobile: user.mobile, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          mobile: user.mobile,
          role: user.role,
          email: user.email,
          location: user.location,
          craft: user.craft,
          bio: user.bio,
          is_verified: user.is_verified,
          workshop_offered: user.workshop_offered,
          experience: user.experience,
          rating: user.rating,
          review_count: user.review_count,
          products_count: user.products_count
        },
        token
      });
    } else {
      // Fallback for development
      const token = jwt.sign(
        { userId: 'dev-user', mobile, role: 'customer' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful (dev mode)',
        user: { id: 'dev-user', name: 'Dev User', mobile, role: 'customer' },
        token
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    if (supabase) {
      const user = await getUserById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        user: {
          id: user.id,
          name: user.name,
          mobile: user.mobile,
          role: user.role,
          email: user.email,
          location: user.location,
          craft: user.craft,
          bio: user.bio,
          is_verified: user.is_verified,
          workshop_offered: user.workshop_offered,
          experience: user.experience,
          rating: user.rating,
          review_count: user.review_count,
          products_count: user.products_count
        }
      });
    } else {
      // Fallback for development
      res.json({
        user: {
          id: 'dev-user',
          name: 'Dev User',
          mobile: req.user.mobile,
          role: req.user.role
        }
      });
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to get user', error: error.message });
  }
});

// Logout
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logout successful' });
});

// ===== PRODUCT ROUTES =====

// Get all products
app.get('/api/products/all', async (req, res) => {
  try {
    const { category, artisan_id, featured, trending, limit = 50, offset = 0 } = req.query;

    if (supabase) {
      let query = supabase
        .from('products')
        .select(`
          *,
          artisan:artisan_id (
            id,
            name,
            location,
            craft,
            rating,
            review_count
          )
        `)
        .eq('availability', 'in_stock')
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }
      if (artisan_id) {
        query = query.eq('artisan_id', artisan_id);
      }
      if (featured === 'true') {
        query = query.eq('featured', true);
      }
      if (trending === 'true') {
        query = query.eq('trending', true);
      }

      query = query.range(offset, offset + limit - 1);

      const { data: products, error } = await query;

      if (error) throw error;

      // Get categories for filters
      const { data: categories } = await supabase
        .from('products')
        .select('category')
        .eq('availability', 'in_stock');

      const uniqueCategories = [...new Set(categories.map(p => p.category))];

      res.json({
        products: products || [],
        total: products?.length || 0,
        filters: {
          categories: uniqueCategories
        }
      });
    } else {
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
          artisan: {
            id: 'artisan-1',
            name: 'Priya Sharma',
            location: 'Varanasi, Uttar Pradesh',
            craft: 'Textile Weaving'
          },
          rating: 4.9,
          review_count: 234
        }
      ];

      res.json({
        products: fallbackProducts,
        total: fallbackProducts.length,
        filters: {
          categories: ['Textiles', 'Pottery', 'Jewelry', 'Woodwork', 'Metalwork', 'Leather', 'Bamboo', 'Stone']
        }
      });
    }
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

// Get single product
app.get('/api/products/one', async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    if (supabase) {
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          *,
          artisan:artisan_id (
            id,
            name,
            location,
            craft,
            rating,
            review_count,
            bio
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      res.json({ product });
    } else {
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
        artisan: {
          id: 'artisan-1',
          name: 'Priya Sharma',
          location: 'Varanasi, Uttar Pradesh',
          craft: 'Textile Weaving'
        },
        rating: 4.9,
        review_count: 234
      };

      res.json({ product: fallbackProduct });
    }
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
});

// Search products
app.get('/api/products/search', async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, artisan_id, limit = 20, offset = 0 } = req.query;

    if (supabase) {
      let query = supabase
        .from('products')
        .select(`
          *,
          artisan:artisan_id (
            id,
            name,
            location,
            craft,
            rating,
            review_count
          )
        `)
        .eq('availability', 'in_stock');

      if (q) {
        query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%,tags.cs.{${q}}`);
      }
      if (category) {
        query = query.eq('category', category);
      }
      if (minPrice) {
        query = query.gte('price', minPrice);
      }
      if (maxPrice) {
        query = query.lte('price', maxPrice);
      }
      if (artisan_id) {
        query = query.eq('artisan_id', artisan_id);
      }

      query = query.range(offset, offset + limit - 1);

      const { data: products, error } = await query;

      if (error) throw error;

      // Get categories for filters
      const { data: categories } = await supabase
        .from('products')
        .select('category')
        .eq('availability', 'in_stock');

      const uniqueCategories = [...new Set(categories.map(p => p.category))];

      res.json({
        products: products || [],
        total: products?.length || 0,
        page: parseInt(offset / limit) + 1,
        limit: parseInt(limit),
        filters: {
          categories: uniqueCategories
        }
      });
    } else {
      // Fallback search
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
          artisan: {
            id: 'artisan-1',
            name: 'Priya Sharma',
            location: 'Varanasi, Uttar Pradesh',
            craft: 'Textile Weaving'
          },
          rating: 4.9,
          review_count: 234
        }
      ];

      res.json({
        products: fallbackProducts,
        total: fallbackProducts.length,
        page: 1,
        limit: parseInt(limit),
        filters: {
          categories: ['Textiles', 'Pottery', 'Jewelry', 'Woodwork', 'Metalwork', 'Leather', 'Bamboo', 'Stone']
        }
      });
    }
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
});

// Get categories
app.get('/api/products/categories/all', async (req, res) => {
  try {
    if (supabase) {
      const { data: categories, error } = await supabase
        .from('products')
        .select('category')
        .eq('availability', 'in_stock');

      if (error) throw error;

      const uniqueCategories = [...new Set(categories.map(p => p.category))];
      res.json(uniqueCategories);
    } else {
      res.json(['Textiles', 'Pottery', 'Jewelry', 'Woodwork', 'Metalwork', 'Leather', 'Bamboo', 'Stone']);
    }
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
});

// ===== FAVORITES ROUTES =====

// Get user favorites
app.get('/api/favorites', authenticateToken, async (req, res) => {
  try {
    if (supabase) {
      const { data: favorites, error } = await supabase
        .from('favorites')
        .select(`
          *,
          product:product_id (
            id,
            name,
            description,
            price,
            original_price,
            images,
            category,
            stock,
            tags,
            artisan_name,
            rating,
            review_count
          )
        `)
        .eq('user_id', req.user.userId)
        .order('added_at', { ascending: false });

      if (error) throw error;

      res.json({ favorites: favorites || [] });
    } else {
      res.json({ favorites: [] });
    }
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Failed to fetch favorites', error: error.message });
  }
});

// Add to favorites
app.post('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    if (supabase) {
      // Check if already favorited
      const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', req.user.userId)
        .eq('product_id', product_id)
        .single();

      if (existing) {
        return res.status(400).json({ message: 'Product already in favorites' });
      }

      const { data: favorite, error } = await supabase
        .from('favorites')
        .insert({
          user_id: req.user.userId,
          product_id: product_id
        })
        .select()
        .single();

      if (error) throw error;

      res.json({ message: 'Added to favorites', favorite });
    } else {
      res.json({ message: 'Added to favorites (dev mode)' });
    }
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ message: 'Failed to add to favorites', error: error.message });
  }
});

// Remove from favorites
app.delete('/api/favorites/:product_id', authenticateToken, async (req, res) => {
  try {
    const { product_id } = req.params;

    if (supabase) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', req.user.userId)
        .eq('product_id', product_id);

      if (error) throw error;

      res.json({ message: 'Removed from favorites' });
    } else {
      res.json({ message: 'Removed from favorites (dev mode)' });
    }
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ message: 'Failed to remove from favorites', error: error.message });
  }
});

// Check if product is favorited
app.get('/api/favorites/check/:product_id', authenticateToken, async (req, res) => {
  try {
    const { product_id } = req.params;

    if (supabase) {
      const { data: favorite, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', req.user.userId)
        .eq('product_id', product_id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      res.json({ isFavorited: !!favorite });
    } else {
      res.json({ isFavorited: false });
    }
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({ message: 'Failed to check favorite status', error: error.message });
  }
});

// ===== ORDERS ROUTES =====

// Get user orders
app.get('/api/orders/myorders', authenticateToken, async (req, res) => {
  try {
    if (supabase) {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', req.user.userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json({ orders: orders || [] });
    } else {
      res.json({ orders: [] });
    }
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// Create order
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { items, total_amount, shipping_address } = req.body;

    if (!items || !total_amount) {
      return res.status(400).json({ message: 'Items and total amount are required' });
    }

    if (supabase) {
      // Generate order number (very short format)
      const order_number = `ORD${Date.now().toString().slice(-6)}`;

      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          order_number,
          customer_id: req.user.userId,
          items: items,
          total_amount: total_amount,
          status: 'pending',
          payment_status: 'pending',
          payment_method: 'card',
          shipping_address: shipping_address || null
        })
        .select()
        .single();

      if (error) throw error;

      res.json({ message: 'Order created successfully', order });
    } else {
      res.json({ message: 'Order created successfully (dev mode)' });
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

// Update order status
app.patch('/api/orders/:order_id', authenticateToken, async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status, payment_status, tracking_number } = req.body;

    if (supabase) {
      const updateData = {};
      if (status) updateData.status = status;
      if (payment_status) updateData.payment_status = payment_status;
      if (tracking_number) updateData.tracking_number = tracking_number;

      const { data: order, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', order_id)
        .select()
        .single();

      if (error) throw error;

      res.json({ message: 'Order updated successfully', order });
    } else {
      res.json({ message: 'Order updated successfully (dev mode)' });
    }
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Failed to update order', error: error.message });
  }
});

// ===== REVIEWS ROUTES =====

// Get product reviews
app.get('/api/reviews/:product_id', async (req, res) => {
  try {
    const { product_id } = req.params;

    if (supabase) {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user:user_id (
            id,
            name
          )
        `)
        .eq('product_id', product_id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json({ reviews: reviews || [] });
    } else {
      res.json({ reviews: [] });
    }
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
});

// Create review
app.post('/api/reviews', authenticateToken, async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;

    if (!product_id || !rating) {
      return res.status(400).json({ message: 'Product ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    if (supabase) {
      // Check if user already reviewed this product
      const { data: existing } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', req.user.userId)
        .eq('product_id', product_id)
        .single();

      if (existing) {
        return res.status(400).json({ message: 'You have already reviewed this product' });
      }

      // Get user name
      const user = await getUserById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { data: review, error } = await supabase
        .from('reviews')
        .insert({
          product_id,
          user_id: req.user.userId,
          user_name: user.name,
          rating,
          comment: comment || null,
          is_verified: true
        })
        .select()
        .single();

      if (error) throw error;

      res.json({ message: 'Review created successfully', review });
    } else {
      res.json({ message: 'Review created successfully (dev mode)' });
    }
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Failed to create review', error: error.message });
  }
});

// ===== ANALYTICS ROUTES =====

// Get analytics overview
app.get('/api/analytics/overview', authenticateToken, async (req, res) => {
  try {
    const { timeFrame = '30days' } = req.query;

    if (req.user.role !== 'artisan') {
      return res.status(403).json({ message: 'Only artisans can access analytics' });
    }

    if (supabase) {
      // Get artisan's products
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('artisan_id', req.user.userId);

      const productIds = products?.map(p => p.id) || [];

      if (productIds.length === 0) {
        return res.json({
          totalProducts: 0,
          totalOrders: 0,
          totalRevenue: 0,
          averageRating: 0,
          totalReviews: 0
        });
      }

      // Get orders for these products
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount, created_at')
        .contains('items', productIds.map(id => ({ product_id: id })));

      // Get reviews for these products
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating, product_id')
        .in('product_id', productIds);

      const totalProducts = productIds.length;
      const totalOrders = orders?.length || 0;
      const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0;
      const totalReviews = reviews?.length || 0;
      const averageRating = totalReviews > 0 ? 
        reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;

      res.json({
        totalProducts,
        totalOrders,
        totalRevenue,
        averageRating: Math.round(averageRating * 100) / 100,
        totalReviews
      });
    } else {
      res.json({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        averageRating: 0,
        totalReviews: 0
      });
    }
  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
});

// Sales trend analytics
app.get('/api/analytics/sales-trend', authenticateToken, async (req, res) => {
  try {
    const { timeFrame = '30days' } = req.query;

    if (req.user.role !== 'artisan') {
      return res.status(403).json({ message: 'Only artisans can access analytics' });
    }

    if (supabase) {
      // Get artisan's products
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('artisan_id', req.user.userId);

      const productIds = products?.map(p => p.id) || [];

      if (productIds.length === 0) {
        return res.json({ salesData: [] });
      }

      // Get orders for these products
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount, created_at')
        .contains('items', productIds.map(id => ({ product_id: id })))
        .order('created_at', { ascending: true });

      // Group by date
      const salesData = orders?.reduce((acc, order) => {
        const date = new Date(order.created_at).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { date, revenue: 0, orders: 0 };
        }
        acc[date].revenue += parseFloat(order.total_amount);
        acc[date].orders += 1;
        return acc;
      }, {}) || {};

      res.json({ salesData: Object.values(salesData) });
    } else {
      res.json({ salesData: [] });
    }
  } catch (error) {
    console.error('Sales trend error:', error);
    res.status(500).json({ message: 'Failed to fetch sales trend', error: error.message });
  }
});

// Top products analytics
app.get('/api/analytics/top-products', authenticateToken, async (req, res) => {
  try {
    const { timeFrame = '30days', limit = 10 } = req.query;

    if (req.user.role !== 'artisan') {
      return res.status(403).json({ message: 'Only artisans can access analytics' });
    }

    if (supabase) {
      // Get artisan's products with order counts
      const { data: products } = await supabase
        .from('products')
        .select('id, name, price, images, rating, review_count')
        .eq('artisan_id', req.user.userId)
        .order('rating', { ascending: false })
        .limit(parseInt(limit));

      res.json({ topProducts: products || [] });
    } else {
      res.json({ topProducts: [] });
    }
  } catch (error) {
    console.error('Top products error:', error);
    res.status(500).json({ message: 'Failed to fetch top products', error: error.message });
  }
});

// Category performance analytics
app.get('/api/analytics/category-performance', authenticateToken, async (req, res) => {
  try {
    const { timeFrame = '30days' } = req.query;

    if (req.user.role !== 'artisan') {
      return res.status(403).json({ message: 'Only artisans can access analytics' });
    }

    if (supabase) {
      // Get artisan's products grouped by category
      const { data: products } = await supabase
        .from('products')
        .select('category, price, rating, review_count')
        .eq('artisan_id', req.user.userId);

      // Group by category
      const categoryData = products?.reduce((acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = {
            category: product.category,
            count: 0,
            totalRevenue: 0,
            averageRating: 0,
            totalReviews: 0
          };
        }
        acc[product.category].count += 1;
        acc[product.category].totalRevenue += product.price;
        acc[product.category].totalReviews += product.review_count;
        acc[product.category].averageRating += product.rating;
        return acc;
      }, {}) || {};

      // Calculate averages
      Object.values(categoryData).forEach(category => {
        category.averageRating = category.averageRating / category.count;
      });

      res.json({ categoryPerformance: Object.values(categoryData) });
    } else {
      res.json({ categoryPerformance: [] });
    }
  } catch (error) {
    console.error('Category performance error:', error);
    res.status(500).json({ message: 'Failed to fetch category performance', error: error.message });
  }
});

// Customer insights analytics
app.get('/api/analytics/customer-insights', authenticateToken, async (req, res) => {
  try {
    const { timeFrame = '30days' } = req.query;

    if (req.user.role !== 'artisan') {
      return res.status(403).json({ message: 'Only artisans can access analytics' });
    }

    if (supabase) {
      // Get artisan's products
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('artisan_id', req.user.userId);

      const productIds = products?.map(p => p.id) || [];

      if (productIds.length === 0) {
        return res.json({ customerInsights: [] });
      }

      // Get reviews for these products
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating, comment, created_at, user_name')
        .in('product_id', productIds)
        .order('created_at', { ascending: false })
        .limit(20);

      res.json({ customerInsights: reviews || [] });
    } else {
      res.json({ customerInsights: [] });
    }
  } catch (error) {
    console.error('Customer insights error:', error);
    res.status(500).json({ message: 'Failed to fetch customer insights', error: error.message });
  }
});

// Seasonal trends analytics
app.get('/api/analytics/seasonal-trends', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'artisan') {
      return res.status(403).json({ message: 'Only artisans can access analytics' });
    }

    res.json({ 
      seasonalTrends: [
        { month: 'January', sales: 1200, orders: 15 },
        { month: 'February', sales: 1500, orders: 18 },
        { month: 'March', sales: 1800, orders: 22 },
        { month: 'April', sales: 2000, orders: 25 },
        { month: 'May', sales: 2200, orders: 28 },
        { month: 'June', sales: 2500, orders: 30 }
      ]
    });
  } catch (error) {
    console.error('Seasonal trends error:', error);
    res.status(500).json({ message: 'Failed to fetch seasonal trends', error: error.message });
  }
});

// Recommendations analytics
app.get('/api/analytics/recommendations', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'artisan') {
      return res.status(403).json({ message: 'Only artisans can access analytics' });
    }

    res.json({ 
      recommendations: [
        { type: 'product', message: 'Consider adding more products in the Textiles category', priority: 'high' },
        { type: 'pricing', message: 'Your pricing is competitive for the market', priority: 'medium' },
        { type: 'inventory', message: 'Low stock on popular items - consider restocking', priority: 'high' }
      ]
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ message: 'Failed to fetch recommendations', error: error.message });
  }
});

// Alerts analytics
app.get('/api/analytics/alerts', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'artisan') {
      return res.status(403).json({ message: 'Only artisans can access analytics' });
    }

    res.json({ 
      alerts: [
        { type: 'warning', message: 'Low stock alert: Cotton Kurta Set', timestamp: new Date().toISOString() },
        { type: 'info', message: 'New review received for Banarasi Saree', timestamp: new Date().toISOString() }
      ]
    });
  } catch (error) {
    console.error('Alerts error:', error);
    res.status(500).json({ message: 'Failed to fetch alerts', error: error.message });
  }
});

// Inventory insights analytics
app.get('/api/analytics/inventory-insights', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'artisan') {
      return res.status(403).json({ message: 'Only artisans can access analytics' });
    }

    if (supabase) {
      // Get artisan's products with stock information
      const { data: products } = await supabase
        .from('products')
        .select('name, stock, price, category')
        .eq('artisan_id', req.user.userId);

      const lowStock = products?.filter(p => p.stock < 5) || [];
      const outOfStock = products?.filter(p => p.stock === 0) || [];
      const totalValue = products?.reduce((sum, p) => sum + (p.price * p.stock), 0) || 0;

      res.json({ 
        inventoryInsights: {
          totalProducts: products?.length || 0,
          lowStock: lowStock.length,
          outOfStock: outOfStock.length,
          totalValue: totalValue,
          lowStockItems: lowStock,
          outOfStockItems: outOfStock
        }
      });
    } else {
      res.json({ 
        inventoryInsights: {
          totalProducts: 0,
          lowStock: 0,
          outOfStock: 0,
          totalValue: 0,
          lowStockItems: [],
          outOfStockItems: []
        }
      });
    }
  } catch (error) {
    console.error('Inventory insights error:', error);
    res.status(500).json({ message: 'Failed to fetch inventory insights', error: error.message });
  }
});

// ===== ARTISAN ROUTES =====

// Get artisan profile
app.get('/api/artisans/:artisan_id', async (req, res) => {
  try {
    const { artisan_id } = req.params;

    if (supabase) {
      const { data: artisan, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', artisan_id)
        .eq('role', 'artisan')
        .single();

      if (error) throw error;

      // Get artisan's products
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('artisan_id', artisan_id)
        .eq('availability', 'in_stock')
        .order('created_at', { ascending: false });

      res.json({
        artisan,
        products: products || []
      });
    } else {
      res.json({
        artisan: null,
        products: []
      });
    }
  } catch (error) {
    console.error('Get artisan error:', error);
    res.status(500).json({ message: 'Failed to fetch artisan', error: error.message });
  }
});

// ===== HEALTH CHECK =====

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    supabase: supabase ? 'Connected' : 'Not Connected'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Supabase: ${supabase ? 'Connected' : 'Not Connected'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
