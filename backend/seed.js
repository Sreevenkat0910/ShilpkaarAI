const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');
const Review = require('./models/Review');
const Favorite = require('./models/Favorite');
const Order = require('./models/Order');

const sampleUsers = [
  {
    name: 'Priya Sharma',
    mobile: '9876543210',
    password: 'password123',
    role: 'artisan',
    email: 'priya@example.com',
    location: 'Varanasi, Uttar Pradesh',
    craft: 'Textile Weaving',
    experience: 15,
    isVerified: true
  },
  {
    name: 'Rajesh Kumar',
    mobile: '9876543211',
    password: 'password123',
    role: 'artisan',
    email: 'rajesh@example.com',
    location: 'Jaipur, Rajasthan',
    craft: 'Blue Pottery',
    experience: 12,
    isVerified: true
  },
  {
    name: 'Meera Patel',
    mobile: '9876543212',
    password: 'password123',
    role: 'artisan',
    email: 'meera@example.com',
    location: 'Surat, Gujarat',
    craft: 'Jewelry Making',
    experience: 8,
    isVerified: true
  },
  {
    name: 'Amit Singh',
    mobile: '9876543213',
    password: 'password123',
    role: 'customer',
    email: 'amit@example.com',
    location: 'Mumbai, Maharashtra'
  },
  {
    name: 'Sneha Reddy',
    mobile: '9876543214',
    password: 'password123',
    role: 'customer',
    email: 'sneha@example.com',
    location: 'Bangalore, Karnataka'
  }
];

