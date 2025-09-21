const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { UserOperations } = require('../supabase-client');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
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
    try {
      const existingUser = await UserOperations.getUserByMobile(mobile);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this mobile number' });
      }
    } catch (error) {
      // User doesn't exist, continue with registration
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const userData = {
      name,
      mobile,
      password: hashedPassword,
      role,
      email: email || null,
      location: location || '',
      craft: craft || ''
    };

    const user = await UserOperations.createUser(userData);

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
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
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
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
    const user = await UserOperations.getUserByMobile(mobile);
    if (!user) {
      return res.status(400).json({ message: 'Invalid mobile number or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid mobile number or password' });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        email: user.email,
        location: user.location,
        craft: user.craft,
        isVerified: user.is_verified
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
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = await UserOperations.getUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        email: user.email,
        location: user.location,
        craft: user.craft,
        isVerified: user.is_verified
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
