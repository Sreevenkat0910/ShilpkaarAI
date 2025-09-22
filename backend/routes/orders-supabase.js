const express = require('express');
const { body, validationResult } = require('express-validator');
const { OrderOperations, ProductOperations } = require('../models/supabase');
const { auth, requireRole } = require('../middleware/auth');
const { validateRequest, asyncHandler, sendSuccess, sendError } = require('../middleware/validation');

const router = express.Router();

// @route   POST /api/orders/
// @desc    Create a new order
// @access  Private (Customer only)
router.post('/', auth, requireRole('customer'), [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.product_id').isUUID().withMessage('Valid product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shipping_address').isObject().withMessage('Shipping address is required'),
  body('payment_method').isIn(['cod', 'online', 'upi']).withMessage('Valid payment method is required')
], validateRequest, asyncHandler(async (req, res) => {
  const { items, shipping_address, payment_method, notes } = req.body;

  // Calculate total amount
  let totalAmount = 0;
  for (const item of items) {
    const product = await ProductOperations.getProductById(item.product_id);
    if (!product) {
      return sendError(res, `Product ${item.product_id} not found`, 404);
    }
    totalAmount += product.price * item.quantity;
  }

  const orderData = {
    customer_id: req.user.userId,
    items: items,
    total_amount: totalAmount,
    status: 'pending',
    shipping_address: shipping_address,
    payment_status: 'pending',
    payment_method: payment_method,
    notes: notes || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const order = await OrderOperations.createOrder(orderData);
  
  sendSuccess(res, { order }, 'Order created successfully', 201);
}));

// @route   GET /api/orders/customer
// @desc    Get customer's orders
// @access  Private (Customer only)
router.get('/customer', auth, requireRole('customer'), asyncHandler(async (req, res) => {
  const orders = await OrderOperations.getOrdersByCustomer(req.user.userId);
  
  sendSuccess(res, { orders }, 'Customer orders retrieved successfully');
}));

// @route   GET /api/orders/artisan
// @desc    Get artisan's orders
// @access  Private (Artisan only)
router.get('/artisan', auth, requireRole('artisan'), asyncHandler(async (req, res) => {
  const orders = await OrderOperations.getOrdersByArtisan(req.user.userId);
  
  sendSuccess(res, { orders }, 'Artisan orders retrieved successfully');
}));

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', auth, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const order = await OrderOperations.getOrderById(id);
  if (!order) {
    return sendError(res, 'Order not found', 404);
  }

  // Check if user has access to this order
  if (order.customer_id !== req.user.userId && req.user.role !== 'admin') {
    return sendError(res, 'Not authorized to view this order', 403);
  }
  
  sendSuccess(res, { order }, 'Order retrieved successfully');
}));

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Artisan/Admin only)
router.put('/:id/status', auth, requireRole('artisan'), [
  body('status').isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']).withMessage('Valid status is required')
], validateRequest, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const order = await OrderOperations.updateOrderStatus(id, status);
  
  sendSuccess(res, { order }, 'Order status updated successfully');
}));

module.exports = router;
