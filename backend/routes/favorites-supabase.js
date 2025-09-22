const express = require('express');
const { FavoriteOperations } = require('../models/supabase');
const { auth } = require('../middleware/auth');
const { validateRequest, asyncHandler, sendSuccess, sendError } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/favorites/
// @desc    Get user's favorites
// @access  Private
router.get('/', auth, asyncHandler(async (req, res) => {
  const favorites = await FavoriteOperations.getUserFavorites(req.user.userId);
  
  sendSuccess(res, { favorites }, 'Favorites retrieved successfully');
}));

// @route   POST /api/favorites/
// @desc    Add product to favorites
// @access  Private
router.post('/', auth, [
  body('product_id').isUUID().withMessage('Valid product ID is required')
], validateRequest, asyncHandler(async (req, res) => {
  const { product_id } = req.body;
  
  // Check if already favorited
  const isFavorited = await FavoriteOperations.isFavorited(req.user.userId, product_id);
  if (isFavorited) {
    return sendError(res, 'Product already in favorites', 400);
  }

  const favorite = await FavoriteOperations.addFavorite(req.user.userId, product_id);
  
  sendSuccess(res, { favorite }, 'Product added to favorites', 201);
}));

// @route   DELETE /api/favorites/:productId
// @desc    Remove product from favorites
// @access  Private
router.delete('/:productId', auth, asyncHandler(async (req, res) => {
  const { productId } = req.params;
  
  await FavoriteOperations.removeFavorite(req.user.userId, productId);
  
  sendSuccess(res, null, 'Product removed from favorites');
}));

// @route   POST /api/favorites/toggle
// @desc    Toggle favorite status
// @access  Private
router.post('/toggle', auth, [
  body('product_id').isUUID().withMessage('Valid product ID is required')
], validateRequest, asyncHandler(async (req, res) => {
  const { product_id } = req.body;
  
  const isFavorited = await FavoriteOperations.isFavorited(req.user.userId, product_id);
  
  if (isFavorited) {
    await FavoriteOperations.removeFavorite(req.user.userId, product_id);
    sendSuccess(res, { favorited: false }, 'Product removed from favorites');
  } else {
    const favorite = await FavoriteOperations.addFavorite(req.user.userId, product_id);
    sendSuccess(res, { favorited: true, favorite }, 'Product added to favorites');
  }
}));

// @route   GET /api/favorites/count/:productId
// @desc    Get favorite count for product
// @access  Public
router.get('/count/:productId', asyncHandler(async (req, res) => {
  const { productId } = req.params;
  
  const count = await FavoriteOperations.getFavoriteCount(productId);
  
  sendSuccess(res, { count }, 'Favorite count retrieved successfully');
}));

module.exports = router;
