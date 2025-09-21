const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/artisans/search
// @desc    Advanced artisan search with filters
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const {
      q = '', // search query
      craft = '',
      location = '',
      region = '',
      state = '',
      city = '',
      minExperience = '',
      maxExperience = '',
      minRating = '',
      minProducts = '',
      techniques = '',
      specializations = '',
      certifications = '',
      workshopOffered = '',
      sortBy = 'relevance',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    // Build search query
    let searchQuery = { role: 'artisan', isVerified: true };

    // Text search
    if (q) {
      searchQuery.$text = { $search: q };
    }

    // Craft filters
    if (craft) {
      searchQuery.$or = [
        { craft: new RegExp(craft, 'i') },
        { crafts: { $in: [new RegExp(craft, 'i')] } }
      ];
    }

    // Location filters
    if (location) {
      searchQuery.location = new RegExp(location, 'i');
    }

    if (region) {
      searchQuery.region = new RegExp(region, 'i');
    }

    if (state) {
      searchQuery.state = new RegExp(state, 'i');
    }

    if (city) {
      searchQuery.city = new RegExp(city, 'i');
    }

    // Experience range
    if (minExperience || maxExperience) {
      searchQuery.experience = {};
      if (minExperience) searchQuery.experience.$gte = parseInt(minExperience);
      if (maxExperience) searchQuery.experience.$lte = parseInt(maxExperience);
    }

    // Rating filter
    if (minRating) {
      searchQuery.rating = { $gte: parseFloat(minRating) };
    }

    // Products count filter
    if (minProducts) {
      searchQuery.productsCount = { $gte: parseInt(minProducts) };
    }

    // Array filters
    if (techniques) {
      const techniqueArray = techniques.split(',').map(t => t.trim());
      searchQuery.techniques = { $in: techniqueArray.map(t => new RegExp(t, 'i')) };
    }

    if (specializations) {
      const specializationArray = specializations.split(',').map(s => s.trim());
      searchQuery.specializations = { $in: specializationArray.map(s => new RegExp(s, 'i')) };
    }

    if (certifications) {
      const certificationArray = certifications.split(',').map(c => c.trim());
      searchQuery.certifications = { $in: certificationArray.map(c => new RegExp(c, 'i')) };
    }

    // Boolean filters
    if (workshopOffered === 'true') searchQuery.workshopOffered = true;

    // Build sort object
    let sortObj = {};
    switch (sortBy) {
      case 'rating':
        sortObj.rating = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'experience':
        sortObj.experience = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'products':
        sortObj.productsCount = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'joined':
        sortObj.createdAt = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'name':
        sortObj.name = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'relevance':
      default:
        if (q) {
          sortObj.score = { $meta: 'textScore' };
        } else {
          sortObj.rating = -1;
        }
        break;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute search
    const artisans = await User.find(searchQuery)
      .select('-password -googleId')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(searchQuery);

    // Get filter options for the current search
    const filterOptions = await getArtisanFilterOptions(searchQuery);

    // Get summary statistics
    const stats = await getArtisanStats(searchQuery);

    res.json({
      artisans: artisans,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total: total,
        limit: parseInt(limit)
      },
      filters: filterOptions,
      stats: stats,
      searchQuery: {
        q,
        craft,
        location,
        region,
        state,
        city,
        minExperience,
        maxExperience,
        minRating,
        minProducts,
        techniques,
        specializations,
        certifications,
        workshopOffered,
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    console.error('Artisan search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/artisans/all
// @desc    Get all artisans with basic info
// @access  Public
router.get('/all', async (req, res) => {
  try {
    const { count = 20, page = 1 } = req.query;
    const limit = parseInt(count);
    const skip = (parseInt(page) - 1) * limit;

    const artisans = await User.find({ role: 'artisan', isVerified: true })
      .select('-password -googleId')
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await User.countDocuments({ role: 'artisan', isVerified: true });

    res.json({
      artisans: artisans,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total: total
      }
    });
  } catch (error) {
    console.error('Get artisans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/artisans/:id
// @desc    Get single artisan by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid artisan ID format' });
    }

    const artisan = await User.findById(id)
      .select('-password -googleId');

    if (!artisan || artisan.role !== 'artisan') {
      return res.status(404).json({ message: 'Artisan not found' });
    }

    // Get artisan's products
    const products = await Product.find({ artisan: id, isActive: true })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ 
      artisan: artisan,
      recentProducts: products
    });
  } catch (error) {
    console.error('Get artisan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/artisans/crafts/all
// @desc    Get all crafts
// @access  Public
router.get('/crafts/all', async (req, res) => {
  try {
    const crafts = await User.distinct('craft', { role: 'artisan', isVerified: true });
    res.json(crafts.filter(c => c));
  } catch (error) {
    console.error('Get crafts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/artisans/locations/all
// @desc    Get all locations
// @access  Public
router.get('/locations/all', async (req, res) => {
  try {
    const [locations, regions, states, cities] = await Promise.all([
      User.distinct('location', { role: 'artisan', isVerified: true }),
      User.distinct('region', { role: 'artisan', isVerified: true }),
      User.distinct('state', { role: 'artisan', isVerified: true }),
      User.distinct('city', { role: 'artisan', isVerified: true })
    ]);

    res.json({
      locations: locations.filter(l => l),
      regions: regions.filter(r => r),
      states: states.filter(s => s),
      cities: cities.filter(c => c)
    });
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to get filter options
async function getArtisanFilterOptions(baseQuery) {
  try {
    const [
      crafts,
      locations,
      regions,
      states,
      cities,
      techniques,
      specializations,
      certifications,
      experienceRange,
      ratingRange,
      productsRange
    ] = await Promise.all([
      User.distinct('craft', baseQuery),
      User.distinct('location', baseQuery),
      User.distinct('region', baseQuery),
      User.distinct('state', baseQuery),
      User.distinct('city', baseQuery),
      User.distinct('techniques', baseQuery),
      User.distinct('specializations', baseQuery),
      User.distinct('certifications', baseQuery),
      User.aggregate([
        { $match: baseQuery },
        {
          $group: {
            _id: null,
            minExperience: { $min: '$experience' },
            maxExperience: { $max: '$experience' }
          }
        }
      ]),
      User.aggregate([
        { $match: baseQuery },
        {
          $group: {
            _id: null,
            minRating: { $min: '$rating' },
            maxRating: { $max: '$rating' }
          }
        }
      ]),
      User.aggregate([
        { $match: baseQuery },
        {
          $group: {
            _id: null,
            minProducts: { $min: '$productsCount' },
            maxProducts: { $max: '$productsCount' }
          }
        }
      ])
    ]);

    return {
      crafts: crafts.filter(c => c),
      locations: locations.filter(l => l),
      regions: regions.filter(r => r),
      states: states.filter(s => s),
      cities: cities.filter(c => c),
      techniques: [...new Set(techniques.flat())].filter(t => t),
      specializations: [...new Set(specializations.flat())].filter(s => s),
      certifications: [...new Set(certifications.flat())].filter(c => c),
      experienceRange: experienceRange[0] || { minExperience: 0, maxExperience: 0 },
      ratingRange: ratingRange[0] || { minRating: 0, maxRating: 5 },
      productsRange: productsRange[0] || { minProducts: 0, maxProducts: 0 }
    };
  } catch (error) {
    console.error('Error getting artisan filter options:', error);
    return {};
  }
}

// Helper function to get artisan statistics
async function getArtisanStats(baseQuery) {
  try {
    const [
      totalArtisans,
      verifiedArtisans,
      onlineArtisans,
      avgRating
    ] = await Promise.all([
      User.countDocuments(baseQuery),
      User.countDocuments({ ...baseQuery, isVerified: true }),
      User.countDocuments({ ...baseQuery, isVerified: true }), // For now, same as verified
      User.aggregate([
        { $match: baseQuery },
        {
          $group: {
            _id: null,
            avgRating: { $avg: '$rating' }
          }
        }
      ])
    ]);

    return {
      totalArtisans,
      verifiedArtisans,
      onlineArtisans,
      avgRating: avgRating[0]?.avgRating || 0
    };
  } catch (error) {
    console.error('Error getting artisan stats:', error);
    return {
      totalArtisans: 0,
      verifiedArtisans: 0,
      onlineArtisans: 0,
      avgRating: 0
    };
  }
}

module.exports = router;
