const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Checking Supabase connection...');
console.log('SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing');

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Supabase environment variables are missing!');
  console.log('Please set these in Vercel:');
  console.log('1. SUPABASE_URL=https://ligdkkmdyhzzxkmvvhfb.supabase.co');
  console.log('2. SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZ2Rra22keWh6enhrbXZ2aGZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODQ2OTE2MCwiZXhwIjoyMDc0MDQ1MTYwfQ.xUoTElTgu4d06FcPUuka6dzfAqFyH8JacqH8eXDEUUY');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  try {
    console.log('🧪 Testing Supabase connection...');
    
    // Test products query
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('id, name, category')
      .limit(5);
    
    if (error) {
      console.log('❌ Supabase query error:', error.message);
      return;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log(`📊 Found ${products.length} products:`);
    products.forEach(product => {
      console.log(`  - ${product.name} (${product.category})`);
    });
    
    // Test category filtering
    console.log('\n🔍 Testing category filtering...');
    const { data: textiles, error: textileError } = await supabaseAdmin
      .from('products')
      .select('name, category')
      .eq('category', 'Textiles');
    
    if (textileError) {
      console.log('❌ Category filter error:', textileError.message);
      return;
    }
    
    console.log(`✅ Found ${textiles.length} Textiles products:`);
    textiles.forEach(product => {
      console.log(`  - ${product.name}`);
    });
    
  } catch (error) {
    console.log('❌ Connection test failed:', error.message);
  }
}

testConnection();
