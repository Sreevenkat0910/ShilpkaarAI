const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'artisan'],
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: '',
    index: true
  },
  region: {
    type: String,
    default: '',
    index: true
  },
  state: {
    type: String,
    default: '',
    index: true
  },
  city: {
    type: String,
    default: '',
    index: true
  },
  craft: {
    type: String,
    default: '',
    index: true
  },
  crafts: [{
    type: String,
    trim: true,
    index: true
  }],
  experience: {
    type: Number,
    default: 0,
    index: true
  },
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
  productsCount: {
    type: Number,
    default: 0,
    min: 0
  },
  techniques: [{
    type: String,
    trim: true,
    index: true
  }],
  specializations: [{
    type: String,
    trim: true,
    index: true
  }],
  certifications: [{
    type: String,
    trim: true,
    index: true
  }],
  languages: [{
    type: String,
    trim: true,
    index: true
  }],
  bio: {
    type: String,
    default: '',
    index: true
  },
  workshopOffered: {
    type: Boolean,
    default: false,
    index: true
  },
  onlinePresence: {
    website: String,
    instagram: String,
    facebook: String,
    youtube: String
  },
  // Text search index
  searchText: {
    type: String,
    index: 'text'
  },
  googleId: {
    type: String,
    sparse: true
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create search text and update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Create searchable text field for artisans
  if (this.role === 'artisan') {
    const searchFields = [
      this.name,
      this.craft,
      this.location,
      this.region,
      this.state,
      this.city,
      this.bio,
      ...(this.crafts || []),
      ...(this.techniques || []),
      ...(this.specializations || []),
      ...(this.certifications || [])
    ];
    
    this.searchText = searchFields.filter(field => field).join(' ');
  }
  
  next();
});

// Create text index for artisan search
userSchema.index({
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

module.exports = mongoose.model('User', userSchema);
