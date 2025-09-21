const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// ALL USERS FROM ORIGINAL MONGODB SEED FILE
const allUsers = [
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
    reviewCount: 234,
    productsCount: 45,
    techniques: ['Hand Weaving', 'Zari Work', 'Traditional Dyeing'],
    specializations: ['Sarees', 'Dupattas', 'Kurtas'],
    certifications: ['Handloom Mark', 'GI Tag - Banarasi'],
    languages: ['Hindi', 'English'],
    bio: 'Master weaver specializing in Banarasi silk sarees with 15 years of experience. Preserving traditional weaving techniques passed down through generations.',
    workshopOffered: true,
    isVerified: true
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
    reviewCount: 189,
    productsCount: 38,
    techniques: ['Ikat Weaving', 'Block Printing', 'Natural Dyeing'],
    specializations: ['Kurtas', 'Sarees', 'Bedspreads'],
    certifications: ['Handloom Mark'],
    languages: ['Telugu', 'Hindi', 'English'],
    bio: 'Expert in traditional Telangana weaving and Ikat techniques. Creating beautiful cotton textiles with natural dyes.',
    workshopOffered: false,
    isVerified: true
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
    reviewCount: 312,
    productsCount: 67,
    techniques: ['Blue Glazing', 'Hand Throwing', 'Traditional Firing'],
    specializations: ['Dinner Sets', 'Decorative Items', 'Plant Pots'],
    certifications: ['GI Tag - Blue Pottery'],
    languages: ['Hindi', 'Rajasthani', 'English'],
    bio: 'Master craftsman in traditional Jaipur blue pottery. Creating beautiful ceramic pieces using age-old techniques.',
    workshopOffered: true,
    isVerified: true
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
    reviewCount: 198,
    productsCount: 35,
    techniques: ['Traditional Carving', 'Wood Inlay', 'Natural Finishing'],
    specializations: ['Spice Boxes', 'Decorative Items', 'Small Furniture'],
    certifications: ['Handicraft Mark'],
    languages: ['Tamil', 'Hindi', 'English'],
    bio: 'Traditional woodworker specializing in South Indian carving techniques and natural wood finishes.',
    workshopOffered: false,
    isVerified: true
  },

  // Jewelry Artisans
  {
    name: 'Anita Verma',
    mobile: '9876543212',
    password: 'password123',
    role: 'artisan',
    email: 'anita@example.com',
    location: 'Delhi, Delhi',
    region: 'North India',
    state: 'Delhi',
    city: 'Delhi',
    craft: 'Jewelry Making',
    crafts: ['Silver Work', 'Gold Plating', 'Pearl Stringing'],
    experience: 18,
    rating: 4.9,
    reviewCount: 267,
    productsCount: 5,
    techniques: ['Filigree', 'Gold Plating', 'Pearl Setting'],
    specializations: ['Traditional Jewelry', 'Modern Designs'],
    certifications: ['Jewelry Design Certificate'],
    languages: ['Hindi', 'English'],
    bio: 'Master jeweler specializing in traditional Indian jewelry with contemporary designs.',
    workshopOffered: false,
    isVerified: true
  },

  // Woodwork Artisans
  {
    name: 'Vikram Singh',
    mobile: '9876543213',
    password: 'password123',
    role: 'artisan',
    email: 'vikram@example.com',
    location: 'Kolkata, West Bengal',
    region: 'East India',
    state: 'West Bengal',
    city: 'Kolkata',
    craft: 'Wood Carving',
    crafts: ['Wood Carving', 'Bamboo Work'],
    experience: 20,
    rating: 4.7,
    reviewCount: 178,
    productsCount: 7,
    techniques: ['Hand Carving', 'Bamboo Weaving', 'Traditional Motifs'],
    specializations: ['Teak Wood', 'Bamboo Products'],
    certifications: ['Wood Craft Master'],
    languages: ['Bengali', 'Hindi', 'English'],
    bio: 'Master wood carver with expertise in traditional Bengali woodwork and bamboo crafts.',
    workshopOffered: true,
    isVerified: true
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
    reviewCount: 223,
    productsCount: 48,
    techniques: ['Metal Casting', 'Engraving', 'Traditional Finishing'],
    specializations: ['Lamps', 'Decorative Items', 'Kitchenware'],
    certifications: ['Handicraft Mark'],
    languages: ['Hindi', 'English'],
    bio: 'Master metalworker from Moradabad, creating beautiful brass items with traditional engraving techniques.',
    workshopOffered: true,
    isVerified: true
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
    reviewCount: 356,
    productsCount: 78,
    techniques: ['Traditional Painting', 'Natural Colors', 'Handmade Paper'],
    specializations: ['Wall Hangings', 'Paintings', 'Decorative Items'],
    certifications: ['GI Tag - Madhubani'],
    languages: ['Hindi', 'Maithili', 'English'],
    bio: 'Renowned Madhubani artist preserving traditional folk art techniques. Creating beautiful paintings with natural colors.',
    workshopOffered: true,
    isVerified: true
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
    reviewCount: 289,
    productsCount: 56,
    techniques: ['Miniature Painting', 'Natural Pigments', 'Fine Brush Work'],
    specializations: ['Paintings', 'Wall Hangings', 'Decorative Items'],
    certifications: ['Handicraft Mark'],
    languages: ['Hindi', 'Rajasthani', 'English'],
    bio: 'Master miniature painter from Udaipur, creating intricate traditional Rajasthani art pieces.',
    workshopOffered: true,
    isVerified: true
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

async function migrateAllUsers() {
  try {
    console.log('🚀 Starting complete user migration from MongoDB seed...');

    // Clear existing users
    console.log('🗑️ Clearing existing users...');
    await supabaseAdmin.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert all users
    console.log('👥 Inserting all users...');
    const createdUsers = [];
    
    for (const userData of allUsers) {
      const password_hash = await bcrypt.hash(userData.password, 10);
      
      const userInsert = {
        name: userData.name,
        mobile: userData.mobile,
        password: password_hash,
        role: userData.role,
        email: userData.email,
        location: userData.location,
        region: userData.region,
        state: userData.state,
        city: userData.city,
        craft: userData.craft,
        crafts: userData.crafts,
        experience: userData.experience,
        rating: userData.rating,
        review_count: userData.reviewCount,
        products_count: userData.productsCount,
        techniques: userData.techniques,
        specializations: userData.specializations,
        certifications: userData.certifications,
        languages: userData.languages,
        bio: userData.bio,
        workshop_offered: userData.workshopOffered,
        is_verified: userData.isVerified,
      };
      
      const { data, error } = await supabaseAdmin.from('users').insert(userInsert).select();
      if (error) throw error;
      createdUsers.push(data[0]);
    }

    const artisans = createdUsers.filter(u => u.role === 'artisan');
    const customers = createdUsers.filter(u => u.role === 'customer');

    console.log(`✅ Inserted ${artisans.length} artisans and ${customers.length} customers`);
    console.log('🎉 Complete user migration successful!');
    
    return { artisans, customers };

  } catch (error) {
    console.error('❌ Error during complete user migration:', error);
    throw error;
  }
}

module.exports = { migrateAllUsers, allUsers };
