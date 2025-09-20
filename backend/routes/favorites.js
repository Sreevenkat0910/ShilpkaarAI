const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Favorite = require('../models/Favorite');
const Product = require('../models/Product');

// Get user's favorites
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, sortBy = 'addedAt' } = req.query;
    const userId = req.user.id;
    
    const result = await Favorite.getUserFavorites(
      userId, 
      parseInt(page), 
      parseInt(limit), 
      sortBy
    );
    
    res.json({
      success: true,
      data: result.favorites,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch favorites'
    });
  }
});

// Add product to favorites
router.post('/:productId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check if already favorited
    const existingFavorite = await Favorite.findOne({ user: userId, product: productId });
    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Product already in favorites'
      });
    }
    
    // Create new favorite
    const favorite = new Favorite({
      user: userId,
      product: productId
    });
    
    await favorite.save();
    
    // Populate product details for response
    await favorite.populate({
      path: 'product',
      select: 'name description price originalPrice images category artisan artisanName stock rating reviewCount tags materials createdAt'
    });
    
    res.status(201).json({
      success: true,
      message: 'Product added to favorites',
      data: favorite
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add product to favorites'
    });
  }
});

// Remove product from favorites
router.delete('/:productId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;
    
    const favorite = await Favorite.findOneAndDelete({ 
      user: userId, 
      product: productId 
    });
    
    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in favorites'
      });
    }
    
    res.json({
      success: true,
      message: 'Product removed from favorites'
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove product from favorites'
    });
  }
});

// Check if product is favorited
router.get('/check/:productId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;
    
    const isFavorited = await Favorite.isFavorited(userId, productId);
    
    res.json({
      success: true,
      data: { isFavorited }
    });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check favorite status'
    });
  }
});

// Get favorite count for a product
router.get('/count/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    
    const count = await Favorite.getProductFavoriteCount(productId);
    
    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Error getting favorite count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get favorite count'
    });
  }
});

// Get user's favorite count
router.get('/user/count', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const count = await Favorite.getUserFavoriteCount(userId);
    
    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Error getting user favorite count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user favorite count'
    });
  }
});

// Toggle favorite status (add if not exists, remove if exists)
router.post('/toggle/:productId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check if already favorited
    const existingFavorite = await Favorite.findOne({ user: userId, product: productId });
    
    if (existingFavorite) {
      // Remove from favorites
      await Favorite.findByIdAndDelete(existingFavorite._id);
      
      res.json({
        success: true,
        message: 'Product removed from favorites',
        data: { isFavorited: false }
      });
    } else {
      // Add to favorites
      const favorite = new Favorite({
        user: userId,
        product: productId
      });
      
      await favorite.save();
      
      res.json({
        success: true,
        message: 'Product added to favorites',
        data: { isFavorited: true }
      });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle favorite status'
    });
  }
});

module.exports = router;
