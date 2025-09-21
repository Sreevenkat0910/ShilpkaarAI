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
    mobile: '9876543225',
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
    mobile: '9876543217',
    password: 'password123',
    role: 'customer',
    email: 'amit@example.com',
    location: 'Mumbai, Maharashtra'
  },
  {
    name: 'Sneha Reddy',
    mobile: '9876543218',
    password: 'password123',
    role: 'customer',
    email: 'sneha@example.com',
    location: 'Bangalore, Karnataka'
  },
  {
    name: 'Priya Gupta',
    mobile: '9876543219',
    password: 'password123',
    role: 'customer',
    email: 'priya.gupta@example.com',
    location: 'Delhi, Delhi'
  },
  {
    name: 'Rahul Sharma',
    mobile: '9876543220',
    password: 'password123',
    role: 'customer',
    email: 'rahul@example.com',
    location: 'Pune, Maharashtra'
  }
];

// ALL PRODUCTS FROM ORIGINAL MONGODB SEED FILE
const allProducts = [
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
    careInstructions: 'Dry clean only. Store in a cool, dry place. Avoid direct sunlight.',
    artisan_name: 'Priya Sharma',
    rating: 4.9,
    review_count: 234
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
    careInstructions: 'Machine wash cold. Air dry. Iron on low heat.',
    artisan_name: 'Kavitha Reddy',
    rating: 4.7,
    review_count: 156
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
    materials: ['Pure Wool', 'Traditional Patterns', 'Natural Dyes'],
    artisan_name: 'Priya Sharma',
    rating: 4.8,
    review_count: 189
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
    materials: ['Clay', 'Blue Glaze', 'Traditional Pigments'],
    artisan_name: 'Rajesh Kumar',
    rating: 4.8,
    review_count: 312
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
    materials: ['Sterling Silver', 'Traditional Wire'],
    artisan_name: 'Anita Verma',
    rating: 4.9,
    review_count: 267
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
    materials: ['Teak Wood', 'Natural Finish'],
    artisan_name: 'Vikram Singh',
    rating: 4.7,
    review_count: 178
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
    materials: ['Pure Cotton', 'Natural Dyes', 'Block Print'],
    artisan_name: 'Kavitha Reddy',
    rating: 4.6,
    review_count: 123
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
    materials: ['Handmade Paper', 'Natural Colors', 'Traditional Brushes'],
    artisan_name: 'Sunita Devi',
    rating: 4.9,
    review_count: 356
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
    materials: ['Brass', 'Traditional Engravings', 'Natural Finish'],
    artisan_name: 'Hari Prasad',
    rating: 4.6,
    review_count: 167
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
    materials: ['Brass', 'Traditional Engravings', 'Natural Finish'],
    artisan_name: 'Hari Prasad',
    rating: 4.6,
    review_count: 167
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
    materials: ['Sterling Silver', 'Traditional Wire'],
    artisan_name: 'Anita Verma',
    rating: 4.8,
    review_count: 189
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
    materials: ['Clay', 'Natural Finish', 'Traditional Designs'],
    artisan_name: 'Rajesh Kumar',
    rating: 4.5,
    review_count: 145
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
    materials: ['Pure Cotton', 'Traditional Patterns', 'Natural Dyes'],
    artisan_name: 'Priya Sharma',
    rating: 4.5,
    review_count: 89
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
    materials: ['Teak Wood', 'Natural Finish', 'Traditional Carving'],
    artisan_name: 'Vikram Singh',
    rating: 4.7,
    review_count: 156
  }
];

async function migrateCompleteData() {
  try {
    console.log('🚀 Starting COMPLETE data migration from MongoDB to Supabase...');
    console.log('This will migrate ALL original MongoDB data:');
    console.log('- All users (artisans + customers)');
    console.log('- All products with proper categorization');
    console.log('- All relationships and data integrity');
    console.log('');

    // Step 1: Migrate all users
    console.log('📋 Step 1: Migrating ALL users from MongoDB seed...');
    
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

    // Step 2: Migrate all products
    console.log('\n📋 Step 2: Migrating ALL products from MongoDB seed...');
    
    // Clear existing products
    console.log('🗑️ Clearing existing products...');
    await supabaseAdmin.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert all products
    console.log('🛍️ Inserting all products...');
    const createdProducts = [];
    
    for (let i = 0; i < allProducts.length; i++) {
      const productData = allProducts[i];
      
      // Find artisan by name
      const artisan = artisans.find(a => a.name === productData.artisan_name);
      if (!artisan) {
        console.log(`⚠️ Artisan not found for product: ${productData.name}`);
        continue;
      }
      
      const productInsert = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        original_price: productData.originalPrice,
        images: productData.images,
        category: productData.category,
        subcategory: productData.subcategory,
        craft: productData.craft,
        stock: productData.stock,
        tags: productData.tags,
        materials: productData.materials,
        color: productData.color,
        size: productData.size,
        condition: productData.condition,
        availability: productData.availability,
        featured: productData.featured,
        trending: productData.trending,
        search_keywords: productData.searchKeywords,
        dimensions: productData.dimensions,
        weight: productData.weight,
        craft_story: productData.craftStory,
        care_instructions: productData.careInstructions,
        artisan_id: artisan.id,
        artisan_name: artisan.name,
        rating: productData.rating,
        review_count: productData.review_count,
      };
      
      const { data: product, error } = await supabaseAdmin.from('products').insert(productInsert).select();
      if (error) throw error;
      createdProducts.push(product[0]);
    }

    console.log(`✅ Successfully inserted ${createdProducts.length} products`);

    // Summary by category
    const categorySummary = {};
    allProducts.forEach(product => {
      categorySummary[product.category] = (categorySummary[product.category] || 0) + 1;
    });

    console.log('\n📊 Products by Category:');
    Object.entries(categorySummary).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} products`);
    });

    console.log('\n🎉 COMPLETE data migration successful!');
    console.log('\n📋 Final Summary:');
    console.log(`✅ Artisans: ${artisans.length}`);
    console.log(`✅ Customers: ${customers.length}`);
    console.log(`✅ Products: ${createdProducts.length}`);

    console.log('\n👥 Sample Accounts:');
    console.log('Artisans:');
    artisans.slice(0, 3).forEach(artisan => {
      console.log(`  - ${artisan.name}: ${artisan.mobile} / password123`);
    });

    console.log('Customers:');
    customers.slice(0, 3).forEach(customer => {
      console.log(`  - ${customer.name}: ${customer.mobile} / password123`);
    });

    console.log('\n✨ Your Supabase database now has ALL the original MongoDB data!');
    console.log('🔗 Set the Supabase environment variables in Vercel to use this data.');

  } catch (error) {
    console.error('❌ Complete migration failed:', error);
    throw error;
  }
}

migrateCompleteData();
