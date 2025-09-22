const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client for client-side operations (uses anon key)
const supabase = createClient(supabaseUrl, supabaseKey);

// Client for server-side operations (uses service role key)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Database operations (replacing MongoDB operations)

// User operations
const UserOperations = {
  // Create user
  async createUser(userData) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get user by ID
  async getUserById(id) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get user by mobile
  async getUserByMobile(mobile) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('mobile', mobile)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update user
  async updateUser(id, updateData) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get all users
  async getAllUsers() {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*');
    
    if (error) throw error;
    return data;
  },

  // Search users
  async searchUsers(query) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .or(`name.ilike.%${query}%,craft.ilike.%${query}%,location.ilike.%${query}%`);
    
    if (error) throw error;
    return data;
  }
};

// Product operations
const ProductOperations = {
  // Create product
  async createProduct(productData) {
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([productData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get product by ID
  async getProductById(id) {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        artisan:users(id, name, location, craft, experience, rating)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get all products
  async getAllProducts() {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        artisan:users(id, name, location, craft, experience, rating)
      `);
    
    if (error) throw error;
    return data;
  },

  // Search products
  async searchProducts(filters = {}) {
    let query = supabaseAdmin
      .from('products')
      .select(`
        *,
        artisan:users(id, name, location, craft, experience, rating)
      `);

    // Apply filters
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.artisan_id) {
      query = query.eq('artisan_id', filters.artisan_id);
    }
    if (filters.featured) {
      query = query.eq('featured', true);
    }
    if (filters.trending) {
      query = query.eq('trending', true);
    }
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }
    if (filters.minRating) {
      query = query.gte('rating', filters.minRating);
    }
    if (filters.q) {
      query = query.or(`name.ilike.%${filters.q}%,description.ilike.%${filters.q}%`);
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price':
          query = query.order('price', { ascending: filters.sortOrder === 'asc' });
          break;
        case 'rating':
          query = query.order('rating', { ascending: filters.sortOrder === 'asc' });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'name':
          query = query.order('name', { ascending: filters.sortOrder === 'asc' });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }
    }

    // Apply pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  // Update product
  async updateProduct(id, updateData) {
    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete product
  async deleteProduct(id) {
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Get products by category
  async getProductsByCategory(category) {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        artisan:users(id, name, location, craft, experience, rating)
      `)
      .eq('category', category);
    
    if (error) throw error;
    return data;
  },

  // Get all categories
  async getAllCategories() {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('category')
      .not('category', 'is', null);
    
    if (error) throw error;
    
    // Get unique categories
    const uniqueCategories = [...new Set(data.map(item => item.category))];
    return uniqueCategories;
  }
};

// Order operations
const OrderOperations = {
  // Create order
  async createOrder(orderData) {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert([orderData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get order by ID
  async getOrderById(id) {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        customer:users!orders_customer_id_fkey(id, name, mobile, email),
        items:order_items(
          *,
          product:products(id, name, price, images)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get orders by customer
  async getOrdersByCustomer(customerId) {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(id, name, price, images)
        )
      `)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get orders by artisan
  async getOrdersByArtisan(artisanId) {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        customer:users!orders_customer_id_fkey(id, name, mobile, email),
        items:order_items(
          *,
          product:products!order_items_product_id_fkey(id, name, price, images, artisan_id)
        )
      `)
      .eq('items.product.artisan_id', artisanId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Update order status
  async updateOrderStatus(id, status) {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Review operations
const ReviewOperations = {
  // Create review
  async createReview(reviewData) {
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .insert([reviewData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get reviews by product
  async getReviewsByProduct(productId) {
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .select(`
        *,
        user:users(id, name)
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get review by user and product
  async getReviewByUserAndProduct(userId, productId) {
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update review
  async updateReview(id, updateData) {
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete review
  async deleteReview(id) {
    const { error } = await supabaseAdmin
      .from('reviews')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Get average rating for product
  async getAverageRating(productId) {
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .select('rating')
      .eq('product_id', productId);
    
    if (error) throw error;
    
    if (data.length === 0) return { average: 0, count: 0 };
    
    const average = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
    return { average, count: data.length };
  }
};

// Favorite operations
const FavoriteOperations = {
  // Add favorite
  async addFavorite(userId, productId) {
    const { data, error } = await supabaseAdmin
      .from('favorites')
      .insert([{ user_id: userId, product_id: productId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Remove favorite
  async removeFavorite(userId, productId) {
    const { error } = await supabaseAdmin
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    
    if (error) throw error;
    return true;
  },

  // Get user favorites
  async getUserFavorites(userId) {
    const { data, error } = await supabaseAdmin
      .from('favorites')
      .select(`
        *,
        product:products(
          *,
          artisan:users(id, name, location, craft, experience, rating)
        )
      `)
      .eq('user_id', userId)
      .order('added_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Check if product is favorited
  async isFavorited(userId, productId) {
    const { data, error } = await supabaseAdmin
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();
    
    if (error) return false;
    return !!data;
  },

  // Get favorite count for product
  async getFavoriteCount(productId) {
    const { count, error } = await supabaseAdmin
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('product_id', productId);
    
    if (error) throw error;
    return count || 0;
  }
};

module.exports = {
  supabase,
  supabaseAdmin,
  UserOperations,
  ProductOperations,
  OrderOperations,
  ReviewOperations,
  FavoriteOperations
};
