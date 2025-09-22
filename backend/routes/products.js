const express = require('express');
const { body, query } = require('express-validator');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const { auth, requireRole, requireVerifiedArtisan } = require('../middleware/auth');
const { validateRequest, asyncHandler, sendSuccess, sendError } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/products/search
// @desc    Advanced product search with filters
// @access  Public
router.get('/search', [
  query('q').optional().trim(),
  query('category').optional().trim(),
  query('subcategory').optional().trim(),
  query('craft').optional().trim(),
  query('artisan').optional().trim(),
  query('location').optional().trim(),
  query('region').optional().trim(),
  query('minPrice').optional().isNumeric(),
  query('maxPrice').optional().isNumeric(),
  query('minRating').optional().isNumeric(),
  query('materials').optional().trim(),
  query('colors').optional().trim(),
  query('techniques').optional().trim(),
  query('occasions').optional().trim(),
  query('ageGroup').optional().isIn(['kids', 'adults', 'all']),
  query('gender').optional().isIn(['men', 'women', 'unisex']),
  query('season').optional().trim(),
  query('sustainability').optional().isIn(['eco_friendly', 'organic', 'recycled', 'traditional']),
  query('condition').optional().isIn(['new', 'used', 'refurbished']),
  query('availability').optional().isIn(['in_stock', 'out_of_stock', 'discontinued']),
  query('featured').optional().isBoolean(),
  query('trending').optional().isBoolean(),
  query('sortBy').optional().isIn(['relevance', 'price', 'rating', 'newest', 'oldest', 'name']),
  query('sortOrder').optional().isIn(['asc', 'desc']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], validateRequest, asyncHandler(async (req, res) => {
  const {
    q = '',
    category = '',
    subcategory = '',
    craft = '',
    artisan = '',
    location = '',
    region = '',
    minPrice = '',
    maxPrice = '',
    minRating = '',
    materials = '',
    colors = '',
    techniques = '',
    occasions = '',
    ageGroup = '',
    gender = '',
    season = '',
    sustainability = '',
    condition = '',
    availability = '',
    featured = '',
    trending = '',
    sortBy = 'relevance',
    sortOrder = 'desc',
    page = 1,
    limit = 20
  } = req.query;

  // Build search query
  let searchQuery = { isActive: true };

  // Text search
  if (q) {
    searchQuery.$text = { $search: q };
  }

  // Category filters
  if (category) {
    searchQuery.category = new RegExp(category, 'i');
  }

  if (subcategory) {
    searchQuery.subcategory = new RegExp(subcategory, 'i');
  }

  if (craft) {
    searchQuery.craft = new RegExp(craft, 'i');
  }

  if (artisan) {
    searchQuery.artisanName = new RegExp(artisan, 'i');
  }

  // Location filters
  if (location) {
    searchQuery.location = new RegExp(location, 'i');
  }

  if (region) {
    searchQuery.region = new RegExp(region, 'i');
  }

  // Price range
  if (minPrice || maxPrice) {
    searchQuery.price = {};
    if (minPrice) searchQuery.price.$gte = parseFloat(minPrice);
    if (maxPrice) searchQuery.price.$lte = parseFloat(maxPrice);
  }

  // Rating filter
  if (minRating) {
    searchQuery.rating = { $gte: parseFloat(minRating) };
  }

  // Array filters
  if (materials) {
    const materialArray = materials.split(',').map(m => m.trim());
    searchQuery.materials = { $in: materialArray.map(m => new RegExp(m, 'i')) };
  }

  if (colors) {
    const colorArray = colors.split(',').map(c => c.trim());
    searchQuery.color = { $in: colorArray.map(c => new RegExp(c, 'i')) };
  }

  if (techniques) {
    const techniqueArray = techniques.split(',').map(t => t.trim());
    searchQuery.technique = { $in: techniqueArray.map(t => new RegExp(t, 'i')) };
  }

  if (occasions) {
    const occasionArray = occasions.split(',').map(o => o.trim());
    searchQuery.occasion = { $in: occasionArray.map(o => new RegExp(o, 'i')) };
  }

  // Single value filters
  if (ageGroup) searchQuery.ageGroup = ageGroup;
  if (gender) searchQuery.gender = gender;
  if (season) searchQuery.season = { $in: [season, 'all'] };
  if (sustainability) searchQuery.sustainability = sustainability;
  if (condition) searchQuery.condition = condition;
  if (availability) searchQuery.availability = availability;

  // Boolean filters
  if (featured === 'true') searchQuery.featured = true;
  if (trending === 'true') searchQuery.trending = true;

  // Build sort object
  let sortObj = {};
  switch (sortBy) {
    case 'price':
      sortObj.price = sortOrder === 'asc' ? 1 : -1;
      break;
    case 'rating':
      sortObj.rating = sortOrder === 'asc' ? 1 : -1;
      break;
    case 'newest':
      sortObj.createdAt = -1;
      break;
    case 'oldest':
      sortObj.createdAt = 1;
      break;
    case 'name':
      sortObj.name = sortOrder === 'asc' ? 1 : -1;
      break;
    case 'relevance':
    default:
      if (q) {
        sortObj.score = { $meta: 'textScore' };
      } else {
        sortObj.createdAt = -1;
      }
      break;
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute search
  const products = await Product.find(searchQuery)
    .populate('artisan', 'name location craft experience rating')
    .sort(sortObj)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Product.countDocuments(searchQuery);

  // Get filter options for the current search
  const filterOptions = await getFilterOptions(searchQuery);

  sendSuccess(res, {
    products: products,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total: total,
      limit: parseInt(limit)
    },
    filters: filterOptions,
    searchQuery: {
      q, category, subcategory, craft, artisan, location, region,
      minPrice, maxPrice, minRating, materials, colors, techniques,
      occasions, ageGroup, gender, season, sustainability, condition,
      availability, featured, trending, sortBy, sortOrder
    }
  }, 'Products retrieved successfully');
}));

// @route   GET /api/products/all
// @desc    Get all products
// @access  Public
router.get('/all', [
  query('count').optional().isInt({ min: 1, max: 100 }),
  query('page').optional().isInt({ min: 1 })
], validateRequest, asyncHandler(async (req, res) => {
  const { count = 20, page = 1 } = req.query;
  const limit = parseInt(count);
  const skip = (parseInt(page) - 1) * limit;

  const products = await Product.find({ isActive: true })
    .populate('artisan', 'name location craft')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  const total = await Product.countDocuments({ isActive: true });

  sendSuccess(res, {
    productsData: products,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    }
  }, 'Products retrieved successfully');
}));

