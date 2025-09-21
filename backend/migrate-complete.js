const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Complete sample data from MongoDB seed file
const sampleUsers = [
  // Textile Artisans
  {
    name: 'Priya Sharma',
    mobile: '9876543210',
    password: 'password123',
    role: 'artisan',
    email: 'priya@example.com',
    location: 'Varanasi, Uttar Pradesh',
    region: 'North India',
    state: 'Uttar Pradesh',
    city: 'Varanasi',
    craft: 'Textile Weaving',
    crafts: ['Banarasi Silk', 'Traditional Weaving', 'Zari Work'],
    experience: 15,
    rating: 4.9,
    review_count: 234,
    products_count: 45,
    techniques: ['Hand Weaving', 'Zari Work', 'Traditional Dyeing'],
    specializations: ['Sarees', 'Dupattas', 'Kurtas'],
    certifications: ['Handloom Mark', 'GI Tag - Banarasi'],
    languages: ['Hindi', 'English'],
    bio: 'Master weaver specializing in Banarasi silk sarees with 15 years of experience. Preserving traditional weaving techniques passed down through generations.',
    workshop_offered: true,
    is_verified: true
  },
  {
    name: 'Kavitha Reddy',
    mobile: '9876543215',
    password: 'password123',
    role: 'artisan',
    email: 'kavitha@example.com',
    location: 'Hyderabad, Telangana',
    region: 'South India',
    state: 'Telangana',
    city: 'Hyderabad',
    craft: 'Textile Weaving',
    crafts: ['Cotton Weaving', 'Ikat', 'Traditional Prints'],
    experience: 12,
    rating: 4.7,
    review_count: 189,
    products_count: 38,
    techniques: ['Ikat Weaving', 'Block Printing', 'Natural Dyeing'],
    specializations: ['Kurtas', 'Sarees', 'Bedspreads'],
    certifications: ['Handloom Mark'],
    languages: ['Telugu', 'Hindi', 'English'],
    bio: 'Expert in traditional Telangana weaving and Ikat techniques. Creating beautiful cotton textiles with natural dyes.',
    workshop_offered: false,
    is_verified: true
  },
  
  // Pottery Artisans
  {
    name: 'Rajesh Kumar',
    mobile: '9876543211',
    password: 'password123',
    role: 'artisan',
    email: 'rajesh@example.com',
    location: 'Jaipur, Rajasthan',
    region: 'North India',
    state: 'Rajasthan',
    city: 'Jaipur',
    craft: 'Blue Pottery',
    crafts: ['Blue Pottery', 'Ceramic Art', 'Terracotta'],
    experience: 12,
    rating: 4.8,
    review_count: 312,
    products_count: 67,
    techniques: ['Blue Glazing', 'Hand Throwing', 'Traditional Firing'],
    specializations: ['Dinner Sets', 'Decorative Items', 'Plant Pots'],
    certifications: ['GI Tag - Blue Pottery'],
    languages: ['Hindi', 'Rajasthani', 'English'],
    bio: 'Master craftsman in traditional Jaipur blue pottery. Creating beautiful ceramic pieces using age-old techniques.',
    workshop_offered: true,
    is_verified: true
  },
  {
    name: 'Suresh Mehta',
    mobile: '9876543216',
    password: 'password123',
    role: 'artisan',
    email: 'suresh@example.com',
    location: 'Khurja, Uttar Pradesh',
    region: 'North India',
    state: 'Uttar Pradesh',
    city: 'Khurja',
    craft: 'Pottery',
    crafts: ['Ceramic Pottery', 'Terracotta', 'Glazed Pottery'],
    experience: 18,
    rating: 4.6,
    review_count: 156,
    products_count: 42,
    techniques: ['Glazing', 'Hand Molding', 'Kiln Firing'],
    specializations: ['Kitchenware', 'Decorative Items', 'Garden Pots'],
    certifications: ['Handicraft Mark'],
    languages: ['Hindi', 'English'],
    bio: 'Traditional potter from Khurja, known for ceramic kitchenware and decorative items.',
    workshop_offered: false,
    is_verified: true
  },

  // Jewelry Artisans
  {
    name: 'Meera Patel',
    mobile: '9876543212',
    password: 'password123',
    role: 'artisan',
    email: 'meera@example.com',
    location: 'Surat, Gujarat',
    region: 'West India',
    state: 'Gujarat',
    city: 'Surat',
    craft: 'Jewelry Making',
    crafts: ['Silver Filigree', 'Traditional Jewelry', 'Bead Work'],
    experience: 8,
    rating: 4.8,
    review_count: 312,
    products_count: 67,
    techniques: ['Filigree Work', 'Wire Wrapping', 'Stone Setting'],
    specializations: ['Earrings', 'Necklaces', 'Rings'],
    certifications: ['Hallmark Certified'],
    languages: ['Gujarati', 'Hindi', 'English'],
    bio: 'Skilled jewelry maker specializing in silver filigree work. Creating intricate traditional and contemporary pieces.',
    workshop_offered: true,
    is_verified: true
  },
  {
    name: 'Arjun Singh',
    mobile: '9876543217',
    password: 'password123',
    role: 'artisan',
    email: 'arjun@example.com',
    location: 'Cuttack, Odisha',
    region: 'East India',
    state: 'Odisha',
    city: 'Cuttack',
    craft: 'Silver Filigree',
    crafts: ['Silver Filigree', 'Traditional Jewelry', 'Metal Work'],
    experience: 22,
    rating: 4.9,
    review_count: 445,
    products_count: 89,
    techniques: ['Filigree Work', 'Metal Casting', 'Traditional Engraving'],
    specializations: ['Traditional Sets', 'Bridal Jewelry', 'Religious Items'],
    certifications: ['GI Tag - Silver Filigree', 'Hallmark Certified'],
    languages: ['Odia', 'Hindi', 'English'],
    bio: 'Master craftsman in traditional Odisha silver filigree work. Creating exquisite jewelry pieces with intricate designs.',
    workshop_offered: true,
    is_verified: true
  },

  // Woodwork Artisans
  {
    name: 'Vikram Joshi',
    mobile: '9876543218',
    password: 'password123',
    role: 'artisan',
    email: 'vikram@example.com',
    location: 'Saharanpur, Uttar Pradesh',
    region: 'North India',
    state: 'Uttar Pradesh',
    city: 'Saharanpur',
    craft: 'Wood Carving',
    crafts: ['Wood Carving', 'Furniture Making', 'Decorative Items'],
    experience: 20,
    rating: 4.7,
    review_count: 278,
    products_count: 52,
    techniques: ['Hand Carving', 'Wood Turning', 'Traditional Joinery'],
    specializations: ['Furniture', 'Decorative Items', 'Kitchenware'],
    certifications: ['Handicraft Mark'],
    languages: ['Hindi', 'English'],
    bio: 'Master wood carver from Saharanpur, creating beautiful furniture and decorative items using traditional techniques.',
    workshop_offered: true,
    is_verified: true
  },
  {
    name: 'Ravi Kumar',
    mobile: '9876543219',
    password: 'password123',
    role: 'artisan',
    email: 'ravi@example.com',
    location: 'Chennai, Tamil Nadu',
    region: 'South India',
    state: 'Tamil Nadu',
    city: 'Chennai',
    craft: 'Woodwork',
    crafts: ['Wood Carving', 'Traditional Furniture', 'Decorative Items'],
    experience: 14,
    rating: 4.5,
    review_count: 198,
    products_count: 35,
    techniques: ['Traditional Carving', 'Wood Inlay', 'Natural Finishing'],
    specializations: ['Spice Boxes', 'Decorative Items', 'Small Furniture'],
    certifications: ['Handicraft Mark'],
    languages: ['Tamil', 'Hindi', 'English'],
    bio: 'Traditional woodworker specializing in South Indian carving techniques and natural wood finishes.',
    workshop_offered: false,
    is_verified: true
  },

  // Metalwork Artisans
  {
    name: 'Hari Prasad',
    mobile: '9876543220',
    password: 'password123',
    role: 'artisan',
    email: 'hari@example.com',
    location: 'Moradabad, Uttar Pradesh',
    region: 'North India',
    state: 'Uttar Pradesh',
    city: 'Moradabad',
    craft: 'Metalwork',
    crafts: ['Brass Work', 'Metal Casting', 'Traditional Engraving'],
    experience: 16,
    rating: 4.6,
    review_count: 223,
    products_count: 48,
    techniques: ['Metal Casting', 'Engraving', 'Traditional Finishing'],
    specializations: ['Lamps', 'Decorative Items', 'Kitchenware'],
    certifications: ['Handicraft Mark'],
    languages: ['Hindi', 'English'],
    bio: 'Master metalworker from Moradabad, creating beautiful brass items with traditional engraving techniques.',
    workshop_offered: true,
    is_verified: true
  },

  // Painting Artisans
  {
    name: 'Sunita Devi',
    mobile: '9876543221',
    password: 'password123',
    role: 'artisan',
    email: 'sunita@example.com',
    location: 'Madhubani, Bihar',
    region: 'East India',
    state: 'Bihar',
    city: 'Madhubani',
    craft: 'Madhubani Painting',
    crafts: ['Madhubani Painting', 'Traditional Art', 'Folk Art'],
    experience: 25,
    rating: 4.9,
    review_count: 356,
    products_count: 78,
    techniques: ['Traditional Painting', 'Natural Colors', 'Handmade Paper'],
    specializations: ['Wall Hangings', 'Paintings', 'Decorative Items'],
    certifications: ['GI Tag - Madhubani'],
    languages: ['Hindi', 'Maithili', 'English'],
    bio: 'Renowned Madhubani artist preserving traditional folk art techniques. Creating beautiful paintings with natural colors.',
    workshop_offered: true,
    is_verified: true
  },
  {
    name: 'Rajeshwar Singh',
    mobile: '9876543222',
    password: 'password123',
    role: 'artisan',
    email: 'rajeshwar@example.com',
    location: 'Udaipur, Rajasthan',
    region: 'North India',
    state: 'Rajasthan',
    city: 'Udaipur',
    craft: 'Miniature Painting',
    crafts: ['Miniature Painting', 'Traditional Art', 'Rajasthani Art'],
    experience: 19,
    rating: 4.8,
    review_count: 289,
    products_count: 56,
    techniques: ['Miniature Painting', 'Natural Pigments', 'Fine Brush Work'],
    specializations: ['Paintings', 'Wall Hangings', 'Decorative Items'],
    certifications: ['Handicraft Mark'],
    languages: ['Hindi', 'Rajasthani', 'English'],
    bio: 'Master miniature painter from Udaipur, creating intricate traditional Rajasthani art pieces.',
    workshop_offered: true,
    is_verified: true
  },

  // Customers
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
  },
  {
    name: 'Priya Gupta',
    mobile: '9876543223',
    password: 'password123',
    role: 'customer',
    email: 'priya.gupta@example.com',
    location: 'Delhi, Delhi'
  },
  {
    name: 'Rahul Sharma',
    mobile: '9876543224',
    password: 'password123',
    role: 'customer',
    email: 'rahul@example.com',
    location: 'Pune, Maharashtra'
  }
];

