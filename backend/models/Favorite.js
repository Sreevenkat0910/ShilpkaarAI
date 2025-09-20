const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create compound index to ensure unique user-product pairs
favoriteSchema.index({ user: 1, product: 1 }, { unique: true });

// Static method to get user's favorites with product details
favoriteSchema.statics.getUserFavorites = async function(userId, page = 1, limit = 20, sortBy = 'addedAt') {
  const skip = (page - 1) * limit;
  
  const sortOptions = {
    'addedAt': { addedAt: -1 },
    'name': { 'product.name': 1 },
    'price': { 'product.price': 1 },
    'rating': { 'product.rating': -1 }
  };
  
  const sort = sortOptions[sortBy] || sortOptions['addedAt'];
  
  const favorites = await this.find({ user: userId })
    .populate({
      path: 'product',
      select: 'name description price originalPrice images category artisan artisanName stock rating reviewCount tags materials createdAt'
    })
    .sort(sort)
    .skip(skip)
    .limit(limit);
  
  const total = await this.countDocuments({ user: userId });
  
  return {
    favorites,
    pagination: {
      current: page,
      pages: Math.ceil(total / limit),
      total,
      limit
    }
  };
};

// Static method to check if product is favorited by user
favoriteSchema.statics.isFavorited = async function(userId, productId) {
  const favorite = await this.findOne({ user: userId, product: productId });
  return !!favorite;
};

// Static method to get favorite count for a product
favoriteSchema.statics.getProductFavoriteCount = async function(productId) {
  return await this.countDocuments({ product: productId });
};

// Static method to get user's favorite count
favoriteSchema.statics.getUserFavoriteCount = async function(userId) {
  return await this.countDocuments({ user: userId });
};

module.exports = mongoose.model('Favorite', favoriteSchema);
