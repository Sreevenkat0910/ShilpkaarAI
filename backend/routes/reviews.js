const express = require('express');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Product = require('../models/Product');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reviews/product/:productId
// @desc    Get all reviews for a product
// @access  Public
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = 'newest' } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let sortOption = { createdAt: -1 }; // newest first
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'highest') {
      sortOption = { rating: -1 };
    } else if (sort === 'lowest') {
      sortOption = { rating: 1 };
    } else if (sort === 'helpful') {
      sortOption = { helpful: -1 };
    }

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name avatar')
      .sort(sortOption)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Review.countDocuments({ product: productId });

    // Get rating distribution
    const distribution = await Review.getRatingDistribution(productId);

    res.json({
      reviews,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      },
      distribution
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reviews/product/:productId/summary
// @desc    Get review summary for a product
// @access  Public
router.get('/product/:productId/summary', async (req, res) => {
  try {
    const { productId } = req.params;
    
    const summary = await Review.calculateAverageRating(productId);
    const distribution = await Review.getRatingDistribution(productId);

    res.json({
      averageRating: summary.averageRating,
      totalReviews: summary.totalReviews,
      distribution
    });
  } catch (error) {
    console.error('Get review summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', auth, [
  body('productId').isMongoId().withMessage('Valid product ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().isLength({ min: 10, max: 1000 }).withMessage('Comment must be between 10 and 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { productId, rating, comment, images } = req.body;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ 
      product: productId, 
      user: req.user.id 
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Get user info
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create review
    const review = new Review({
      product: productId,
      user: req.user.id,
      userName: user.name,
      rating,
      comment,
      images: images || [],
      isVerified: false // Will be set to true when order is confirmed
    });

    await review.save();

    // Update product rating and review count
    const summary = await Review.calculateAverageRating(productId);
    await Product.findByIdAndUpdate(productId, {
      rating: summary.averageRating,
      reviewCount: summary.totalReviews
    });

    // Populate user info for response
    await review.populate('user', 'name avatar');

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', auth, [
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Comment must be between 10 and 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own reviews' });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name avatar');

    // Update product rating
    const summary = await Review.calculateAverageRating(review.product);
    await Product.findByIdAndUpdate(review.product, {
      rating: summary.averageRating,
      reviewCount: summary.totalReviews
    });

    res.json({
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);

    // Update product rating and review count
    const summary = await Review.calculateAverageRating(productId);
    await Product.findByIdAndUpdate(productId, {
      rating: summary.averageRating,
      reviewCount: summary.totalReviews
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/reviews/:id/helpful
// @desc    Mark a review as helpful
// @access  Private
router.post('/:id/helpful', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user already marked this review as helpful
    if (review.helpfulUsers.includes(req.user.id)) {
      return res.status(400).json({ message: 'You have already marked this review as helpful' });
    }

    // Add user to helpful users and increment helpful count
    review.helpfulUsers.push(req.user.id);
    review.helpful += 1;
    await review.save();

    res.json({ 
      message: 'Review marked as helpful',
      helpful: review.helpful 
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/reviews/:id/helpful
// @desc    Remove helpful mark from a review
// @access  Private
router.delete('/:id/helpful', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user has marked this review as helpful
    if (!review.helpfulUsers.includes(req.user.id)) {
      return res.status(400).json({ message: 'You have not marked this review as helpful' });
    }

    // Remove user from helpful users and decrement helpful count
    review.helpfulUsers = review.helpfulUsers.filter(userId => userId.toString() !== req.user.id);
    review.helpful = Math.max(0, review.helpful - 1);
    await review.save();

    res.json({ 
      message: 'Helpful mark removed',
      helpful: review.helpful 
    });
  } catch (error) {
    console.error('Remove helpful error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reviews/user/:userId
// @desc    Get all reviews by a user
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ user: userId })
      .populate('product', 'name images')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Review.countDocuments({ user: userId });

    res.json({
      reviews,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
