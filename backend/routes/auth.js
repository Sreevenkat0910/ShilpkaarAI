const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('mobile').isLength({ min: 10, max: 10 }).withMessage('Mobile must be 10 digits'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['customer', 'artisan']).withMessage('Role must be customer or artisan')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, mobile, password, role, email, location, craft } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this mobile number' });
    }

    // Create new user
    const user = new User({
      name,
      mobile,
      password,
      role,
      email,
      location,
      craft
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      accessToken: token,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        email: user.email,
        location: user.location,
        craft: user.craft
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('mobile').isLength({ min: 10, max: 10 }).withMessage('Mobile must be 10 digits'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { mobile, password } = req.body;

    // Find user by mobile
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      accessToken: token,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        email: user.email,
        location: user.location,
        craft: user.craft,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', auth, (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
