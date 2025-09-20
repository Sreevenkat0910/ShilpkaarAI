const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', auth, [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('shippingAddress').isObject().withMessage('Shipping address is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { items, shippingAddress, paymentMethod = 'cod' } = req.body;
    
    // Calculate total amount and validate products
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for product ${product.name}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Create order
    const order = new Order({
      customer: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod
    });

    await order.save();

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/myorders
// @desc    Get customer's orders
// @access  Private
router.get('/myorders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get customer orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/artisan/allorders
// @desc    Get artisan's orders
// @access  Private
router.get('/artisan/allorders', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'artisan') {
      return res.status(403).json({ message: 'Only artisans can access this route' });
    }

    // Find orders that contain products from this artisan
    const orders = await Order.find({
      'items.product': { $in: await Product.find({ artisan: req.user.id }).distinct('_id') }
    })
    .populate('customer', 'name mobile')
    .populate('items.product', 'name images price artisan')
    .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get artisan orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name mobile email')
      .populate('items.product', 'name images price artisan artisanName');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user has access to this order
    const user = await User.findById(req.user.id);
    const isCustomer = order.customer._id.toString() === req.user.id;
    const isArtisan = user.role === 'artisan' && 
      order.items.some(item => item.product.artisan.toString() === req.user.id);

    if (!isCustomer && !isArtisan) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private
router.put('/:id/status', auth, [
  body('status').isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, trackingNumber } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user has permission to update status
    const user = await User.findById(req.user.id);
    const isCustomer = order.customer.toString() === req.user.id;
    const isArtisan = user.role === 'artisan' && 
      order.items.some(item => item.product.artisan.toString() === req.user.id);

    if (!isCustomer && !isArtisan) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update order
    const updateData = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