// @route   GET /api/products/one
// @desc    Get single product by ID
// @access  Public
router.get('/one', [
  query('id').isMongoId().withMessage('Valid product ID is required')
], validateRequest, asyncHandler(async (req, res) => {
  const { id } = req.query;

  const product = await Product.findById(id)
    .populate('artisan', 'name location craft experience');

  if (!product) {
    return sendError(res, 'Product not found', 404);
  }

  sendSuccess(res, { product: product }, 'Product retrieved successfully');
}));

// @route   GET /api/products/category
// @desc    Get products by category
// @access  Public
router.get('/category', [
  query('category').notEmpty().withMessage('Category is required')
], validateRequest, asyncHandler(async (req, res) => {
  const { category } = req.query;

  const products = await Product.find({ 
    category: new RegExp(category, 'i'),
    isActive: true 
  }).populate('artisan', 'name location craft');

  sendSuccess(res, products, 'Products retrieved successfully');
}));

// @route   GET /api/products/categories/all
// @desc    Get all categories
// @access  Public
router.get('/categories/all', [
  query('count').optional().isInt({ min: 1, max: 100 })
], validateRequest, asyncHandler(async (req, res) => {
  const { count = 20 } = req.query;
  
  const categories = await Product.distinct('category', { isActive: true });
  
  sendSuccess(res, categories.slice(0, parseInt(count)), 'Categories retrieved successfully');
}));

