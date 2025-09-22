const express = require('express');
const { query } = require('express-validator');
const { UserOperations, ProductOperations } = require('../models/supabase');
const { auth } = require('../middleware/auth');
const { validateRequest, asyncHandler, sendSuccess, sendError } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/artisans/search
// @desc    Search artisans with filters
// @access  Public
router.get('/search', [
  query('q').optional().trim(),
  query('craft').optional().trim(),
  query('location').optional().trim(),
  query('region').optional().trim(),
  query('minExperience').optional().isInt({ min: 0 }),
  query('minRating').optional().isNumeric(),
  query('verified').optional().isBoolean(),
  query('sortBy').optional().isIn(['rating', 'experience', 'newest', 'name']),
  query('sortOrder').optional().isIn(['asc', 'desc']),
  query('limit').optional().isInt({ min: 1, max: 100 })
], validateRequest, asyncHandler(async (req, res) => {
  const {
    q = '',
    craft = '',
    location = '',
    region = '',
    minExperience = '',
    minRating = '',
    verified = '',
    sortBy = 'rating',
    sortOrder = 'desc',
    limit = 20
  } = req.query;

  // Build search filters
  const filters = {};
  if (q) filters.q = q;
  if (craft) filters.craft = craft;
  if (location) filters.location = location;
  if (region) filters.region = region;
  if (minExperience) filters.minExperience = parseInt(minExperience);
  if (minRating) filters.minRating = parseFloat(minRating);
  if (verified === 'true') filters.is_verified = true;

  const artisans = await UserOperations.searchUsers(q);
  
  // Filter artisans by role
  const artisanUsers = artisans.filter(user => user.role === 'artisan');
  
  sendSuccess(res, { artisans: artisanUsers }, 'Artisans retrieved successfully');
}));

// @route   GET /api/artisans/all
// @desc    Get all artisans
// @access  Public
router.get('/all', asyncHandler(async (req, res) => {
  const users = await UserOperations.getAllUsers();
  const artisans = users.filter(user => user.role === 'artisan');
  
  sendSuccess(res, { artisans }, 'All artisans retrieved successfully');
}));

// @route   GET /api/artisans/:id
// @desc    Get single artisan profile
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const artisan = await UserOperations.getUserById(id);
  if (!artisan || artisan.role !== 'artisan') {
    return sendError(res, 'Artisan not found', 404);
  }

  // Get artisan's products
  const products = await ProductOperations.searchProducts({ artisan_id: id });
  
  sendSuccess(res, { 
    artisan,
    products: products.slice(0, 6) // Recent 6 products
  }, 'Artisan profile retrieved successfully');
}));

// @route   GET /api/artisans/crafts/all
// @desc    Get all crafts
// @access  Public
router.get('/crafts/all', asyncHandler(async (req, res) => {
  const users = await UserOperations.getAllUsers();
  const artisans = users.filter(user => user.role === 'artisan' && user.craft);
  
  const crafts = [...new Set(artisans.map(artisan => artisan.craft))];
  
  sendSuccess(res, { crafts }, 'All crafts retrieved successfully');
}));

// @route   GET /api/artisans/locations/all
// @desc    Get all locations
// @access  Public
router.get('/locations/all', asyncHandler(async (req, res) => {
  const users = await UserOperations.getAllUsers();
  const artisans = users.filter(user => user.role === 'artisan' && user.location);
  
  const locations = [...new Set(artisans.map(artisan => artisan.location))];
  
  sendSuccess(res, { locations }, 'All locations retrieved successfully');
}));

module.exports = router;
