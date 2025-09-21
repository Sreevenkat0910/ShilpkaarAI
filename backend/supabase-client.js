// Supabase configuration for ShilpkaarAI
// This file contains all the Supabase client setup and database operations

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

module.exports = {
  supabase,
  supabaseAdmin
};

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

  // Get user by email
  async getUserByEmail(email) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
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

  // Search artisans
  async searchArtisans(searchTerm, filters = {}) {
    let query = supabaseAdmin
      .from('users')
      .select('*')
      .eq('role', 'artisan')
      .eq('is_verified', true);

    if (searchTerm) {
      query = query.textSearch('search_text', searchTerm);
    }

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters.craft) {
      query = query.ilike('craft', `%${filters.craft}%`);
    }

    if (filters.state) {
      query = query.ilike('state', `%${filters.state}%`);
    }

    const { data, error } = await query.order('rating', { ascending: false });
    
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
        artisan:users(name, location, rating, review_count)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get products by artisan
  async getProductsByArtisan(artisanId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('artisan_id', artisanId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data;
  },

  // Search products
  async searchProducts(searchTerm, filters = {}) {
    let query = supabaseAdmin
      .from('products')
      .select('*')
      .eq('is_active', true);

    if (searchTerm) {
      query = query.textSearch('search_text', searchTerm);
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters.artisanId) {
      query = query.eq('artisan_id', filters.artisanId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
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

  // Get orders by customer
  async getOrdersByCustomer(customerId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        items:products(id, name, images, artisan_name)
      `)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data;
  },

  // Get order by ID
  async getOrderById(id) {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
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

// Favorite operations
const FavoriteOperations = {
  // Add to favorites
  async addToFavorites(userId, productId) {
    const { data, error } = await supabaseAdmin
      .from('favorites')
      .insert([{ user_id: userId, product_id: productId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Remove from favorites
  async removeFromFavorites(userId, productId) {
    const { error } = await supabaseAdmin
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    
    if (error) throw error;
    return true;
  },

  // Get user favorites
  async getUserFavorites(userId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    
    const { data, error } = await supabaseAdmin
      .from('favorites')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', userId)
      .order('added_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
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
    
    return !error && data;
  },

  // Get favorite count for product
  async getProductFavoriteCount(productId) {
    const { count, error } = await supabaseAdmin
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('product_id', productId);
    
    if (error) throw error;
    return count || 0;
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
  async getReviewsByProduct(productId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data;
  },

  // Get average rating for product
  async getAverageRating(productId) {
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .select('rating')
      .eq('product_id', productId);
    
    if (error) throw error;
    
    if (data.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }
    
    const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / data.length;
    
    return {
      averageRating: Math.round(averageRating * 100) / 100,
      totalReviews: data.length
    };
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
  }
};

module.exports = {
  supabase,
  supabaseAdmin,
  UserOperations,
  ProductOperations,
  OrderOperations,
  FavoriteOperations,
  ReviewOperations
};