// @route   POST /api/products
// @desc    Create new product (Artisan only)
// @access  Private
router.post('/', auth, requireVerifiedArtisan, [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').isNumeric().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required')
], validateRequest, asyncHandler(async (req, res) => {
  const productData = {
    ...req.body,
    artisan: req.user.id,
    artisanName: req.user.name || 'Unknown Artisan'
  };

  const product = new Product(productData);
  await product.save();

  // Update artisan's product count
  await User.findByIdAndUpdate(req.user.id, {
    $inc: { productsCount: 1 }
  });

  sendSuccess(res, product, 'Product created successfully', 201);
}));

// @route   PUT /api/products/:id
// @desc    Update product (Artisan only)
// @access  Private
router.put('/:id', auth, requireVerifiedArtisan, [
  body('name').optional().trim().isLength({ min: 2 }),
  body('description').optional().trim().isLength({ min: 10 }),
  body('price').optional().isNumeric().isFloat({ min: 0 }),
  body('category').optional().trim().notEmpty(),
  body('images').optional().isArray({ min: 1 })
], validateRequest, asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return sendError(res, 'Product not found', 404);
  }

  if (product.artisan.toString() !== req.user.id) {
    return sendError(res, 'You can only update your own products', 403);
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  sendSuccess(res, updatedProduct, 'Product updated successfully');
}));

// @route   DELETE /api/products/:id
// @desc    Delete product (Artisan only)
// @access  Private
router.delete('/:id', auth, requireVerifiedArtisan, asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return sendError(res, 'Product not found', 404);
  }

  if (product.artisan.toString() !== req.user.id) {
    return sendError(res, 'You can only delete your own products', 403);
  }

  await Product.findByIdAndDelete(req.params.id);

  // Update artisan's product count
  await User.findByIdAndUpdate(req.user.id, {
    $inc: { productsCount: -1 }
  });

  sendSuccess(res, null, 'Product deleted successfully');
}));

// Helper function to get filter options
async function getFilterOptions(baseQuery) {
  try {
    const [
      categories,
      subcategories,
      crafts,
      locations,
      regions,
      materials,
      colors,
      techniques,
      occasions,
      priceRange,
      ratingRange
    ] = await Promise.all([
      Product.distinct('category', baseQuery),
      Product.distinct('subcategory', baseQuery),
      Product.distinct('craft', baseQuery),
      Product.distinct('location', baseQuery),
      Product.distinct('region', baseQuery),
      Product.distinct('materials', baseQuery),
      Product.distinct('color', baseQuery),
      Product.distinct('technique', baseQuery),
      Product.distinct('occasion', baseQuery),
      Product.aggregate([
        { $match: baseQuery },
        {
          $group: {
            _id: null,
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
          }
        }
      ]),
      Product.aggregate([
        { $match: baseQuery },
        {
          $group: {
            _id: null,
            minRating: { $min: '$rating' },
            maxRating: { $max: '$rating' }
          }
        }
      ])
    ]);

    return {
      categories: categories.filter(c => c),
      subcategories: subcategories.filter(s => s),
      crafts: crafts.filter(c => c),
      locations: locations.filter(l => l),
      regions: regions.filter(r => r),
      materials: [...new Set(materials.flat())].filter(m => m),
      colors: [...new Set(colors.flat())].filter(c => c),
      techniques: [...new Set(techniques.flat())].filter(t => t),
      occasions: [...new Set(occasions.flat())].filter(o => o),
      priceRange: priceRange[0] || { minPrice: 0, maxPrice: 0 },
      ratingRange: ratingRange[0] || { minRating: 0, maxRating: 5 }
    };
  } catch (error) {
    console.error('Error getting filter options:', error);
    return {};
  }
}

module.exports = router;