const sampleProducts = [
  {
    name: 'Handwoven Banarasi Silk Saree',
    description: 'Exquisite handwoven Banarasi silk saree with intricate zari work. Made with pure silk threads and traditional weaving techniques passed down through generations.',
    price: 2500,
    original_price: 3200,
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
    search_keywords: ['banarasi saree', 'silk saree', 'traditional', 'handwoven', 'zari'],
    dimensions: { length: 550, width: 110, height: 0, unit: 'cm' },
    weight: 800,
    craft_story: 'This saree is handwoven by skilled artisans in Varanasi using traditional techniques passed down through generations.',
    care_instructions: 'Dry clean only. Store in a cool, dry place. Avoid direct sunlight.'
  },
  {
    name: 'Cotton Handloom Kurta Set',
    description: 'Comfortable cotton handloom kurta set with traditional block printing. Perfect for casual wear with authentic Indian craftsmanship.',
    price: 1200,
    original_price: 1500,
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
    search_keywords: ['cotton kurta', 'handloom', 'block print', 'traditional', 'casual'],
    dimensions: { length: 80, width: 50, height: 0, unit: 'cm' },
    weight: 300,
    craft_story: 'Handwoven using traditional techniques with natural block printing methods.',
    care_instructions: 'Machine wash cold. Air dry. Iron on low heat.'
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
    original_price: 950,
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
  }
];

