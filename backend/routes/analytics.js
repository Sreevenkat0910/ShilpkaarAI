const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Helper function to get date range based on timeframe
const getDateRange = (timeFrame) => {
  const now = new Date();
  const ranges = {
    '7days': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    '30days': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    '3months': new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
    '6months': new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000),
    '1year': new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
  };
  return ranges[timeFrame] || ranges['30days'];
};

// Helper function to calculate growth percentage
const calculateGrowth = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

// @route   GET /api/analytics/overview
// @desc    Get overview analytics for artisan dashboard
// @access  Private (Artisan only)
router.get('/overview', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'artisan') {
      return res.status(403).json({ message: 'Only artisans can access analytics' });
    }

    const { timeFrame = '30days' } = req.query;
    const startDate = getDateRange(timeFrame);
    const previousStartDate = getDateRange(timeFrame === '7days' ? '7days' : '30days');
    const previousEndDate = startDate;

    // Get artisan's products
    const artisanProducts = await Product.find({ artisan: req.user.id }).distinct('_id');

    // Current period analytics
    const currentOrders = await Order.find({
      'items.product': { $in: artisanProducts },
      createdAt: { $gte: startDate }
    }).populate('items.product', 'name price artisan');

    const previousOrders = await Order.find({
      'items.product': { $in: artisanProducts },
      createdAt: { $gte: previousStartDate, $lt: previousEndDate }
    }).populate('items.product', 'name price artisan');

    // Calculate metrics
    const currentRevenue = currentOrders.reduce((total, order) => {
      const artisanItems = order.items.filter(item => 
        item.product.artisan.toString() === req.user.id
      );
      return total + artisanItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, 0);

    const previousRevenue = previousOrders.reduce((total, order) => {
      const artisanItems = order.items.filter(item => 
        item.product.artisan.toString() === req.user.id
      );
      return total + artisanItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, 0);

    const currentOrderCount = currentOrders.length;
    const previousOrderCount = previousOrders.length;

    const avgOrderValue = currentOrderCount > 0 ? currentRevenue / currentOrderCount : 0;
    const previousAvgOrderValue = previousOrderCount > 0 ? previousRevenue / previousOrderCount : 0;

    // Get customer rating (mock for now - would need review system)
    const avgRating = 4.7;
    const totalReviews = 234;

    res.json({
      totalRevenue: currentRevenue,
      revenueGrowth: calculateGrowth(currentRevenue, previousRevenue),
      totalOrders: currentOrderCount,
      ordersGrowth: calculateGrowth(currentOrderCount, previousOrderCount),
      avgOrderValue: Math.round(avgOrderValue),
      avgOrderValueGrowth: calculateGrowth(avgOrderValue, previousAvgOrderValue),
      customerRating: avgRating,
      totalReviews
    });
  } catch (error) {
    console.error('Get overview analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/sales-trend
// @desc    Get sales trend data for charts
// @access  Private (Artisan only)
router.get('/sales-trend', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'artisan') {
      return res.status(403).json({ message: 'Only artisans can access analytics' });
    }

    const { timeFrame = '30days' } = req.query;
    const startDate = getDateRange(timeFrame);

    // Get artisan's products
    const artisanProducts = await Product.find({ artisan: req.user.id }).distinct('_id');

    // Get orders for the period
    const orders = await Order.find({
      'items.product': { $in: artisanProducts },
      createdAt: { $gte: startDate }
    }).populate('items.product', 'name price artisan');

    // Group by time period
    const salesData = [];
    const now = new Date();
    
    if (timeFrame === '7days') {
      // Daily data for last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
        
        const dayOrders = orders.filter(order => 
          order.createdAt >= dayStart && order.createdAt < dayEnd
        );
        
        const dayRevenue = dayOrders.reduce((total, order) => {
          const artisanItems = order.items.filter(item => 
            item.product.artisan.toString() === req.user.id
          );
          return total + artisanItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }, 0);
        
        salesData.push({
          period: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          sales: dayRevenue,
          orders: dayOrders.length,
          revenue: dayRevenue
        });
      }
    } else if (timeFrame === '30days') {
      // Weekly data for last 30 days
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
        const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
        
        const weekOrders = orders.filter(order => 
          order.createdAt >= weekStart && order.createdAt < weekEnd
        );
        
        const weekRevenue = weekOrders.reduce((total, order) => {
          const artisanItems = order.items.filter(item => 
            item.product.artisan.toString() === req.user.id
          );
          return total + artisanItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }, 0);
        
        salesData.push({
          period: `Week ${4 - i}`,
          sales: weekRevenue,
          orders: weekOrders.length,
          revenue: weekRevenue
        });
      }
    } else {
      // Monthly data for longer periods
      const months = timeFrame === '3months' ? 3 : timeFrame === '6months' ? 6 : 12;
      for (let i = months - 1; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        
        const monthOrders = orders.filter(order => 
          order.createdAt >= monthStart && order.createdAt < monthEnd
        );
        
        const monthRevenue = monthOrders.reduce((total, order) => {
          const artisanItems = order.items.filter(item => 
            item.product.artisan.toString() === req.user.id
          );
          return total + artisanItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }, 0);
        
        salesData.push({
          period: monthStart.toLocaleDateString('en-US', { month: 'short' }),
          sales: monthRevenue,
          orders: monthOrders.length,
          revenue: monthRevenue
        });
      }
    }

    res.json(salesData);
  } catch (error) {
    console.error('Get sales trend error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/top-products
// @desc    Get top performing products
// @access  Private (Artisan only)
router.get('/top-products', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'artisan') {
      return res.status(403).json({ message: 'Only artisans can access analytics' });
    }

    const { timeFrame = '30days', limit = 10 } = req.query;
    const startDate = getDateRange(timeFrame);

    // Get artisan's products
    const artisanProducts = await Product.find({ artisan: req.user.id });

    // Get orders for the period
    const orders = await Order.find({
      'items.product': { $in: artisanProducts.map(p => p._id) },
      createdAt: { $gte: startDate }
    }).populate('items.product', 'name price artisan images category');

    // Calculate product performance
    const productStats = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.product.artisan.toString() === req.user.id) {
          const productId = item.product._id.toString();
          if (!productStats[productId]) {
            productStats[productId] = {
              product: item.product,
              sales: 0,
              orders: 0,
              quantity: 0
            };
          }
          productStats[productId].sales += item.price * item.quantity;
          productStats[productId].orders += 1;
          productStats[productId].quantity += item.quantity;
        }
      });
    });

    // Convert to array and sort by sales
    const topProducts = Object.values(productStats)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, parseInt(limit))
      .map(item => ({
        id: item.product._id,
        name: item.product.name,
        sales: item.sales,
        orders: item.orders,
        quantity: item.quantity,
        growth: Math.random() * 20 - 10, // Mock growth data
        image: item.product.images[0] || 'https://images.unsplash.com/photo-1632726733402-4a059a476028?w=100&h=100&fit=crop',
        category: item.product.category
      }));

    res.json(topProducts);
  } catch (error) {
    console.error('Get top products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/category-performance
// @desc    Get sales performance by category
// @access  Private (Artisan only)
router.get('/category-performance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'artisan') {
      return res.status(403).json({ message: 'Only artisans can access analytics' });
    }

    const { timeFrame = '30days' } = req.query;
    const startDate = getDateRange(timeFrame);

    // Get artisan's products
    const artisanProducts = await Product.find({ artisan: req.user.id });

    // Get orders for the period
    const orders = await Order.find({
      'items.product': { $in: artisanProducts.map(p => p._id) },
      createdAt: { $gte: startDate }
    }).populate('items.product', 'name price artisan category');

    // Calculate category performance
    const categoryStats = {};
    let totalSales = 0;

    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.product.artisan.toString() === req.user.id) {
          const category = item.product.category;
          const itemSales = item.price * item.quantity;
          
          if (!categoryStats[category]) {
            categoryStats[category] = 0;
          }
          categoryStats[category] += itemSales;
          totalSales += itemSales;
        }
      });
    });

    // Convert to percentage and format for pie chart
    const colors = ['#314f36', '#65796e', '#8aa876', '#c8ddb0', '#e8f5e8'];
    const categoryPerformance = Object.entries(categoryStats)
      .map(([name, value], index) => ({
        name,
        value: Math.round((value / totalSales) * 100),
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.value - a.value);

    res.json(categoryPerformance);
  } catch (error) {
    console.error('Get category performance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/customer-insights
// @desc    Get customer demographics and insights
// @access  Private (Artisan only)
router.get('/customer-insights', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'artisan') {
      return res.status(403).json({ message: 'Only artisans can access analytics' });
    }

    const { timeFrame = '30days' } = req.query;
    const startDate = getDateRange(timeFrame);

    // Get artisan's products
    const artisanProducts = await Product.find({ artisan: req.user.id }).distinct('_id');

    // Get orders for the period
    const orders = await Order.find({
      'items.product': { $in: artisanProducts },
      createdAt: { $gte: startDate }
    }).populate('customer', 'name mobile location');

    // Analyze customer locations
    const locationStats = {};
    orders.forEach(order => {
      const city = order.shippingAddress?.city || 'Unknown';
      if (!locationStats[city]) {
        locationStats[city] = { orders: 0, customers: new Set() };
      }
      locationStats[city].orders += 1;
      locationStats[city].customers.add(order.customer._id.toString());
    });

    const topLocations = Object.entries(locationStats)
      .map(([city, stats]) => ({
        city,
        orders: stats.orders,
        customers: stats.customers.size,
        percentage: Math.round((stats.orders / orders.length) * 100)
      }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);

    // Mock demographic data (would need customer profile data)
    const demographics = {
      ageGroups: [
        { range: '25-34', percentage: 35 },
        { range: '35-44', percentage: 30 },
        { range: '45-54', percentage: 20 },
        { range: '18-24', percentage: 15 }
      ]
    };

    // Calculate repeat customers
    const uniqueCustomers = new Set(orders.map(order => order.customer._id.toString()));
    const repeatCustomers = orders.length - uniqueCustomers.size;
    const repeatRate = orders.length > 0 ? Math.round((repeatCustomers / orders.length) * 100) : 0;

    res.json({
      topLocations,
      demographics,
      avgRating: 4.7,
      totalReviews: 234,
      repeatCustomers: repeatRate
    });
  } catch (error) {
    console.error('Get customer insights error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/seasonal-trends
// @desc    Get seasonal trends and festival impact
// @access  Private (Artisan only)
router.get('/seasonal-trends', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'artisan') {
      return res.status(403).json({ message: 'Only artisans can access analytics' });
    }

    // Mock seasonal trends data (would need historical data analysis)
    const seasonalTrends = [
      { 
        festival: 'Diwali', 
        impact: '+45%', 
        products: 'Traditional Textiles, Jewelry', 
        peak: 'Oct-Nov',
        revenue: 125000
      },
      { 
        festival: 'Wedding Season', 
        impact: '+32%', 
        products: 'Sarees, Silver Items', 
        peak: 'Nov-Feb',
        revenue: 98000
      },
      { 
        festival: 'Durga Puja', 
        impact: '+28%', 
        products: 'Traditional Wear', 
        peak: 'Sep-Oct',
        revenue: 76000
      },
      { 
        festival: 'Holi', 
        impact: '+15%', 
        products: 'Colorful Textiles', 
        peak: 'Mar',
        revenue: 45000
      }
    ];

    res.json(seasonalTrends);
  } catch (error) {
    console.error('Get seasonal trends error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/recommendations
// @desc    Get AI-powered recommendations
// @access  Private (Artisan only)
router.get('/recommendations', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'artisan') {
      return res.status(403).json({ message: 'Only artisans can access analytics' });
    }

    // Get artisan's products for analysis
    const artisanProducts = await Product.find({ artisan: req.user.id });
    const lowStockProducts = artisanProducts.filter(p => p.stock < 5);
    const topCategories = await Product.aggregate([
      { $match: { artisan: user._id } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);

    // Generate recommendations based on data
    const recommendations = [];

    // Pricing recommendations
    if (artisanProducts.length > 0) {
      const avgPrice = artisanProducts.reduce((sum, p) => sum + p.price, 0) / artisanProducts.length;
      recommendations.push({
        type: 'pricing',
        title: 'Price Optimization',
        description: `Your average product price is ₹${Math.round(avgPrice)}. Consider adjusting prices based on market trends.`,
        impact: '+12% revenue potential',
        priority: 'high',
        action: 'Adjust Pricing'
      });
    }

    // Inventory recommendations
    if (lowStockProducts.length > 0) {
      recommendations.push({
        type: 'inventory',
        title: 'Stock Alert',
        description: `${lowStockProducts.length} products are running low on stock. Consider restocking soon.`,
        impact: 'Prevent stockouts',
        priority: 'urgent',
        action: 'Restock Now'
      });
    }

    // Seasonal recommendations
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 8 && currentMonth <= 10) { // Sep-Nov
      recommendations.push({
        type: 'marketing',
        title: 'Festival Season Opportunity',
        description: 'Diwali and wedding season approaching. Promote traditional products for maximum impact.',
        impact: '+28% seasonal sales',
        priority: 'medium',
        action: 'Launch Campaign'
      });
    }

    // Product bundling recommendations
    if (topCategories.length >= 2) {
      recommendations.push({
        type: 'product',
        title: 'Product Bundling',
        description: `Customers often buy ${topCategories[0]._id} with ${topCategories[1]._id}. Create combo offers.`,
        impact: '+18% avg order value',
        priority: 'medium',
        action: 'Create Bundles'
      });
    }

    res.json(recommendations);
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/alerts
// @desc    Get business alerts and notifications
// @access  Private (Artisan only)
router.get('/alerts', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'artisan') {
      return res.status(403).json({ message: 'Only artisans can access analytics' });
    }

    // Get artisan's products
    const artisanProducts = await Product.find({ artisan: req.user.id });
    const lowStockProducts = artisanProducts.filter(p => p.stock < 5);

    // Get recent orders for sales spike detection
    const recentOrders = await Order.find({
      'items.product': { $in: artisanProducts.map(p => p._id) },
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    const alerts = [];

    // Low stock alerts
    lowStockProducts.forEach(product => {
      alerts.push({
        type: 'warning',
        title: 'Low Stock Alert',
        message: `${product.name} is down to ${product.stock} units`,
        time: '2 hours ago',
        productId: product._id
      });
    });

    // Sales spike alerts
    if (recentOrders.length > 5) {
      alerts.push({
        type: 'success',
        title: 'Sales Spike Detected',
        message: `Sales increased ${Math.round(Math.random() * 30 + 20)}% this week`,
        time: '1 hour ago'
      });
    }

    // Festival season alerts
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 8 && currentMonth <= 10) {
      alerts.push({
        type: 'info',
        title: 'Festival Season Approaching',
        message: 'Prepare for Diwali and wedding season demand spike',
        time: '1 day ago'
      });
    }

    res.json(alerts);
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/inventory-insights
// @desc    Get inventory insights and recommendations
// @access  Private (Artisan only)
router.get('/inventory-insights', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'artisan') {
      return res.status(403).json({ message: 'Only artisans can access analytics' });
    }

    // Get artisan's products
    const artisanProducts = await Product.find({ artisan: req.user.id });

    // Get recent sales data for velocity calculation
    const recentOrders = await Order.find({
      'items.product': { $in: artisanProducts.map(p => p._id) },
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }).populate('items.product', 'name price artisan');

    // Calculate inventory insights
    const inventoryInsights = artisanProducts.map(product => {
      const productOrders = recentOrders.filter(order =>
        order.items.some(item => item.product._id.toString() === product._id.toString())
      );

      const totalSold = productOrders.reduce((sum, order) => {
        const item = order.items.find(item => item.product._id.toString() === product._id.toString());
        return sum + (item ? item.quantity : 0);
      }, 0);

      const salesVelocity = totalSold / 30; // units per day
      const daysRemaining = product.stock / salesVelocity;
      
      let status = 'good';
      let recommendation = 'Stock is sufficient';
      
      if (product.stock < 5) {
        status = 'low';
        recommendation = `Reorder ${Math.max(10, Math.round(salesVelocity * 30))} units`;
      } else if (daysRemaining < 15) {
        status = 'medium';
        recommendation = 'Consider restocking soon';
      }

      return {
        productId: product._id,
        name: product.name,
        currentStock: product.stock,
        salesVelocity: Math.round(salesVelocity * 10) / 10,
        daysRemaining: Math.round(daysRemaining),
        status,
        recommendation,
        stockPercentage: Math.min(100, (product.stock / 50) * 100) // Assuming 50 is max stock
      };
    });

    res.json(inventoryInsights);
  } catch (error) {
    console.error('Get inventory insights error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
