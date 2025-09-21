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

// Sample data from MongoDB seed file
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

async function migrateData() {
  try {
    console.log('🚀 Starting Supabase data migration...');

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

    console.log('🎉 Data migration completed successfully!');
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

migrateData();