async function migrateCompleteData() {
  try {
    console.log('🚀 Starting complete Supabase data migration...');

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('favorites').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Hash passwords
    for (const user of sampleUsers) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    // Insert users
    console.log('👤 Inserting users...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .insert(sampleUsers)
      .select();

    if (usersError) {
      throw new Error(`Error inserting users: ${usersError.message}`);
    }

    console.log(`✅ Inserted ${users.length} users`);

    // Get artisans and customers for product/order creation
    const artisans = users.filter(user => user.role === 'artisan');
    const customers = users.filter(user => user.role === 'customer');

    // Insert products
    console.log('🛍️ Inserting products...');
    const productsToInsert = sampleProducts.map((productData, index) => {
      const artisan = artisans[index % artisans.length]; // Distribute products among artisans
      return {
        ...productData,
        artisan_id: artisan.id,
        artisan_name: artisan.name
      };
    });

    const { data: products, error: productsError } = await supabase
      .from('products')
      .insert(productsToInsert)
      .select();

    if (productsError) {
      throw new Error(`Error inserting products: ${productsError.message}`);
    }

    console.log(`✅ Inserted ${products.length} products`);

    // Create sample reviews
    console.log('⭐ Creating reviews...');
    const reviewsToInsert = [
      {
        product_id: products[0].id,
        user_id: customers[0].id,
        user_name: customers[0].name,
        rating: 5,
        comment: 'Absolutely beautiful saree! The quality is exceptional and the craftsmanship is evident in every detail.',
        is_verified: true,
        helpful: 8
      },
      {
        product_id: products[0].id,
        user_id: customers[1].id,
        user_name: customers[1].name,
        rating: 5,
        comment: 'Stunning piece! The colors are vibrant and the silk feels luxurious. Highly recommended!',
        is_verified: true,
        helpful: 12
      },
      {
        product_id: products[1].id,
        user_id: customers[1].id,
        user_name: customers[1].name,
        rating: 5,
        comment: 'Love this kurta set! The cotton is soft and the block print is beautiful.',
        is_verified: true,
        helpful: 6
      }
    ];

    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .insert(reviewsToInsert)
      .select();

    if (reviewsError) {
      throw new Error(`Error inserting reviews: ${reviewsError.message}`);
    }

    console.log(`✅ Inserted ${reviews.length} reviews`);

    // Create sample favorites
    console.log('❤️ Creating favorites...');
    const favoritesToInsert = [
      {
        user_id: customers[0].id,
        product_id: products[0].id
      },
      {
        user_id: customers[0].id,
        product_id: products[2].id
      },
      {
        user_id: customers[1].id,
        product_id: products[1].id
      },
      {
        user_id: customers[1].id,
        product_id: products[3].id
      }
    ];

    const { data: favorites, error: favoritesError } = await supabase
      .from('favorites')
      .insert(favoritesToInsert)
      .select();

    if (favoritesError) {
      throw new Error(`Error inserting favorites: ${favoritesError.message}`);
    }

    console.log(`✅ Inserted ${favorites.length} favorites`);

    // Create sample orders
    console.log('📦 Creating orders...');
    const ordersToInsert = [
      {
        order_number: 'SPK001234',
        customer_id: customers[0].id,
        items: [
          {
            product_id: products[0].id,
            quantity: 1,
            price: products[0].price
          }
        ],
        total_amount: products[0].price,
        status: 'delivered',
        payment_status: 'paid',
        payment_method: 'online',
        tracking_number: 'TRK001',
        shipping_address: {
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
        order_number: 'SPK001235',
        customer_id: customers[1].id,
        items: [
          {
            product_id: products[1].id,
            quantity: 2,
            price: products[1].price
          }
        ],
        total_amount: products[1].price * 2,
        status: 'shipped',
        payment_status: 'paid',
        payment_method: 'cod',
        tracking_number: 'TRK002',
        shipping_address: {
          name: 'Sneha Reddy',
          mobile: '9876543214',
          address: '456 Brigade Road, Koramangala',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560034',
          country: 'India'
        }
      }
    ];

    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .insert(ordersToInsert)
      .select();

    if (ordersError) {
      throw new Error(`Error inserting orders: ${ordersError.message}`);
    }

    console.log(`✅ Inserted ${orders.length} orders`);

    console.log('🎉 Complete data migration successful!');
    console.log('\n📋 Summary:');
    console.log(`✅ Users: ${users.length} (${artisans.length} artisans, ${customers.length} customers)`);
    console.log(`✅ Products: ${products.length}`);
    console.log(`✅ Reviews: ${reviews.length}`);
    console.log(`✅ Favorites: ${favorites.length}`);
    console.log(`✅ Orders: ${orders.length}`);

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
    console.error('❌ Error migrating data:', error);
  }
}

migrateCompleteData();
