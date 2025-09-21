const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function migrateOrdersAndFavorites(customers, products) {
  try {
    console.log('🚀 Starting orders and favorites migration...');

    // Clear existing data
    console.log('🗑️ Clearing existing orders and favorites...');
    await supabaseAdmin.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('favorites').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Create orders for customers
    console.log('📦 Creating orders...');
    const createdOrders = [];
    
    for (let i = 0; i < customers.length; i++) {
      const customer = customers[i];
      
      // Create 2-4 orders per customer
      const numOrders = Math.floor(Math.random() * 3) + 2;
      
      for (let j = 0; j < numOrders; j++) {
        // Select random products for this order
        const numItems = Math.floor(Math.random() * 3) + 1;
        const orderProducts = [];
        let totalAmount = 0;
        
        for (let k = 0; k < numItems; k++) {
          const product = products[Math.floor(Math.random() * products.length)];
          const quantity = Math.floor(Math.random() * 2) + 1;
          const itemTotal = product.price * quantity;
          totalAmount += itemTotal;
          
          orderProducts.push({
            product_id: product.id,
            quantity: quantity,
            price: product.price,
            product_name: product.name,
            product_image: product.images[0]
          });
        }
        
        // Random order status
        const statuses = ['delivered', 'shipped', 'confirmed', 'pending'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Random payment status
        const paymentStatuses = ['paid', 'pending'];
        const paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
        
        const orderData = {
          order_number: `SPK${String(Date.now() + Math.random() * 1000).slice(-6)}`,
          customer_id: customer.id,
          items: orderProducts,
          total_amount: totalAmount,
          status: status,
          payment_status: paymentStatus,
          shipping_address: {
            name: customer.name,
            mobile: customer.mobile,
            address: `${Math.floor(Math.random() * 100) + 1}, Main Street`,
            city: customer.city,
            state: customer.state,
            pincode: `${Math.floor(Math.random() * 900000) + 100000}`,
            country: 'India'
          }
        };
        
        const { data: order, error } = await supabaseAdmin.from('orders').insert(orderData).select();
        if (error) throw error;
        createdOrders.push(order[0]);
      }
    }

    console.log(`✅ Created ${createdOrders.length} orders`);

    // Create favorites for customers
    console.log('❤️ Creating favorites...');
    const createdFavorites = [];
    
    for (let i = 0; i < customers.length; i++) {
      const customer = customers[i];
      
      // Each customer favorites 3-8 products
      const numFavorites = Math.floor(Math.random() * 6) + 3;
      const favoriteProducts = [];
      
      // Select random products
      for (let j = 0; j < numFavorites; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        if (!favoriteProducts.find(p => p.id === product.id)) {
          favoriteProducts.push(product);
        }
      }
      
      // Create favorite entries
      for (const product of favoriteProducts) {
        const { data: favorite, error } = await supabaseAdmin.from('favorites').insert({
          user_id: customer.id,
          product_id: product.id,
          added_at: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000) // Random date within last 20 days
        }).select();
        
        if (error) throw error;
        createdFavorites.push(favorite[0]);
      }
    }

    console.log(`✅ Created ${createdFavorites.length} favorites`);

    // Create reviews for products
    console.log('⭐ Creating reviews...');
    const createdReviews = [];
    const reviewPairs = new Set(); // Track (product_id, user_id) pairs
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      // Each product gets 2-5 reviews
      const numReviews = Math.floor(Math.random() * 4) + 2;
      
      for (let j = 0; j < numReviews; j++) {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const reviewKey = `${product.id}-${customer.id}`;
        
        // Skip if this customer already reviewed this product
        if (reviewPairs.has(reviewKey)) {
          continue;
        }
        reviewPairs.add(reviewKey);
        
        const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars
        const comments = [
          'Excellent quality and craftsmanship!',
          'Beautiful product, highly recommended.',
          'Great value for money.',
          'Love the traditional design.',
          'Perfect for special occasions.',
          'Amazing attention to detail.',
          'Fast delivery and good packaging.',
          'Exceeded my expectations!'
        ];
        
        const { data: review, error } = await supabaseAdmin.from('reviews').insert({
          product_id: product.id,
          user_id: customer.id,
          user_name: customer.name,
          rating: rating,
          comment: comments[Math.floor(Math.random() * comments.length)],
          is_verified: true,
          helpful: Math.floor(Math.random() * 10)
        }).select();
        
        if (error) throw error;
        createdReviews.push(review[0]);
      }
    }

    console.log(`✅ Created ${createdReviews.length} reviews`);

    console.log('\n🎉 Orders, favorites, and reviews migration completed successfully!');
    
    return {
      orders: createdOrders,
      favorites: createdFavorites,
      reviews: createdReviews
    };

  } catch (error) {
    console.error('❌ Error during orders and favorites migration:', error);
    throw error;
  }
}

module.exports = { migrateOrdersAndFavorites };
