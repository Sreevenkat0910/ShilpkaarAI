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
    stock: 5,
    tags: ['silk', 'handwoven', 'traditional', 'zari'],
    materials: ['Pure Silk', 'Zari Thread', 'Gold Thread']
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
    name: 'Handwoven Woolen Shawl',
    description: 'Luxurious handwoven woolen shawl from Kashmir. Soft, warm, and beautifully crafted with traditional patterns.',
    price: 3500,
    originalPrice: 4500,
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzaGF3bCUyMHdvb2x8ZW58MXx8fHwxNzU4MzY2MjE2fDA&ixlib=rb-4.1.0&q=80&w=400',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYXNobWlyJTIwc2hhd2x8ZW58MXx8fHwxNzU4MzY2MjE3fDA&ixlib=rb-4.1.0&q=80&w=400'
    ],
    category: 'Textiles',
    stock: 2,
    tags: ['wool', 'shawl', 'kashmir', 'handwoven'],
    materials: ['Pure Wool', 'Traditional Patterns', 'Natural Dyes']
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

    // Create sample orders
    const sampleOrders = [
      {
        customerIndex: 0, // Amit Singh
        orders: [
          {
            productIndices: [0, 2], // Handwoven Banarasi Silk Saree, Silver Filigree Earrings
            quantities: [1, 1],
            status: 'delivered',
            paymentStatus: 'paid',
            paymentMethod: 'online',
            trackingNumber: 'TRK123456789',
            createdAt: new Date('2024-01-15'),
            deliveredAt: new Date('2024-01-19'),
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
            productIndices: [4], // Handwoven Cotton Kurta
            quantities: [2],
            status: 'shipped',
            paymentStatus: 'paid',
            paymentMethod: 'cod',
            trackingNumber: 'TRK987654321',
            createdAt: new Date('2024-01-20'),
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
            productIndices: [5], // Madhubani Painting
            quantities: [1],
            status: 'confirmed',
            paymentStatus: 'paid',
            paymentMethod: 'online',
            createdAt: new Date('2024-01-22'),
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
        customerIndex: 1, // Sneha Reddy
        orders: [
          {
            productIndices: [1, 3], // Blue Pottery Dinner Set, Wooden Hand Carved Bowl Set
            quantities: [1, 1],
            status: 'delivered',
            paymentStatus: 'paid',
            paymentMethod: 'online',
            trackingNumber: 'TRK456789123',
            createdAt: new Date('2024-01-10'),
            deliveredAt: new Date('2024-01-14'),
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
            productIndices: [2], // Silver Filigree Earrings
            quantities: [1],
            status: 'cancelled',
            paymentStatus: 'refunded',
            paymentMethod: 'online',
            createdAt: new Date('2024-01-18'),
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
      
      if (!customer) {
        console.log(`⚠️ Customer at index ${customerOrderData.customerIndex} not found, skipping orders`);
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
          orderNumber: `SPK${String(Date.now()).slice(-6)}`, // Generate unique order number
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
        console.log(`📦 Created order ${order.orderNumber}: ${customer.name} - ₹${totalAmount} (${orderData.status})`);
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
