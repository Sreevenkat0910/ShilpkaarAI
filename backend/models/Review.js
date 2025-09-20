const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0
  },
  helpfulUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  images: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure one review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Update timestamp on save
reviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to calculate average rating for a product
reviewSchema.statics.calculateAverageRating = async function(productId) {
  const result = await this.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: null, averageRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
  ]);
  
  return result.length > 0 ? result[0] : { averageRating: 0, totalReviews: 0 };
};

// Static method to get rating distribution for a product
reviewSchema.statics.getRatingDistribution = async function(productId) {
  const result = await this.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
    { $sort: { _id: -1 } }
  ]);
  
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  result.forEach(item => {
    distribution[item._id] = item.count;
  });
  
  return distribution;
};

module.exports = mongoose.model('Review', reviewSchema);
