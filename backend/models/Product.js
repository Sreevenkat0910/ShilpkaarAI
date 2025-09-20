const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: true,
    trim: true
  },
  artisan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  artisanName: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    default: 1,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      default: 'cm'
    }
  },
  weight: {
    type: Number,
    default: 0
  },
  materials: [{
    type: String,
    trim: true
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);
