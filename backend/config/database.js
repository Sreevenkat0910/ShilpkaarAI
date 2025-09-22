const mongoose = require('mongoose');

class DatabaseConnection {
  constructor() {
    this.isConnected = false;
    this.connection = null;
  }

  async connect() {
    try {
      if (this.isConnected) {
        console.log('✅ Database already connected');
        return;
      }

      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shilpkaarai';
      
      const options = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
      };

      this.connection = await mongoose.connect(mongoUri, options);
      this.isConnected = true;
      
      console.log('✅ Connected to MongoDB');
      console.log(`📊 Database: ${this.connection.connection.name}`);
      
      // Handle connection events
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB disconnected');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
        this.isConnected = true;
      });

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await this.disconnect();
        process.exit(0);
      });

    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      this.isConnected = false;
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.connection) {
        await mongoose.connection.close();
        this.isConnected = false;
        console.log('✅ MongoDB disconnected');
      }
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error);
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    };
  }

  async createIndexes() {
    try {
      if (!this.isConnected) {
        throw new Error('Database not connected');
      }

      console.log('🔍 Creating database indexes...');
      
      // Create text search indexes
      if (process.env.ENABLE_TEXT_SEARCH === 'true') {
        await this.createTextIndexes();
      }

      // Create compound indexes
      if (process.env.ENABLE_COMPOUND_INDEXES === 'true') {
        await this.createCompoundIndexes();
      }

      console.log('✅ Database indexes created successfully');
    } catch (error) {
      console.error('❌ Error creating indexes:', error);
      throw error;
    }
  }

  async createTextIndexes() {
    const db = mongoose.connection.db;
    
    try {
      // Drop existing text indexes first
      await db.collection('products').dropIndex('name_text');
      await db.collection('users').dropIndex('name_text');
    } catch (error) {
      // Index might not exist, that's okay
      console.log('Some indexes may not exist, continuing...');
    }
    
    // Product text search index
    await db.collection('products').createIndex({
      name: 'text',
      description: 'text',
      category: 'text',
      subcategory: 'text',
      craft: 'text',
      artisanName: 'text',
      location: 'text',
      region: 'text',
      tags: 'text',
      materials: 'text',
      color: 'text',
      technique: 'text',
      occasion: 'text',
      searchKeywords: 'text',
      searchText: 'text'
    }, {
      weights: {
        name: 10,
        category: 8,
        subcategory: 6,
        craft: 6,
        artisanName: 5,
        tags: 4,
        materials: 3,
        description: 2,
        searchKeywords: 3,
        searchText: 1
      },
      name: 'product_search_index'
    });

    // User/Artisan text search index
    await db.collection('users').createIndex({
      name: 'text',
      craft: 'text',
      location: 'text',
      region: 'text',
      state: 'text',
      city: 'text',
      bio: 'text',
      crafts: 'text',
      techniques: 'text',
      specializations: 'text',
      certifications: 'text',
      searchText: 'text'
    }, {
      weights: {
        name: 10,
        craft: 8,
        location: 6,
        region: 5,
        state: 4,
        city: 4,
        crafts: 3,
        techniques: 3,
        specializations: 3,
        bio: 2,
        certifications: 2,
        searchText: 1
      },
      name: 'artisan_search_index'
    });
  }

  async createCompoundIndexes() {
    const db = mongoose.connection.db;
    
    // Product compound indexes
    await db.collection('products').createIndex({ artisan: 1, isActive: 1 });
    await db.collection('products').createIndex({ category: 1, isActive: 1 });
    await db.collection('products').createIndex({ artisan: 1, category: 1 });
    await db.collection('products').createIndex({ price: 1, rating: 1 });
    await db.collection('products').createIndex({ createdAt: -1, isActive: 1 });
    
    // User compound indexes
    await db.collection('users').createIndex({ role: 1, isVerified: 1 });
    await db.collection('users').createIndex({ role: 1, location: 1 });
    await db.collection('users').createIndex({ role: 1, craft: 1 });
    
    // Order compound indexes
    await db.collection('orders').createIndex({ customer: 1, createdAt: -1 });
    await db.collection('orders').createIndex({ status: 1, createdAt: -1 });
    
    // Review compound indexes
    await db.collection('reviews').createIndex({ product: 1, user: 1 }, { unique: true });
    await db.collection('reviews').createIndex({ product: 1, rating: 1 });
    await db.collection('reviews').createIndex({ user: 1, createdAt: -1 });
    
    // Favorite compound indexes
    await db.collection('favorites').createIndex({ user: 1, product: 1 }, { unique: true });
    await db.collection('favorites').createIndex({ user: 1, addedAt: -1 });
  }
}

module.exports = new DatabaseConnection();
