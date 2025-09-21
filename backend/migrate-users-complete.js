const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Extended artisan data
const artisansData = [
  {
    name: 'Priya Sharma',
    mobile: '9876543210',
    email: 'priya@example.com',
    password: 'password123',
    role: 'artisan',
    location: 'Varanasi, Uttar Pradesh',
    region: 'North India',
    state: 'Uttar Pradesh',
    city: 'Varanasi',
    craft: 'Silk Weaving',
    crafts: ['Silk Weaving', 'Zari Work'],
    experience: 15,
    rating: 4.9,
    reviewCount: 234,
    productsCount: 8,
    techniques: ['Handloom', 'Zari Work', 'Traditional Motifs'],
    specializations: ['Banarasi Silk', 'Kanjeevaram'],
    certifications: ['Master Craftsman Certificate'],
    languages: ['Hindi', 'English'],
    bio: 'Master silk weaver with 15 years of experience in traditional Banarasi and Kanjeevaram silk sarees.',
    workshopOffered: true,
    isVerified: true
  },
  {
    name: 'Rajesh Kumar',
    mobile: '9876543211',
    email: 'rajesh@example.com',
    password: 'password123',
    role: 'artisan',
    location: 'Jaipur, Rajasthan',
    region: 'North India',
    state: 'Rajasthan',
    city: 'Jaipur',
    craft: 'Blue Pottery',
    crafts: ['Blue Pottery', 'Ceramic Work'],
    experience: 12,
    rating: 4.8,
    reviewCount: 312,
    productsCount: 6,
    techniques: ['Blue Glazing', 'Hand Molding', 'Traditional Patterns'],
    specializations: ['Blue Pottery', 'Ceramic Dinnerware'],
    certifications: ['Traditional Crafts Certificate'],
    languages: ['Hindi', 'Rajasthani'],
    bio: 'Expert in traditional Jaipur blue pottery with modern ceramic techniques.',
    workshopOffered: true,
    isVerified: true
  },
  {
    name: 'Anita Verma',
    mobile: '9876543212',
    email: 'anita@example.com',
    password: 'password123',
    role: 'artisan',
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
  {
    name: 'Vikram Singh',
    mobile: '9876543213',
    email: 'vikram@example.com',
    password: 'password123',
    role: 'artisan',
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
  {
    name: 'Ramesh Kumar',
    mobile: '9876543214',
    email: 'ramesh@example.com',
    password: 'password123',
    role: 'artisan',
    location: 'Moradabad, Uttar Pradesh',
    region: 'North India',
    state: 'Uttar Pradesh',
    city: 'Moradabad',
    craft: 'Metal Work',
    crafts: ['Brass Work', 'Copper Work'],
    experience: 14,
    rating: 4.6,
    reviewCount: 167,
    productsCount: 4,
    techniques: ['Brass Engraving', 'Copper Molding', 'Traditional Patterns'],
    specializations: ['Brass Decoratives', 'Copper Utensils'],
    certifications: ['Metal Work Certificate'],
    languages: ['Hindi', 'Urdu'],
    bio: 'Expert in traditional brass and copper work from Moradabad.',
    workshopOffered: false,
    isVerified: true
  },
  {
    name: 'Suresh Patel',
    mobile: '9876543215',
    email: 'suresh@example.com',
    password: 'password123',
    role: 'artisan',
    location: 'Agra, Uttar Pradesh',
    region: 'North India',
    state: 'Uttar Pradesh',
    city: 'Agra',
    craft: 'Leather Work',
    crafts: ['Leather Crafting', 'Bag Making'],
    experience: 16,
    rating: 4.8,
    reviewCount: 189,
    productsCount: 3,
    techniques: ['Hand Stitching', 'Leather Embossing', 'Traditional Patterns'],
    specializations: ['Leather Bags', 'Wallets'],
    certifications: ['Leather Craft Certificate'],
    languages: ['Hindi', 'English'],
    bio: 'Master leather craftsman specializing in premium leather goods.',
    workshopOffered: true,
    isVerified: true
  },
  {
    name: 'Mahesh Sharma',
    mobile: '9876543216',
    email: 'mahesh@example.com',
    password: 'password123',
    role: 'artisan',
    location: 'Makrana, Rajasthan',
    region: 'North India',
    state: 'Rajasthan',
    city: 'Makrana',
    craft: 'Stone Carving',
    crafts: ['Marble Work', 'Granite Carving'],
    experience: 22,
    rating: 4.9,
    reviewCount: 198,
    productsCount: 4,
    techniques: ['Marble Carving', 'Granite Sculpting', 'Traditional Motifs'],
    specializations: ['Marble Decoratives', 'Granite Utensils'],
    certifications: ['Stone Carving Master'],
    languages: ['Hindi', 'Rajasthani'],
    bio: 'Master stone carver with expertise in Makrana marble and granite work.',
    workshopOffered: false,
    isVerified: true
  },
  {
    name: 'Sunita Devi',
    mobile: '9876543217',
    email: 'sunita@example.com',
    password: 'password123',
    role: 'artisan',
    location: 'Bagru, Rajasthan',
    region: 'North India',
    state: 'Rajasthan',
    city: 'Bagru',
    craft: 'Block Printing',
    crafts: ['Block Printing', 'Textile Design'],
    experience: 13,
    rating: 4.5,
    reviewCount: 89,
    productsCount: 6,
    techniques: ['Hand Block Printing', 'Natural Dyes', 'Traditional Patterns'],
    specializations: ['Cotton Block Print', 'Dupattas'],
    certifications: ['Block Printing Certificate'],
    languages: ['Hindi', 'Rajasthani'],
    bio: 'Expert in traditional Bagru block printing with natural dyes.',
    workshopOffered: true,
    isVerified: true
  },
  {
    name: 'Kavita Singh',
    mobile: '9876543218',
    email: 'kavita@example.com',
    password: 'password123',
    role: 'artisan',
    location: 'Chennai, Tamil Nadu',
    region: 'South India',
    state: 'Tamil Nadu',
    city: 'Chennai',
    craft: 'Textile Weaving',
    crafts: ['Cotton Weaving', 'Silk Work'],
    experience: 17,
    rating: 4.7,
    reviewCount: 145,
    productsCount: 5,
    techniques: ['Handloom Weaving', 'Traditional Motifs', 'Natural Dyes'],
    specializations: ['Cotton Textiles', 'Traditional Garments'],
    certifications: ['Textile Weaving Certificate'],
    languages: ['Tamil', 'Hindi', 'English'],
    bio: 'Master weaver specializing in traditional South Indian textiles.',
    workshopOffered: true,
    isVerified: true
  },
  {
    name: 'Manoj Singh',
    mobile: '9876543219',
    email: 'manoj@example.com',
    password: 'password123',
    role: 'artisan',
    location: 'Khurja, Uttar Pradesh',
    region: 'North India',
    state: 'Uttar Pradesh',
    city: 'Khurja',
    craft: 'Ceramic Work',
    crafts: ['Terracotta', 'Ceramic Glazing'],
    experience: 11,
    rating: 4.6,
    reviewCount: 145,
    productsCount: 4,
    techniques: ['Terracotta Molding', 'Ceramic Glazing', 'Traditional Patterns'],
    specializations: ['Plant Pots', 'Decorative Items'],
    certifications: ['Ceramic Work Certificate'],
    languages: ['Hindi', 'English'],
    bio: 'Expert in traditional Khurja ceramics and terracotta work.',
    workshopOffered: false,
    isVerified: true
  }
];

// Extended customer data
const customersData = [
  {
    name: 'Amit Singh',
    mobile: '9876543220',
    email: 'amit@example.com',
    password: 'password123',
    role: 'customer',
    location: 'Mumbai, Maharashtra',
    region: 'West India',
    state: 'Maharashtra',
    city: 'Mumbai',
    isVerified: true
  },
  {
    name: 'Priya Patel',
    mobile: '9876543221',
    email: 'priya.patel@example.com',
    password: 'password123',
    role: 'customer',
    location: 'Ahmedabad, Gujarat',
    region: 'West India',
    state: 'Gujarat',
    city: 'Ahmedabad',
    isVerified: true
  },
  {
    name: 'Rajesh Kumar',
    mobile: '9876543222',
    email: 'rajesh.kumar@example.com',
    password: 'password123',
    role: 'customer',
    location: 'Bangalore, Karnataka',
    region: 'South India',
    state: 'Karnataka',
    city: 'Bangalore',
    isVerified: true
  },
  {
    name: 'Sunita Sharma',
    mobile: '9876543223',
    email: 'sunita.sharma@example.com',
    password: 'password123',
    role: 'customer',
    location: 'Delhi, Delhi',
    region: 'North India',
    state: 'Delhi',
    city: 'Delhi',
    isVerified: true
  },
  {
    name: 'Vikram Verma',
    mobile: '9876543224',
    email: 'vikram.verma@example.com',
    password: 'password123',
    role: 'customer',
    location: 'Pune, Maharashtra',
    region: 'West India',
    state: 'Maharashtra',
    city: 'Pune',
    isVerified: true
  }
];

async function migrateUsers() {
  try {
    console.log('🚀 Starting comprehensive user migration...');

    // Clear existing users
    console.log('🗑️ Clearing existing users...');
    await supabaseAdmin.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert artisans
    console.log('👨‍🎨 Inserting artisans...');
    const createdArtisans = [];
    for (const artisanData of artisansData) {
      const password_hash = await bcrypt.hash(artisanData.password, 10);
      const { data, error } = await supabaseAdmin.from('users').insert({
        name: artisanData.name,
        mobile: artisanData.mobile,
        email: artisanData.email,
        password: password_hash,
        role: artisanData.role,
        location: artisanData.location,
        region: artisanData.region,
        state: artisanData.state,
        city: artisanData.city,
        craft: artisanData.craft,
        crafts: artisanData.crafts,
        experience: artisanData.experience,
        rating: artisanData.rating,
        review_count: artisanData.reviewCount,
        products_count: artisanData.productsCount,
        techniques: artisanData.techniques,
        specializations: artisanData.specializations,
        certifications: artisanData.certifications,
        languages: artisanData.languages,
        bio: artisanData.bio,
        workshop_offered: artisanData.workshopOffered,
        is_verified: artisanData.isVerified,
      }).select();
      if (error) throw error;
      createdArtisans.push(data[0]);
    }
    console.log(`✅ Inserted ${createdArtisans.length} artisans`);

    // Insert customers
    console.log('👥 Inserting customers...');
    const createdCustomers = [];
    for (const customerData of customersData) {
      const password_hash = await bcrypt.hash(customerData.password, 10);
      const { data, error } = await supabaseAdmin.from('users').insert({
        name: customerData.name,
        mobile: customerData.mobile,
        email: customerData.email,
        password: password_hash,
        role: customerData.role,
        location: customerData.location,
        region: customerData.region,
        state: customerData.state,
        city: customerData.city,
        is_verified: customerData.isVerified,
      }).select();
      if (error) throw error;
      createdCustomers.push(data[0]);
    }
    console.log(`✅ Inserted ${createdCustomers.length} customers`);

    console.log('🎉 User migration completed successfully!');
    return { artisans: createdArtisans, customers: createdCustomers };

  } catch (error) {
    console.error('❌ Error during user migration:', error);
    throw error;
  }
}

module.exports = { migrateUsers, artisansData, customersData };
