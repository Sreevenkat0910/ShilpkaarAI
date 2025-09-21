const { migrateUsers } = require('./migrate-users-complete');
const { migrateProducts } = require('./migrate-products-extended');
const { migrateOrdersAndFavorites } = require('./migrate-orders-favorites');

async function runCompleteMigration() {
  try {
    console.log('🚀 Starting complete ShilpkaarAI data migration...');
    console.log('This will create:');
    console.log('- 10 Artisans with detailed profiles');
    console.log('- 5 Customers');
    console.log('- 30+ Products across 7 categories');
    console.log('- Past orders for customers');
    console.log('- Favorites for customers');
    console.log('- Product reviews');
    console.log('');

    // Step 1: Migrate users (artisans and customers)
    console.log('📋 Step 1: Migrating users...');
    const { artisans, customers } = await migrateUsers();
    
    // Step 2: Migrate products
    console.log('\n📋 Step 2: Migrating products...');
    const products = await migrateProducts(artisans);
    
    // Step 3: Migrate orders, favorites, and reviews
    console.log('\n📋 Step 3: Migrating orders, favorites, and reviews...');
    const { orders, favorites, reviews } = await migrateOrdersAndFavorites(customers, products);

    console.log('\n🎉 Complete migration successful!');
    console.log('\n📊 Final Summary:');
    console.log(`✅ Artisans: ${artisans.length}`);
    console.log(`✅ Customers: ${customers.length}`);
    console.log(`✅ Products: ${products.length}`);
    console.log(`✅ Orders: ${orders.length}`);
    console.log(`✅ Favorites: ${favorites.length}`);
    console.log(`✅ Reviews: ${reviews.length}`);

    console.log('\n👥 Sample Accounts:');
    console.log('Artisans:');
    artisans.slice(0, 3).forEach(artisan => {
      console.log(`  - ${artisan.name}: ${artisan.mobile} / password123`);
    });

    console.log('Customers:');
    customers.slice(0, 3).forEach(customer => {
      console.log(`  - ${customer.name}: ${customer.mobile} / password123`);
    });

    console.log('\n🛍️ Product Categories:');
    const categorySummary = {};
    products.forEach(product => {
      categorySummary[product.category] = (categorySummary[product.category] || 0) + 1;
    });
    Object.entries(categorySummary).forEach(([category, count]) => {
      console.log(`  - ${category}: ${count} products`);
    });

    console.log('\n✨ Your marketplace is now fully populated with real data!');
    console.log('🔗 Set the Supabase environment variables in Vercel to use this data.');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

runCompleteMigration();
