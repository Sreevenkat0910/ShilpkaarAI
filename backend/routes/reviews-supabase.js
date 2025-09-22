const express = require('express');
const { ReviewOperations } = require('../models/supabase');
const { auth } = require('../middleware/auth');
const { validateRequest, asyncHandler, sendSuccess, sendError } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/reviews/product/:productId
// @desc    Get all reviews for a product
// @access  Public
router.get('/product/:productId', asyncHandler(async (req, res) => {
  const { productId } = req.params;
  
  const reviews = await ReviewOperations.getReviewsByProduct(productId);
  
  sendSuccess(res, { reviews }, 'Product reviews retrieved successfully');
}));

// @route   POST /api/reviews/
// @desc    Create a new review
// @access  Private
router.post('/', auth, [
  body('product_id').isUUID().withMessage('Valid product ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim()
], validateRequest, asyncHandler(async (req, res) => {
  const { product_id, rating, comment } = req.body;
  
  // Check if user already reviewed this product
  try {
    const existingReview = await ReviewOperations.getReviewByUserAndProduct(req.user.userId, product_id);
    if (existingReview) {
      return sendError(res, 'You have already reviewed this product', 400);
    }
  } catch (error) {
    // Review doesn't exist, continue
  }

  const reviewData = {
    product_id,
    user_id: req.user.userId,
    user_name: req.user.name,
    rating,
    comment: comment || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const review = await ReviewOperations.createReview(reviewData);
  
  sendSuccess(res, { review }, 'Review created successfully', 201);
}));

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', auth, [
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim()
], validateRequest, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  
  const updateData = {
    rating,
    comment,
    updated_at: new Date().toISOString()
  };

  const review = await ReviewOperations.updateReview(id, updateData);
  
  sendSuccess(res, { review }, 'Review updated successfully');
}));

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', auth, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  await ReviewOperations.deleteReview(id);
  
  sendSuccess(res, null, 'Review deleted successfully');
}));

module.exports = router;
