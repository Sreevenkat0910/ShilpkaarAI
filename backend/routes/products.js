const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/products/all
// @desc    Get all products
// @access  Public
router.get('/all', async (req, res) => {
  try {
    const { count = 20, page = 1 } = req.query;
    const limit = parseInt(count);
    const skip = (parseInt(page) - 1) * limit;

    const products = await Product.find({ isActive: true })
      .populate('artisan', 'name location craft')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Product.countDocuments({ isActive: true });

    res.json({
      productsData: products,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/one
// @desc    Get single product by ID
// @access  Public
router.get('/one', async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const product = await Product.findById(id)
      .populate('artisan', 'name location craft experience');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ productData: product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/category
// @desc    Get products by category
// @access  Public
router.get('/category', async (req, res) => {
  try {
    const { category } = req.query;
    
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const products = await Product.find({ 
      category: new RegExp(category, 'i'),
      isActive: true 
    }).populate('artisan', 'name location craft');

    res.json(products);
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/categories/all
// @desc    Get all categories
// @access  Public
router.get('/categories/all', async (req, res) => {
  try {
    const { count = 20 } = req.query;
    
    const categories = await Product.distinct('category', { isActive: true });
    
    res.json(categories.slice(0, parseInt(count)));
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/products
// @desc    Create new product (Artisan only)
// @access  Private
router.post('/', auth, [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').isNumeric().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'artisan') {
      return res.status(403).json({ message: 'Only artisans can create products' });
    }

    const productData = {
      ...req.body,
      artisan: req.user.id,
      artisanName: user.name
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product (Artisan only)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'artisan') {
      return res.status(403).json({ message: 'Only artisans can update products' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.artisan.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own products' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (Artisan only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'artisan') {
      return res.status(403).json({ message: 'Only artisans can delete products' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.artisan.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own products' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
