const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Comprehensive product data with proper categorization
const productsData = [
  // TEXTILES CATEGORY
  {
    name: 'Handwoven Banarasi Silk Saree',
    description: 'Exquisite handwoven Banarasi silk saree with intricate zari work and traditional motifs.',
    price: 2500,
    original_price: 3200,
    images: ['https://images.unsplash.com/photo-1632726733402-4a059a476028?w=400'],
    category: 'Textiles',
    subcategory: 'Sarees',
    craft: 'Silk Weaving',
    stock: 5,
    tags: ['silk', 'handwoven', 'traditional', 'banarasi', 'zari'],
    materials: ['Silk', 'Zari', 'Cotton'],
    color: ['Red', 'Gold'],
    size: 'One Size',
    condition: 'new',
    availability: 'in_stock',
    featured: true,
    trending: true,
    search_keywords: ['saree', 'banarasi', 'silk', 'handwoven', 'traditional', 'zari'],
    artisan_name: 'Priya Sharma',
    rating: 4.9,
    review_count: 234
  },
  {
    name: 'Cotton Handloom Kurta Set',
    description: 'Comfortable cotton handloom kurta with matching pyjama, perfect for daily wear.',
    price: 1200,
    original_price: 1500,
    images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400'],
    category: 'Textiles',
    subcategory: 'Kurtas',
    craft: 'Handloom Weaving',
    stock: 8,
    tags: ['cotton', 'handloom', 'kurta', 'comfortable'],
    materials: ['Cotton'],
    color: ['Blue', 'White'],
    size: 'M',
    condition: 'new',
    availability: 'in_stock',
    featured: false,
    trending: true,
    search_keywords: ['kurta', 'cotton', 'handloom', 'comfortable', 'daily wear'],
    artisan_name: 'Rajesh Kumar',
    rating: 4.7,
    review_count: 156
  },
  {
    name: 'Block Print Cotton Dupatta',
    description: 'Beautiful block print cotton dupatta with traditional Rajasthani patterns.',
    price: 450,
    original_price: 600,
    images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400'],
    category: 'Textiles',
    subcategory: 'Dupattas',
    craft: 'Block Printing',
    stock: 12,
    tags: ['cotton', 'block print', 'dupatta', 'rajasthani'],
    materials: ['Cotton'],
    color: ['Yellow', 'Red'],
    size: 'One Size',
    condition: 'new',
    availability: 'in_stock',
    featured: false,
    trending: false,
    search_keywords: ['dupatta', 'block print', 'cotton', 'rajasthani', 'traditional'],
    artisan_name: 'Sunita Devi',
    rating: 4.5,
    review_count: 89
  },
  {
    name: 'Kanjeevaram Silk Saree',
    description: 'Luxurious Kanjeevaram silk saree with temple border and intricate pallu design.',
    price: 3500,
    original_price: 4200,
    images: ['https://images.unsplash.com/photo-1632726733402-4a059a476028?w=400'],
    category: 'Textiles',
    subcategory: 'Sarees',
    craft: 'Silk Weaving',
    stock: 3,
    tags: ['kanjeevaram', 'silk', 'temple border', 'luxury'],
    materials: ['Silk', 'Zari'],
    color: ['Green', 'Gold'],
    size: 'One Size',
    condition: 'new',
    availability: 'in_stock',
    featured: true,
    trending: true,
    search_keywords: ['kanjeevaram', 'silk', 'saree', 'temple border', 'luxury'],
    artisan_name: 'Priya Sharma',
    rating: 4.8,
    review_count: 198
  },

  // POTTERY CATEGORY
  {
    name: 'Blue Pottery Dinner Set',
    description: 'Beautiful blue pottery dinner set with traditional Jaipur blue glaze.',
    price: 1800,
    original_price: 2200,
    images: ['https://images.unsplash.com/photo-1716876995651-1ff85b65a6d9?w=400'],
    category: 'Pottery',
    subcategory: 'Dinnerware',
    craft: 'Blue Pottery',
    stock: 6,
    tags: ['blue pottery', 'dinner set', 'jaipur', 'traditional'],
    materials: ['Clay', 'Blue Glaze'],
    color: ['Blue', 'White'],
    size: 'Medium',
    condition: 'new',
    availability: 'in_stock',
    featured: true,
    trending: true,
    search_keywords: ['blue pottery', 'dinner set', 'jaipur', 'traditional', 'ceramic'],
    artisan_name: 'Rajesh Kumar',
    rating: 4.8,
    review_count: 312
  },
  {
    name: 'Terracotta Plant Pot Set',
    description: 'Eco-friendly terracotta plant pots perfect for indoor gardening.',
    price: 800,
    original_price: 1000,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
    category: 'Pottery',
    subcategory: 'Planters',
    craft: 'Terracotta',
    stock: 15,
    tags: ['terracotta', 'plant pot', 'eco-friendly', 'gardening'],
    materials: ['Terracotta Clay'],
    color: ['Brown', 'Red'],
    size: 'Small',
    condition: 'new',
    availability: 'in_stock',
    featured: false,
    trending: true,
    search_keywords: ['terracotta', 'plant pot', 'eco-friendly', 'gardening', 'indoor'],
    artisan_name: 'Manoj Singh',
    rating: 4.6,
    review_count: 145
  },
  {
    name: 'Decorative Ceramic Vase',
    description: 'Handcrafted decorative ceramic vase with intricate floral patterns.',
    price: 1200,
    original_price: 1500,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
    category: 'Pottery',
    subcategory: 'Decorative',
    craft: 'Ceramic',
    stock: 8,
    tags: ['ceramic', 'vase', 'decorative', 'floral'],
    materials: ['Ceramic', 'Glaze'],
    color: ['White', 'Blue'],
    size: 'Large',
    condition: 'new',
    availability: 'in_stock',
    featured: true,
    trending: false,
    search_keywords: ['ceramic', 'vase', 'decorative', 'floral', 'handcrafted'],
    artisan_name: 'Rajesh Kumar',
    rating: 4.7,
    review_count: 203
  },

  // JEWELRY CATEGORY
  {
    name: 'Silver Filigree Earrings',
    description: 'Delicate silver filigree earrings with traditional Indian craftsmanship.',
    price: 1500,
    original_price: 1800,
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'],
    category: 'Jewelry',
    subcategory: 'Earrings',
    craft: 'Filigree',
    stock: 10,
    tags: ['silver', 'filigree', 'earrings', 'traditional'],
    materials: ['Silver'],
    color: ['Silver'],
    size: 'One Size',
    condition: 'new',
    availability: 'in_stock',
    featured: true,
    trending: true,
    search_keywords: ['silver', 'filigree', 'earrings', 'traditional', 'jewelry'],
    artisan_name: 'Anita Verma',
    rating: 4.9,
    review_count: 267
  },
  {
    name: 'Gold Plated Necklace Set',
    description: 'Elegant gold plated necklace set with matching earrings and bracelet.',
    price: 2200,
    original_price: 2800,
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'],
    category: 'Jewelry',
    subcategory: 'Necklaces',
    craft: 'Gold Plating',
    stock: 4,
    tags: ['gold plated', 'necklace', 'set', 'elegant'],
    materials: ['Gold Plated', 'Base Metal'],
    color: ['Gold'],
    size: 'One Size',
    condition: 'new',
    availability: 'in_stock',
    featured: true,
    trending: true,
    search_keywords: ['gold plated', 'necklace', 'set', 'elegant', 'jewelry'],
    artisan_name: 'Anita Verma',
    rating: 4.8,
    review_count: 189
  },
  {
    name: 'Pearl Choker Necklace',
    description: 'Classic pearl choker necklace perfect for special occasions.',
    price: 1800,
    original_price: 2200,
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'],
    category: 'Jewelry',
    subcategory: 'Necklaces',
    craft: 'Pearl Stringing',
    stock: 6,
    tags: ['pearl', 'choker', 'necklace', 'classic'],
    materials: ['Pearls', 'Silver'],
    color: ['White', 'Silver'],
    size: 'One Size',
    condition: 'new',
    availability: 'in_stock',
    featured: false,
    trending: false,
    search_keywords: ['pearl', 'choker', 'necklace', 'classic', 'special occasion'],
    artisan_name: 'Anita Verma',
    rating: 4.6,
    review_count: 134
  },

  // WOODWORK CATEGORY
  {
    name: 'Handcarved Wooden Bowl Set',
    description: 'Beautiful handcarved wooden bowl set made from sustainable teak wood.',
    price: 1600,
    original_price: 2000,
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'],
    category: 'Woodwork',
    subcategory: 'Kitchenware',
    craft: 'Wood Carving',
    stock: 7,
    tags: ['wooden', 'handcarved', 'bowl', 'teak', 'sustainable'],
    materials: ['Teak Wood'],
    color: ['Brown'],
    size: 'Medium',
    condition: 'new',
    availability: 'in_stock',
    featured: true,
    trending: true,
    search_keywords: ['wooden', 'handcarved', 'bowl', 'teak', 'sustainable', 'kitchen'],
    artisan_name: 'Vikram Singh',
    rating: 4.7,
    review_count: 178
  },
  {
    name: 'Decorative Wooden Wall Art',
    description: 'Intricate decorative wooden wall art with traditional Indian motifs.',
    price: 2000,
    original_price: 2500,
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'],
    category: 'Woodwork',
    subcategory: 'Decorative',
    craft: 'Wood Carving',
    stock: 5,
    tags: ['wooden', 'wall art', 'decorative', 'traditional'],
    materials: ['Rose Wood'],
    color: ['Brown', 'Red'],
    size: 'Large',
    condition: 'new',
    availability: 'in_stock',
    featured: true,
    trending: false,
    search_keywords: ['wooden', 'wall art', 'decorative', 'traditional', 'motifs'],
    artisan_name: 'Vikram Singh',
    rating: 4.8,
    review_count: 156
  },
  {
    name: 'Bamboo Storage Basket',
    description: 'Eco-friendly bamboo storage basket perfect for organizing household items.',
    price: 900,
    original_price: 1200,
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'],
    category: 'Woodwork',
    subcategory: 'Storage',
    craft: 'Bamboo Weaving',
    stock: 12,
    tags: ['bamboo', 'storage', 'basket', 'eco-friendly'],
    materials: ['Bamboo'],
    color: ['Natural'],
    size: 'Large',
    condition: 'new',
    availability: 'in_stock',
    featured: false,
    trending: true,
    search_keywords: ['bamboo', 'storage', 'basket', 'eco-friendly', 'organizing'],
    artisan_name: 'Vikram Singh',
    rating: 4.5,
    review_count: 98
  },

  // METALWORK CATEGORY
  {
    name: 'Brass Decorative Plate',
    description: 'Handcrafted brass decorative plate with intricate engravings.',
    price: 1400,
    original_price: 1800,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
    category: 'Metalwork',
    subcategory: 'Decorative',
    craft: 'Brass Work',
    stock: 8,
    tags: ['brass', 'decorative', 'plate', 'engraved'],
    materials: ['Brass'],
    color: ['Gold'],
    size: 'Medium',
    condition: 'new',
    availability: 'in_stock',
    featured: true,
    trending: true,
    search_keywords: ['brass', 'decorative', 'plate', 'engraved', 'handcrafted'],
    artisan_name: 'Ramesh Kumar',
    rating: 4.6,
    review_count: 167
  },
  {
    name: 'Copper Water Bottle',
    description: 'Traditional copper water bottle with health benefits and beautiful design.',
    price: 1100,
    original_price: 1400,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
    category: 'Metalwork',
    subcategory: 'Kitchenware',
    craft: 'Copper Work',
    stock: 10,
    tags: ['copper', 'water bottle', 'health', 'traditional'],
    materials: ['Copper'],
    color: ['Copper'],
    size: 'Medium',
    condition: 'new',
    availability: 'in_stock',
    featured: false,
    trending: true,
    search_keywords: ['copper', 'water bottle', 'health', 'traditional', 'wellness'],
    artisan_name: 'Ramesh Kumar',
    rating: 4.7,
    review_count: 234
  },

  // LEATHER CATEGORY
  {
    name: 'Handcrafted Leather Wallet',
    description: 'Premium handcrafted leather wallet with traditional Indian design.',
    price: 1300,
    original_price: 1600,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'],
    category: 'Leather',
    subcategory: 'Accessories',
    craft: 'Leather Work',
    stock: 9,
    tags: ['leather', 'wallet', 'handcrafted', 'premium'],
    materials: ['Genuine Leather'],
    color: ['Brown'],
    size: 'One Size',
    condition: 'new',
    availability: 'in_stock',
    featured: true,
    trending: true,
    search_keywords: ['leather', 'wallet', 'handcrafted', 'premium', 'traditional'],
    artisan_name: 'Suresh Patel',
    rating: 4.8,
    review_count: 189
  },
  {
    name: 'Leather Handbag',
    description: 'Elegant leather handbag perfect for daily use with multiple compartments.',
    price: 2500,
    original_price: 3000,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'],
    category: 'Leather',
    subcategory: 'Bags',
    craft: 'Leather Work',
    stock: 6,
    tags: ['leather', 'handbag', 'elegant', 'daily use'],
    materials: ['Genuine Leather'],
    color: ['Black'],
    size: 'Medium',
    condition: 'new',
    availability: 'in_stock',
    featured: true,
    trending: false,
    search_keywords: ['leather', 'handbag', 'elegant', 'daily use', 'compartments'],
    artisan_name: 'Suresh Patel',
    rating: 4.7,
    review_count: 156
  },

  // STONE CATEGORY
  {
    name: 'Marble Decorative Bowl',
    description: 'Beautiful marble decorative bowl with intricate carvings.',
    price: 1800,
    original_price: 2200,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
    category: 'Stone',
    subcategory: 'Decorative',
    craft: 'Stone Carving',
    stock: 4,
    tags: ['marble', 'decorative', 'bowl', 'carved'],
    materials: ['Marble'],
    color: ['White'],
    size: 'Medium',
    condition: 'new',
    availability: 'in_stock',
    featured: true,
    trending: true,
    search_keywords: ['marble', 'decorative', 'bowl', 'carved', 'stone'],
    artisan_name: 'Mahesh Sharma',
    rating: 4.9,
    review_count: 198
  },
  {
    name: 'Granite Mortar and Pestle',
    description: 'Traditional granite mortar and pestle for grinding spices and herbs.',
    price: 1200,
    original_price: 1500,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
    category: 'Stone',
    subcategory: 'Kitchenware',
    craft: 'Stone Carving',
    stock: 8,
    tags: ['granite', 'mortar', 'pestle', 'spices', 'traditional'],
    materials: ['Granite'],
    color: ['Gray'],
    size: 'Medium',
    condition: 'new',
    availability: 'in_stock',
    featured: false,
    trending: true,
    search_keywords: ['granite', 'mortar', 'pestle', 'spices', 'traditional', 'grinding'],
    artisan_name: 'Mahesh Sharma',
    rating: 4.6,
    review_count: 145
  }
];

