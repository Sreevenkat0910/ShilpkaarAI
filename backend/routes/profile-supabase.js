const express = require('express');
const { body, validationResult } = require('express-validator');
const { UserOperations } = require('../models/supabase');
const { auth } = require('../middleware/auth');
const { validateRequest, asyncHandler, sendSuccess, sendError } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/profile
// @desc    Get user profile
// @access  Private
router.get('/', auth, asyncHandler(async (req, res) => {
  const user = await UserOperations.getUserById(req.user.userId);
  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  // Remove password from response
  delete user.password;
  
  sendSuccess(res, { user }, 'Profile retrieved successfully');
}));

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put('/', auth, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('location').optional().trim(),
  body('craft').optional().trim(),
  body('experience').optional().isInt({ min: 0 }).withMessage('Experience must be a non-negative integer'),
  body('bio').optional().trim(),
  body('techniques').optional().isArray(),
  body('specializations').optional().isArray(),
  body('certifications').optional().isArray(),
  body('languages').optional().isArray(),
  body('workshop_offered').optional().isBoolean()
], validateRequest, asyncHandler(async (req, res) => {
  const updateData = {
    ...req.body,
    updated_at: new Date().toISOString()
  };

  const user = await UserOperations.updateUser(req.user.userId, updateData);
  
  // Remove password from response
  delete user.password;
  
  sendSuccess(res, { user }, 'Profile updated successfully');
}));

module.exports = router;