const sampleProducts = [
  {
    name: 'Handwoven Banarasi Silk Saree',
    description: 'Exquisite handwoven Banarasi silk saree with intricate zari work. Made with pure silk threads and traditional weaving techniques passed down through generations.',
    price: 2500,
    originalPrice: 3200,
    images: [
      'https://images.unsplash.com/photo-1632726733402-4a059a476028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB0ZXh0aWxlcyUyMHdlYXZpbmclMjBhcnRpc2FufGVufDF8fHx8MTc1ODM2NjIwMnww&ixlib=rb-4.1.0&q=80&w=400',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzYXJlZXMlMjB0ZXh0aWxlc3xlbnwxfHx8fDE3NTgzNjYyMTB8MA&ixlib=rb-4.1.0&q=80&w=400'
    ],
    category: 'Textiles',
    stock: 3,
    tags: ['silk', 'handwoven', 'traditional', 'zari', 'trending'],
    materials: ['Pure Silk', 'Zari Thread', 'Gold Thread'],
    subcategory: 'Sarees',
    craft: 'Textile Weaving',
    color: ['Red', 'Gold'],
    size: 'One Size',
    condition: 'new',
    availability: 'in_stock',
    featured: true,
    trending: true,
    searchKeywords: ['banarasi saree', 'silk saree', 'traditional', 'handwoven', 'zari'],
    dimensions: { length: 550, width: 110, height: 0, unit: 'cm' },
    weight: 800,
    craftStory: 'This saree is handwoven by skilled artisans in Varanasi using traditional techniques passed down through generations.',
    careInstructions: 'Dry clean only. Store in a cool, dry place. Avoid direct sunlight.'
  },
  {
    name: 'Cotton Handloom Kurta Set',
    description: 'Comfortable cotton handloom kurta set with traditional block printing. Perfect for casual wear with authentic Indian craftsmanship.',
    price: 1200,
    originalPrice: 1500,
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjdXJ0YSUyMGhhbmRjcmFmdHxlbnwxfHx8fDE3NTgzNjYyMDh8MA&ixlib=rb-4.1.0&q=80&w=400'
    ],
    category: 'Textiles',
    stock: 8,
    tags: ['cotton', 'handloom', 'kurta', 'block print', 'ai-enhanced'],
    materials: ['Pure Cotton', 'Natural Dyes', 'Block Print'],
    subcategory: 'Kurtas',
    craft: 'Textile Weaving',
    color: ['Blue', 'White'],
    size: 'Medium',
    condition: 'new',
    availability: 'in_stock',
    featured: false,
    trending: false,
    searchKeywords: ['cotton kurta', 'handloom', 'block print', 'traditional', 'casual'],
    dimensions: { length: 80, width: 50, height: 0, unit: 'cm' },
    weight: 300,
    craftStory: 'Handwoven using traditional techniques with natural block printing methods.',
    careInstructions: 'Machine wash cold. Air dry. Iron on low heat.'
  },
  {
    name: 'Kashmiri Woolen Shawl',
    description: 'Luxurious handwoven woolen shawl from Kashmir. Soft, warm, and beautifully crafted with traditional patterns.',
    price: 3500,
    originalPrice: 4500,
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzaGF3bCUyMHdvb2x8ZW58MXx8fHwxNzU4MzY2MjE2fDA&ixlib=rb-4.1.0&q=80&w=400'
    ],
    category: 'Textiles',
    stock: 2,
    tags: ['wool', 'shawl', 'kashmir', 'handwoven'],
    materials: ['Pure Wool', 'Traditional Patterns', 'Natural Dyes']
  },
  {
    name: 'Blue Pottery Dinner Set',
    description: 'Beautiful blue pottery dinner set with traditional Jaipur blue glaze. Each piece is handcrafted and painted with intricate patterns.',
    price: 1800,
    images: [
      'https://images.unsplash.com/photo-1716876995651-1ff85b65a6d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBoYW5kaWNyYWZ0cyUyMHBvdHRlcnklMjBhcnRpc2FufGVufDF8fHx8MTc1ODM2NjIwMHww&ixlib=rb-4.1.0&q=80&w=400',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBwb3R0ZXJ5JTIwYmx1ZXxlbnwxfHx8fDE3NTgzNjYyMDd8MA&ixlib=rb-4.1.0&q=80&w=400'
    ],
    category: 'Pottery',
    stock: 3,
    tags: ['blue pottery', 'dinner set', 'traditional', 'handcrafted'],
    materials: ['Clay', 'Blue Glaze', 'Traditional Pigments']
  },
  {
    name: 'Silver Filigree Earrings',
    description: 'Delicate silver filigree earrings with intricate wirework. Handcrafted using traditional techniques with attention to detail.',
    price: 750,
    originalPrice: 950,
    images: [
      'https://images.unsplash.com/photo-1653227907864-560dce4c252d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBqZXdlbHJ5JTIwbWFraW5nJTIwY3JhZnRzfGVufDF8fHx8MTc1ODM2NjIwNXww&ixlib=rb-4.1.0&q=80&w=400',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBqZXdlbHJ5JTIwc2lsdmVyfGVufDF8fHx8MTc1ODM2NjIxMXww&ixlib=rb-4.1.0&q=80&w=400'
    ],
    category: 'Jewelry',
    stock: 8,
    tags: ['silver', 'filigree', 'earrings', 'handcrafted'],
    materials: ['Sterling Silver', 'Traditional Wire']
  },
  {
    name: 'Wooden Hand Carved Bowl Set',
    description: 'Set of three hand-carved wooden bowls made from sustainable teak wood. Each bowl features unique grain patterns and smooth finish.',
    price: 1200,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBib3dsJTIwaGFuZGNyYWZ0fGVufDF8fHx8MTc1ODM2NjIwN3ww&ixlib=rb-4.1.0&q=80&w=400',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjcmFmdHMlMjBib3dsc3xlbnwxfHx8fDE3NTgzNjYyMTB8MA&ixlib=rb-4.1.0&q=80&w=400'
    ],
    category: 'Woodwork',
    stock: 4,
    tags: ['wooden', 'hand carved', 'bowl set', 'sustainable'],
    materials: ['Teak Wood', 'Natural Finish']
  },
  {
    name: 'Handwoven Cotton Kurta',
    description: 'Comfortable handwoven cotton kurta with traditional block printing. Perfect for casual wear with authentic Indian craftsmanship.',
    price: 800,
    originalPrice: 1000,
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjdXJ0YSUyMGhhbmRjcmFmdHxlbnwxfHx8fDE3NTgzNjYyMDh8MA&ixlib=rb-4.1.0&q=80&w=400',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjdXJ0YSUyMGJsb2NrJTIwcHJpbnR8ZW58MXx8fHwxNzU4MzY2MjEyfDA&ixlib=rb-4.1.0&q=80&w=400'
    ],
    category: 'Clothing',
    stock: 6,
    tags: ['cotton', 'handwoven', 'kurta', 'block print'],
    materials: ['Pure Cotton', 'Natural Dyes', 'Block Print']
  },
  {
    name: 'Madhubani Painting',
    description: 'Traditional Madhubani painting depicting nature and mythology. Hand-painted on handmade paper using natural colors and traditional techniques.',
    price: 1500,
    originalPrice: 2000,
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBwYWludGluZ3MlMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NTgzNjYyMTB8MA&ixlib=rb-4.1.0&q=80&w=400',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWRodWJhbmklMjBwYWludGluZ3xlbnwxfHx8fDE3NTgzNjYyMTN8MA&ixlib=rb-4.1.0&q=80&w=400'
    ],
    category: 'Art',
    stock: 2,
    tags: ['madhubani', 'painting', 'traditional', 'handmade'],
    materials: ['Handmade Paper', 'Natural Colors', 'Traditional Brushes']
  },
  {
    name: 'Brass Decorative Lamp',
    description: 'Elegant brass decorative lamp with intricate engravings. Perfect for adding traditional Indian charm to any space.',
    price: 2200,
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBicmFzcyUyMGxhbXB8ZW58MXx8fHwxNzU4MzY2MjE0fDA&ixlib=rb-4.1.0&q=80&w=400',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBicmFzcyUyMGRlY29yfGVufDF8fHx8MTc1ODM2NjIxNXww&ixlib=rb-4.1.0&q=80&w=400'
    ],
    category: 'Metalwork',
    stock: 3,
    tags: ['brass', 'lamp', 'decorative', 'traditional'],
    materials: ['Brass', 'Traditional Engravings', 'Natural Finish']
  },
  {
    name: 'Traditional Brass Lamp',
    description: 'Elegant brass decorative lamp with intricate engravings. Perfect for adding traditional Indian charm to any space.',
    price: 2200,
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBicmFzcyUyMGxhbXB8ZW58MXx8fHwxNzU4MzY2MjE0fDA&ixlib=rb-4.1.0&q=80&w=400'
    ],
    category: 'Metalwork',
    stock: 4,
    tags: ['brass', 'lamp', 'decorative', 'traditional'],
    materials: ['Brass', 'Traditional Engravings', 'Natural Finish']
  },
  {
    name: 'Silver Filigree Necklace',
    description: 'Delicate silver filigree necklace with intricate wirework. Handcrafted using traditional techniques with attention to detail.',
    price: 1200,
    originalPrice: 1500,
    images: [
      'https://images.unsplash.com/photo-1653227907864-560dce4c252d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBqZXdlbHJ5JTIwbWFraW5nJTIwY3JhZnRzfGVufDF8fHx8MTc1ODM2NjIwNXww&ixlib=rb-4.1.0&q=80&w=400'
    ],
    category: 'Jewelry',
    stock: 6,
    tags: ['silver', 'filigree', 'necklace', 'handcrafted'],
    materials: ['Sterling Silver', 'Traditional Wire']
  },
  {
    name: 'Terracotta Plant Pot Set',
    description: 'Set of three handcrafted terracotta plant pots with traditional designs. Perfect for indoor gardening.',
    price: 800,
    images: [
      'https://images.unsplash.com/photo-1716876995651-1ff85b65a6d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBoYW5kaWNyYWZ0cyUyMHBvdHRlcnklMjBhcnRpc2FufGVufDF8fHx8MTc1ODM2NjIwMHww&ixlib=rb-4.1.0&q=80&w=400'
    ],
    category: 'Pottery',
    stock: 12,
    tags: ['terracotta', 'plant pots', 'traditional', 'handcrafted'],
    materials: ['Clay', 'Natural Finish', 'Traditional Designs']
  },
  {
    name: 'Handwoven Cotton Dupatta',
    description: 'Beautiful handwoven cotton dupatta with traditional patterns. Lightweight and perfect for any occasion.',
    price: 600,
    originalPrice: 800,
    images: [
      'https://images.unsplash.com/photo-1632726733402-4a059a476028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB0ZXh0aWxlcyUyMHdlYXZpbmclMjBhcnRpc2FufGVufDF8fHx8MTc1ODM2NjIwMnww&ixlib=rb-4.1.0&q=80&w=400'
    ],
    category: 'Textiles',
    stock: 15,
    tags: ['cotton', 'dupatta', 'handwoven', 'traditional'],
    materials: ['Pure Cotton', 'Traditional Patterns', 'Natural Dyes']
  },
  {
    name: 'Wooden Spice Box Set',
    description: 'Traditional wooden spice box set with multiple compartments. Hand-carved from sustainable teak wood.',
    price: 1500,
    images: [
      'https://images.unsplash.com/photo-1595126035905-21b5c2b67c42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kd29ya2luZyUyMGluZGlhbiUyMGFydGlzYW58ZW58MXx8fHwxNzU4MzY2MjA3fDA&ixlib=rb-4.1.0&q=80&w=400'
    ],
    category: 'Woodwork',
    stock: 7,
    tags: ['wooden', 'spice box', 'hand carved', 'sustainable'],
    materials: ['Teak Wood', 'Natural Finish', 'Traditional Carving']
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shilpkaarai');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});
    await Favorite.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`👤 Created user: ${user.name} (${user.role})`);
    }

    // Create products
    const artisans = createdUsers.filter(user => user.role === 'artisan');
    const customers = createdUsers.filter(user => user.role === 'customer');
    const createdProducts = [];
    
    for (let i = 0; i < sampleProducts.length; i++) {
      const productData = sampleProducts[i];
      const artisan = artisans[i % artisans.length]; // Distribute products among artisans
      
      const product = new Product({
        ...productData,
        artisan: artisan._id,
        artisanName: artisan.name
      });
      
      await product.save();
      createdProducts.push(product);
      console.log(`🛍️ Created product: ${product.name} by ${artisan.name}`);
    }

    // Create sample reviews
    const sampleReviews = [
      {
        productIndex: 0, // Handwoven Banarasi Silk Saree
        reviews: [
          {
            userIndex: 0, // Amit Singh (first customer)
            rating: 5,
            comment: 'Absolutely beautiful saree! The quality is exceptional and the craftsmanship is evident in every detail. Perfect for my daughter\'s wedding.',
            isVerified: true
          },
          {
            userIndex: 1, // Sneha Reddy (second customer)
            rating: 5,
            comment: 'Stunning piece! The colors are vibrant and the silk feels luxurious. Priya is such a talented artisan. Highly recommended!',
            isVerified: true
          }
        ]
      },
      {
        productIndex: 1, // Blue Pottery Dinner Set
        reviews: [
          {
            userIndex: 1, // Sneha Reddy
            rating: 5,
            comment: 'Love this dinner set! The blue glaze is so vibrant and each piece is unique. Perfect for special occasions.',
            isVerified: true
          },
          {
            userIndex: 0, // Amit Singh
            rating: 4,
            comment: 'Great quality pottery. The craftsmanship is excellent and the traditional patterns are beautiful.',
            isVerified: true
          }
        ]
      },
      {
        productIndex: 2, // Silver Filigree Earrings
        reviews: [
          {
            userIndex: 1, // Sneha Reddy
            rating: 5,
            comment: 'These earrings are absolutely gorgeous! The filigree work is so delicate and intricate. I get compliments every time I wear them.',
            isVerified: true
          },
          {
            userIndex: 0, // Amit Singh
            rating: 4,
            comment: 'Beautiful craftsmanship. The silver work is very detailed and the earrings are comfortable to wear.',
            isVerified: false
          }
        ]
      }
    ];

    for (const productReview of sampleReviews) {
      const product = createdProducts[productReview.productIndex];
      
      if (!product) {
        console.log(`⚠️ Product at index ${productReview.productIndex} not found, skipping reviews`);
        continue;
      }
      
      for (const reviewData of productReview.reviews) {
        const customer = customers[reviewData.userIndex];
        
        if (!customer) {
          console.log(`⚠️ Customer at index ${reviewData.userIndex} not found, skipping review`);
          continue;
        }
        
        const review = new Review({
          product: product._id,
          user: customer._id,
          userName: customer.name,
          rating: reviewData.rating,
          comment: reviewData.comment,
          isVerified: reviewData.isVerified,
          helpful: Math.floor(Math.random() * 10)
        });
        
        await review.save();
        console.log(`⭐ Created review by ${customer.name} for ${product.name}`);
      }
    }

    // Update product ratings and review counts
    for (const product of createdProducts) {
      const summary = await Review.calculateAverageRating(product._id);
      await Product.findByIdAndUpdate(product._id, {
        rating: summary.averageRating,
        reviewCount: summary.totalReviews
      });
    }

    // Create sample favorites
    const sampleFavorites = [
      {
        userIndex: 0, // Amit Singh
        productIndices: [0, 2, 4, 5, 7] // Handwoven Banarasi Silk Saree, Silver Filigree Earrings, Handwoven Cotton Kurta, Madhubani Painting, Handwoven Woolen Shawl
      },
      {
        userIndex: 1, // Sneha Reddy
        productIndices: [1, 2, 3, 6] // Blue Pottery Dinner Set, Silver Filigree Earrings, Wooden Hand Carved Bowl Set, Brass Decorative Lamp
      }
    ];

    for (const favoriteData of sampleFavorites) {
      const customer = customers[favoriteData.userIndex];
      
      if (!customer) {
        console.log(`⚠️ Customer at index ${favoriteData.userIndex} not found, skipping favorites`);
        continue;
      }
      
      for (const productIndex of favoriteData.productIndices) {
        const product = createdProducts[productIndex];
        
        if (!product) {
          console.log(`⚠️ Product at index ${productIndex} not found, skipping favorite`);
          continue;
        }
        
        const favorite = new Favorite({
          user: customer._id,
          product: product._id,
          addedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date within last week
        });
        
        await favorite.save();
        console.log(`❤️ Created favorite: ${customer.name} added ${product.name}`);
      }
    }

    // Create comprehensive historical orders spanning 6 months
    const sampleOrders = [
      // Priya Sharma (Textile artisan) - Historical orders
      {
        customerIndex: 0, // Amit Singh
        artisanIndex: 0, // Priya Sharma
        orders: [
          // Recent orders (last 30 days)
          {
            productIndices: [0], // Handwoven Banarasi Silk Saree
            quantities: [1],
            status: 'delivered',
            paymentStatus: 'paid',
            paymentMethod: 'online',
            trackingNumber: 'TRK001',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            shippingAddress: {
              name: 'Amit Singh',
              mobile: '9876543213',
              address: '123 MG Road, Bandra West',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400050',
              country: 'India'
            }
          },
          {
            productIndices: [3], // Cotton Handloom Kurta Set (belongs to Rajesh Kumar)
            quantities: [2],
            status: 'shipped',
            paymentStatus: 'paid',
            paymentMethod: 'cod',
            trackingNumber: 'TRK002',
            createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
            shippingAddress: {
              name: 'Amit Singh',
              mobile: '9876543213',
              address: '123 MG Road, Bandra West',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400050',
              country: 'India'
            }
          },
          // Historical orders (last 6 months)
          {
            productIndices: [0, 3], // Silk Saree + Blue Pottery (both Priya Sharma)
            quantities: [1, 1],
            status: 'delivered',
            paymentStatus: 'paid',
            paymentMethod: 'online',
            trackingNumber: 'TRK003',
            createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
            deliveredAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
            shippingAddress: {
              name: 'Amit Singh',
              mobile: '9876543213',
              address: '123 MG Road, Bandra West',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400050',
              country: 'India'
            }
          },
          {
            productIndices: [6], // Handwoven Cotton Kurta (Priya Sharma)
            quantities: [1],
            status: 'delivered',
            paymentStatus: 'paid',
            paymentMethod: 'online',
            trackingNumber: 'TRK004',
            createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
            deliveredAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000),
            shippingAddress: {
              name: 'Amit Singh',
              mobile: '9876543213',
              address: '123 MG Road, Bandra West',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400050',
              country: 'India'
            }
          },
          {
            productIndices: [0], // Silk Saree
            quantities: [1],
            status: 'delivered',
            paymentStatus: 'paid',
            paymentMethod: 'online',
            trackingNumber: 'TRK005',
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
            deliveredAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000),
            shippingAddress: {
              name: 'Amit Singh',
              mobile: '9876543213',
              address: '123 MG Road, Bandra West',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400050',
              country: 'India'
            }
          },
          {
            productIndices: [3, 6], // Blue Pottery + Cotton Kurta (both Priya Sharma)
            quantities: [1, 1],
            status: 'delivered',
            paymentStatus: 'paid',
            paymentMethod: 'online',
            trackingNumber: 'TRK006',
            createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 120 days ago
            deliveredAt: new Date(Date.now() - 115 * 24 * 60 * 60 * 1000),
            shippingAddress: {
              name: 'Amit Singh',
              mobile: '9876543213',
              address: '123 MG Road, Bandra West',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400050',
              country: 'India'
            }
          },
          {
            productIndices: [0], // Silk Saree
            quantities: [1],
            status: 'delivered',
            paymentStatus: 'paid',
            paymentMethod: 'online',
            trackingNumber: 'TRK007',
            createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000), // 150 days ago
            deliveredAt: new Date(Date.now() - 145 * 24 * 60 * 60 * 1000),
            shippingAddress: {
              name: 'Amit Singh',
              mobile: '9876543213',
              address: '123 MG Road, Bandra West',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400050',
              country: 'India'
            }
          }
        ]
      },
      // Sneha Reddy orders - Rajesh Kumar (Pottery artisan)
      {
        customerIndex: 1, // Sneha Reddy
        artisanIndex: 1, // Rajesh Kumar
        orders: [
          {
            productIndices: [1], // Cotton Handloom Kurta Set (Rajesh Kumar)
            quantities: [1],
            status: 'delivered',
            paymentStatus: 'paid',
            paymentMethod: 'online',
            trackingNumber: 'TRK008',
            createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
            deliveredAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            shippingAddress: {
              name: 'Sneha Reddy',
              mobile: '9876543214',
              address: '456 Brigade Road, Koramangala',
              city: 'Bangalore',
              state: 'Karnataka',
              pincode: '560034',
              country: 'India'
            }
          }
        ]
      },
      // Sneha Reddy orders - Meera Patel (Jewelry artisan)
      {
        customerIndex: 1, // Sneha Reddy
        artisanIndex: 2, // Meera Patel
        orders: [
          {
            productIndices: [2], // Kashmiri Woolen Shawl (Meera Patel)
            quantities: [1],
            status: 'delivered',
            paymentStatus: 'paid',
            paymentMethod: 'online',
            trackingNumber: 'TRK009',
            createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
            deliveredAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
            shippingAddress: {
              name: 'Sneha Reddy',
              mobile: '9876543214',
              address: '456 Brigade Road, Koramangala',
              city: 'Bangalore',
              state: 'Karnataka',
              pincode: '560034',
              country: 'India'
            }
          }
        ]
      },
      // Sneha Reddy orders - Priya Sharma (Textile artisan)
      {
        customerIndex: 1, // Sneha Reddy
        artisanIndex: 0, // Priya Sharma
        orders: [
          {
            productIndices: [0], // Silk Saree (Priya Sharma)
            quantities: [1],
            status: 'delivered',
            paymentStatus: 'paid',
            paymentMethod: 'online',
            trackingNumber: 'TRK010',
            createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000), // 75 days ago
            deliveredAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000),
            shippingAddress: {
              name: 'Sneha Reddy',
              mobile: '9876543214',
              address: '456 Brigade Road, Koramangala',
              city: 'Bangalore',
              state: 'Karnataka',
              pincode: '560034',
              country: 'India'
            }
          }
        ]
      },
      // Additional customers for more data
      {
        customerIndex: 0, // Amit Singh - Rajesh Kumar (Pottery artisan) orders
        artisanIndex: 1, // Rajesh Kumar
        orders: [
          {
            productIndices: [1], // Cotton Handloom Kurta Set (Rajesh Kumar)
            quantities: [1],
            status: 'delivered',
            paymentStatus: 'paid',
            paymentMethod: 'online',
            trackingNumber: 'TRK011',
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
            deliveredAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            shippingAddress: {
              name: 'Amit Singh',
              mobile: '9876543213',
              address: '123 MG Road, Bandra West',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400050',
              country: 'India'
            }
          },
          {
            productIndices: [4], // Silver Filigree Earrings (Rajesh Kumar)
            quantities: [2],
            status: 'delivered',
            paymentStatus: 'paid',
            paymentMethod: 'online',
            trackingNumber: 'TRK012',
            createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35 days ago
            deliveredAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            shippingAddress: {
              name: 'Amit Singh',
              mobile: '9876543213',
              address: '123 MG Road, Bandra West',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400050',
              country: 'India'
            }
          }
        ]
      },
      {
        customerIndex: 1, // Sneha Reddy - Rajesh Kumar (Pottery artisan) orders
        artisanIndex: 1, // Rajesh Kumar
        orders: [
          {
            productIndices: [10], // Silver Filigree Necklace (Rajesh Kumar)
            quantities: [1],
            status: 'delivered',
            paymentStatus: 'paid',
            paymentMethod: 'online',
            trackingNumber: 'TRK013',
            createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
            deliveredAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            shippingAddress: {
              name: 'Sneha Reddy',
              mobile: '9876543214',
              address: '456 Brigade Road, Koramangala',
              city: 'Bangalore',
              state: 'Karnataka',
              pincode: '560034',
              country: 'India'
            }
          },
          {
            productIndices: [10], // Silver Necklace
            quantities: [1],
            status: 'delivered',
            paymentStatus: 'paid',
            paymentMethod: 'online',
            trackingNumber: 'TRK014',
            createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000), // 50 days ago
            deliveredAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
            shippingAddress: {
              name: 'Sneha Reddy',
              mobile: '9876543214',
              address: '456 Brigade Road, Koramangala',
              city: 'Bangalore',
              state: 'Karnataka',
              pincode: '560034',
              country: 'India'
            }
          }
        ]
      }
    ];

    for (const customerOrderData of sampleOrders) {
      const customer = customers[customerOrderData.customerIndex];
      const artisan = artisans[customerOrderData.artisanIndex];
      
      if (!customer || !artisan) {
        console.log(`⚠️ Customer or artisan not found, skipping orders`);
        continue;
      }
      
      for (const orderData of customerOrderData.orders) {
        const orderItems = [];
        let totalAmount = 0;
        
        for (let i = 0; i < orderData.productIndices.length; i++) {
          const productIndex = orderData.productIndices[i];
          const product = createdProducts[productIndex];
          const quantity = orderData.quantities[i];
          
          if (!product) {
            console.log(`⚠️ Product at index ${productIndex} not found, skipping order item`);
            continue;
          }
          
          // Only include products from the correct artisan
          if (product.artisan.toString() !== artisan._id.toString()) {
            console.log(`⚠️ Product ${product.name} doesn't belong to artisan ${artisan.name}, skipping`);
            continue;
          }
          
          const itemTotal = product.price * quantity;
          totalAmount += itemTotal;
          
          orderItems.push({
            product: product._id,
            quantity: quantity,
            price: product.price
          });
        }
        
        if (orderItems.length === 0) {
          console.log(`⚠️ No valid products for order, skipping`);
          continue;
        }
        
        const order = new Order({
          orderNumber: `SPK${String(Date.now() + Math.random() * 1000).slice(-6)}`, // Generate unique order number
          customer: customer._id,
          items: orderItems,
          totalAmount: totalAmount,
          status: orderData.status,
          paymentStatus: orderData.paymentStatus,
          paymentMethod: orderData.paymentMethod,
          trackingNumber: orderData.trackingNumber,
          shippingAddress: orderData.shippingAddress,
          createdAt: orderData.createdAt,
          updatedAt: orderData.createdAt
        });
        
        await order.save();
        console.log(`📦 Created order ${order.orderNumber}: ${customer.name} → ${artisan.name} - ₹${totalAmount} (${orderData.status})`);
      }
    }

    console.log('🎉 Database seeded successfully!');
    console.log('\n📋 Sample Accounts:');
    console.log('Artisans:');
    artisans.forEach(artisan => {
      console.log(`  - ${artisan.name}: ${artisan.mobile} / password123`);
    });
    
    console.log('Customers:');
    customers.forEach(customer => {
      console.log(`  - ${customer.name}: ${customer.mobile} / password123`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedDatabase();
