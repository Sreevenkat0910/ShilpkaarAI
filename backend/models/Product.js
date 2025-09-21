const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    index: true
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
    trim: true,
    index: true
  },
  artisan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  artisanName: {
    type: String,
    required: true,
    index: true
  },
  stock: {
    type: Number,
    default: 1,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  tags: [{
    type: String,
    trim: true,
    index: true
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
    trim: true,
    index: true
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
    index: true
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  subcategory: {
    type: String,
    trim: true,
    index: true
  },
  craft: {
    type: String,
    trim: true,
    index: true
  },
  color: [{
    type: String,
    trim: true,
    index: true
  }],
  size: {
    type: String,
    trim: true,
    index: true
  },
  condition: {
    type: String,
    enum: ['new', 'used', 'refurbished'],
    default: 'new',
    index: true
  },
  availability: {
    type: String,
    enum: ['in_stock', 'out_of_stock', 'discontinued'],
    default: 'in_stock',
    index: true
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  trending: {
    type: Boolean,
    default: false,
    index: true
  },
  searchKeywords: [{
    type: String,
    trim: true,
    index: true
  }],
  craftStory: {
    type: String,
    trim: true
  },
  careInstructions: {
    type: String,
    trim: true
  },
  // Enhanced search fields
  location: {
    type: String,
    trim: true,
    index: true
  },
  region: {
    type: String,
    trim: true,
    index: true
  },
  technique: [{
    type: String,
    trim: true,
    index: true
  }],
  occasion: [{
    type: String,
    trim: true,
    index: true
  }],
  ageGroup: {
    type: String,
    enum: ['kids', 'adults', 'all'],
    default: 'all',
    index: true
  },
  gender: {
    type: String,
    enum: ['men', 'women', 'unisex'],
    default: 'unisex',
    index: true
  },
  season: [{
    type: String,
    enum: ['summer', 'winter', 'monsoon', 'all'],
    default: 'all',
    index: true
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate',
    index: true
  },
  sustainability: {
    type: String,
    enum: ['eco_friendly', 'organic', 'recycled', 'traditional'],
    default: 'traditional',
    index: true
  },
  certification: [{
    type: String,
    trim: true,
    index: true
  }],
  // Text search index
  searchText: {
    type: String,
    index: 'text'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Create search text and update timestamp on save
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Create searchable text field
  const searchFields = [
    this.name,
    this.description,
    this.category,
    this.subcategory,
    this.craft,
    this.artisanName,
    this.location,
    this.region,
    ...(this.tags || []),
    ...(this.materials || []),
    ...(this.color || []),
    ...(this.technique || []),
    ...(this.occasion || []),
    ...(this.searchKeywords || [])
  ];
  
  this.searchText = searchFields.filter(field => field).join(' ');
  next();
});

// Create text index for full-text search
productSchema.index({
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

module.exports = mongoose.model('Product', productSchema);
