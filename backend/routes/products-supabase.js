const express = require('express');
const { body, query } = require('express-validator');
const { ProductOperations } = require('../models/supabase');
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

  // Build filters object
  const filters = {};
  
  if (q) filters.q = q;
  if (category) filters.category = category;
  if (subcategory) filters.subcategory = subcategory;
  if (craft) filters.craft = craft;
  if (artisan) filters.artisan_id = artisan;
  if (location) filters.location = location;
  if (region) filters.region = region;
  if (minPrice) filters.minPrice = parseFloat(minPrice);
  if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
  if (minRating) filters.minRating = parseFloat(minRating);
  if (materials) filters.materials = materials;
  if (colors) filters.colors = colors;
  if (techniques) filters.techniques = techniques;
  if (occasions) filters.occasions = occasions;
  if (ageGroup) filters.ageGroup = ageGroup;
  if (gender) filters.gender = gender;
  if (season) filters.season = season;
  if (sustainability) filters.sustainability = sustainability;
  if (condition) filters.condition = condition;
  if (availability) filters.availability = availability;
  if (featured === 'true') filters.featured = true;
  if (trending === 'true') filters.trending = true;
  
  filters.sortBy = sortBy;
  filters.sortOrder = sortOrder;
  filters.limit = parseInt(limit);
  filters.offset = (parseInt(page) - 1) * parseInt(limit);

  // Execute search
  const products = await ProductOperations.searchProducts(filters);

  // Get filter options
  const categories = await ProductOperations.getAllCategories();

  sendSuccess(res, {
    products: products,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(products.length / parseInt(limit)),
      total: products.length,
      limit: parseInt(limit)
    },
    filters: {
      categories: categories,
      searchQuery: req.query
    }
  }, 'Products retrieved successfully');
}));

// @route   GET /api/products/all
// @desc    Get all products
// @access  Public
router.get('/all', asyncHandler(async (req, res) => {
  const products = await ProductOperations.getAllProducts();
  
  sendSuccess(res, { products }, 'All products retrieved successfully');
}));

// @route   GET /api/products/one
// @desc    Get single product by ID
// @access  Public
router.get('/one', [
  query('id').isUUID().withMessage('Valid product ID is required')
], validateRequest, asyncHandler(async (req, res) => {
  const { id } = req.query;

  const product = await ProductOperations.getProductById(id);
  if (!product) {
    return sendError(res, 'Product not found', 404);
  }

  sendSuccess(res, { product }, 'Product retrieved successfully');
}));

// @route   GET /api/products/category
// @desc    Get products by category
// @access  Public
router.get('/category', [
  query('category').notEmpty().withMessage('Category is required')
], validateRequest, asyncHandler(async (req, res) => {
  const { category } = req.query;

  const products = await ProductOperations.getProductsByCategory(category);
  
  sendSuccess(res, { products }, `Products in ${category} category retrieved successfully`);
}));

// @route   GET /api/products/categories/all
// @desc    Get all categories
// @access  Public
router.get('/categories/all', asyncHandler(async (req, res) => {
  const categories = await ProductOperations.getAllCategories();
  
  sendSuccess(res, { categories }, 'All categories retrieved successfully');
}));

// @route   POST /api/products/
// @desc    Create a new product
// @access  Private (Artisan only)
router.post('/', auth, requireVerifiedArtisan, [
  body('name').trim().isLength({ min: 2 }).withMessage('Product name must be at least 2 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').isNumeric().withMessage('Price must be a valid number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
], validateRequest, asyncHandler(async (req, res) => {
  const productData = {
    ...req.body,
    artisan_id: req.user.userId,
    artisan_name: req.user.name,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const product = await ProductOperations.createProduct(productData);
  
  sendSuccess(res, { product }, 'Product created successfully', 201);
}));

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (Artisan only)
router.put('/:id', auth, requireVerifiedArtisan, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Product name must be at least 2 characters'),
  body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').optional().isNumeric().withMessage('Price must be a valid number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
], validateRequest, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Check if product exists and belongs to user
  const existingProduct = await ProductOperations.getProductById(id);
  if (!existingProduct) {
    return sendError(res, 'Product not found', 404);
  }
  
  if (existingProduct.artisan_id !== req.user.userId) {
    return sendError(res, 'Not authorized to update this product', 403);
  }

  const updateData = {
    ...req.body,
    updated_at: new Date().toISOString()
  };

  const product = await ProductOperations.updateProduct(id, updateData);
  
  sendSuccess(res, { product }, 'Product updated successfully');
}));

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (Artisan only)
router.delete('/:id', auth, requireVerifiedArtisan, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Check if product exists and belongs to user
  const existingProduct = await ProductOperations.getProductById(id);
  if (!existingProduct) {
    return sendError(res, 'Product not found', 404);
  }
  
  if (existingProduct.artisan_id !== req.user.userId) {
    return sendError(res, 'Not authorized to delete this product', 403);
  }

  await ProductOperations.deleteProduct(id);
  
  sendSuccess(res, null, 'Product deleted successfully');
}));

module.exports = router;
