const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/profile
// @desc    Get user profile
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put('/', auth, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('location').optional().trim(),
  body('craft').optional().trim(),
  body('experience').optional().isInt({ min: 0 }).withMessage('Experience must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const allowedUpdates = ['name', 'email', 'location', 'craft', 'experience', 'avatar'];
    const updates = {};

    // Only include allowed fields
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key) && req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/profile/verify
// @desc    Verify artisan (Admin only - for demo purposes)
// @access  Private
router.put('/verify', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'artisan') {
      return res.status(400).json({ message: 'Only artisans can be verified' });
    }

    user.isVerified = true;
    await user.save();

    res.json({
      message: 'Artisan verified successfully',
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Verify artisan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/profile
// @desc    Delete user account
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