async function migrateProducts() {
  try {
    console.log('🚀 Starting comprehensive product migration...');

    // Clear existing products
    console.log('🗑️ Clearing existing products...');
    await supabaseAdmin.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Get artisans for product assignment
    const { data: artisans, error: artisanError } = await supabaseAdmin
      .from('users')
      .select('id, name')
      .eq('role', 'artisan');

    if (artisanError) throw artisanError;

    console.log(`📋 Found ${artisans.length} artisans`);

    // Insert products
    console.log('🛍️ Inserting products...');
    const createdProducts = [];
    
    for (let i = 0; i < productsData.length; i++) {
      const productData = productsData[i];
      
      // Assign artisan (cycle through available artisans)
      const artisan = artisans[i % artisans.length];
      
      const { data: product, error } = await supabaseAdmin.from('products').insert({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        original_price: productData.original_price,
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
        search_keywords: productData.search_keywords,
        artisan_id: artisan.id,
        artisan_name: artisan.name,
        rating: productData.rating,
        review_count: productData.review_count,
      }).select();

      if (error) throw error;
      createdProducts.push(product[0]);
    }

    console.log(`✅ Successfully inserted ${createdProducts.length} products`);

    // Summary by category
    const categorySummary = {};
    productsData.forEach(product => {
      categorySummary[product.category] = (categorySummary[product.category] || 0) + 1;
    });

    console.log('\n📊 Products by Category:');
    Object.entries(categorySummary).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} products`);
    });

    console.log('\n🎉 Product migration completed successfully!');
    console.log('\n📋 Sample Products:');
    createdProducts.slice(0, 5).forEach(product => {
      console.log(`  - ${product.name} (${product.category}) - ₹${product.price}`);
    });

  } catch (error) {
    console.error('❌ Error during product migration:', error);
  }
}

migrateProducts();
