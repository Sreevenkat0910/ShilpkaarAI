const express = require('express');
const { OrderOperations, ProductOperations, UserOperations } = require('../models/supabase');
const { auth, requireRole } = require('../middleware/auth');
const { validateRequest, asyncHandler, sendSuccess, sendError } = require('../middleware/validation');

const router = express.Router();

// Helper function to get date range
const getDateRange = (timeFrame) => {
  const now = new Date();
  let startDate;
  
  switch (timeFrame) {
    case '7days':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30days':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90days':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '1year':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
  
  return { startDate, endDate: now };
};

// @route   GET /api/analytics/overview
// @desc    Get analytics overview for artisan
// @access  Private (Artisan only)
router.get('/overview', auth, requireRole('artisan'), asyncHandler(async (req, res) => {
  const { timeFrame = '30days' } = req.query;
  const { startDate, endDate } = getDateRange(timeFrame);
  
  // Get artisan's orders
  const orders = await OrderOperations.getOrdersByArtisan(req.user.userId);
  
  // Filter orders by date range
  const filteredOrders = orders.filter(order => 
    new Date(order.created_at) >= startDate && new Date(order.created_at) <= endDate
  );
  
  // Calculate metrics
  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total_amount, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Get products count
  const products = await ProductOperations.searchProducts({ artisan_id: req.user.userId });
  const totalProducts = products.length;
  
  sendSuccess(res, {
    overview: {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      totalProducts,
      timeFrame
    }
  }, 'Analytics overview retrieved successfully');
}));

// @route   GET /api/analytics/sales-trend
// @desc    Get sales trend data
// @access  Private (Artisan only)
router.get('/sales-trend', auth, requireRole('artisan'), asyncHandler(async (req, res) => {
  const { timeFrame = '30days' } = req.query;
  const { startDate, endDate } = getDateRange(timeFrame);
  
  const orders = await OrderOperations.getOrdersByArtisan(req.user.userId);
  const filteredOrders = orders.filter(order => 
    new Date(order.created_at) >= startDate && new Date(order.created_at) <= endDate
  );
  
  // Group by date
  const salesByDate = {};
  filteredOrders.forEach(order => {
    const date = new Date(order.created_at).toISOString().split('T')[0];
    if (!salesByDate[date]) {
      salesByDate[date] = { orders: 0, revenue: 0 };
    }
    salesByDate[date].orders += 1;
    salesByDate[date].revenue += order.total_amount;
  });
  
  sendSuccess(res, { salesTrend: salesByDate }, 'Sales trend retrieved successfully');
}));

// @route   GET /api/analytics/top-products
// @desc    Get top performing products
// @access  Private (Artisan only)
router.get('/top-products', auth, requireRole('artisan'), asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  
  const products = await ProductOperations.searchProducts({ artisan_id: req.user.userId });
  
  // Sort by rating and review count
  const topProducts = products
    .sort((a, b) => (b.rating * b.review_count) - (a.rating * a.review_count))
    .slice(0, parseInt(limit));
  
  sendSuccess(res, { topProducts }, 'Top products retrieved successfully');
}));

// @route   GET /api/analytics/category-performance
// @desc    Get category performance
// @access  Private (Artisan only)
router.get('/category-performance', auth, requireRole('artisan'), asyncHandler(async (req, res) => {
  const products = await ProductOperations.searchProducts({ artisan_id: req.user.userId });
  
  // Group by category
  const categoryStats = {};
  products.forEach(product => {
    if (!categoryStats[product.category]) {
      categoryStats[product.category] = {
        count: 0,
        totalRevenue: 0,
        averageRating: 0,
        totalReviews: 0
      };
    }
    categoryStats[product.category].count += 1;
    categoryStats[product.category].totalRevenue += product.price;
    categoryStats[product.category].averageRating += product.rating;
    categoryStats[product.category].totalReviews += product.review_count;
  });
  
  // Calculate averages
  Object.keys(categoryStats).forEach(category => {
    const stats = categoryStats[category];
    stats.averageRating = stats.count > 0 ? stats.averageRating / stats.count : 0;
  });
  
  sendSuccess(res, { categoryPerformance: categoryStats }, 'Category performance retrieved successfully');
}));

// @route   GET /api/analytics/customer-insights
// @desc    Get customer insights
// @access  Private (Artisan only)
router.get('/customer-insights', auth, requireRole('artisan'), asyncHandler(async (req, res) => {
  const orders = await OrderOperations.getOrdersByArtisan(req.user.userId);
  
  // Get unique customers
  const uniqueCustomers = new Set(orders.map(order => order.customer_id));
  
  // Calculate repeat customers
  const customerOrderCounts = {};
  orders.forEach(order => {
    if (!customerOrderCounts[order.customer_id]) {
      customerOrderCounts[order.customer_id] = 0;
    }
    customerOrderCounts[order.customer_id] += 1;
  });
  
  const repeatCustomers = Object.values(customerOrderCounts).filter(count => count > 1).length;
  
  sendSuccess(res, {
    customerInsights: {
      totalCustomers: uniqueCustomers.size,
      repeatCustomers,
      averageOrdersPerCustomer: orders.length / uniqueCustomers.size
    }
  }, 'Customer insights retrieved successfully');
}));

module.exports = router;
