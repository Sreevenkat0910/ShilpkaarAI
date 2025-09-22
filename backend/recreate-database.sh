#!/bin/bash

# =====================================================
# SHILPKAARAI DATABASE RECREATION SCRIPT
# =====================================================
# This script will completely recreate the MongoDB database
# Run this script from the backend directory

echo "🚀 Starting ShilpkaarAI Database Recreation..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "❌ MongoDB is not running. Please start MongoDB first."
    echo "   On macOS: brew services start mongodb-community"
    echo "   On Ubuntu: sudo systemctl start mongod"
    exit 1
fi

echo "✅ MongoDB is running"

# Set database name
DB_NAME="shilpkaarai"

echo "🗑️  Dropping existing database: $DB_NAME"
mongosh --eval "use $DB_NAME; db.dropDatabase()" --quiet

echo "📊 Creating new database and collections..."

# Create collections with validation
mongosh --eval "
use $DB_NAME;

// Users Collection
db.createCollection('users', {
  validator: {
    \$jsonSchema: {
      bsonType: 'object',
      required: ['name', 'mobile', 'password', 'role'],
      properties: {
        name: { bsonType: 'string', minLength: 2, maxLength: 100 },
        mobile: { bsonType: 'string', pattern: '^[0-9]{10}$' },
        email: { bsonType: 'string', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}$' },
        password: { bsonType: 'string', minLength: 6 },
        role: { bsonType: 'string', enum: ['customer', 'artisan'] },
        isVerified: { bsonType: 'bool' },
        rating: { bsonType: 'number', minimum: 0, maximum: 5 },
        experience: { bsonType: 'number', minimum: 0 },
        productsCount: { bsonType: 'number', minimum: 0 },
        reviewCount: { bsonType: 'number', minimum: 0 }
      }
    }
  }
});

// Products Collection
db.createCollection('products', {
  validator: {
    \$jsonSchema: {
      bsonType: 'object',
      required: ['name', 'description', 'price', 'category', 'artisan', 'artisanName', 'images'],
      properties: {
        name: { bsonType: 'string', minLength: 2, maxLength: 200 },
        description: { bsonType: 'string', minLength: 10, maxLength: 2000 },
        price: { bsonType: 'number', minimum: 0 },
        originalPrice: { bsonType: 'number', minimum: 0 },
        category: { bsonType: 'string', minLength: 1 },
        artisan: { bsonType: 'objectId' },
        artisanName: { bsonType: 'string', minLength: 1 },
        images: { bsonType: 'array', minItems: 1, items: { bsonType: 'string' } },
        stock: { bsonType: 'number', minimum: 0 },
        isActive: { bsonType: 'bool' },
        rating: { bsonType: 'number', minimum: 0, maximum: 5 },
        reviewCount: { bsonType: 'number', minimum: 0 },
        featured: { bsonType: 'bool' },
        trending: { bsonType: 'bool' }
      }
    }
  }
});

// Orders Collection
db.createCollection('orders', {
  validator: {
    \$jsonSchema: {
      bsonType: 'object',
      required: ['orderNumber', 'customer', 'items', 'totalAmount', 'shippingAddress'],
      properties: {
        orderNumber: { bsonType: 'string', pattern: '^SPK[0-9]{6}$' },
        customer: { bsonType: 'objectId' },
        items: {
          bsonType: 'array',
          minItems: 1,
          items: {
            bsonType: 'object',
            required: ['product', 'quantity', 'price'],
            properties: {
              product: { bsonType: 'objectId' },
              quantity: { bsonType: 'number', minimum: 1 },
              price: { bsonType: 'number', minimum: 0 }
            }
          }
        },
        totalAmount: { bsonType: 'number', minimum: 0 },
        status: { bsonType: 'string', enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] },
        paymentStatus: { bsonType: 'string', enum: ['pending', 'paid', 'failed', 'refunded'] },
        paymentMethod: { bsonType: 'string', enum: ['cod', 'online', 'wallet'] }
      }
    }
  }
});

// Reviews Collection
db.createCollection('reviews', {
  validator: {
    \$jsonSchema: {
      bsonType: 'object',
      required: ['product', 'user', 'userName', 'rating', 'comment'],
      properties: {
        product: { bsonType: 'objectId' },
        user: { bsonType: 'objectId' },
        userName: { bsonType: 'string', minLength: 1 },
        rating: { bsonType: 'number', minimum: 1, maximum: 5 },
        comment: { bsonType: 'string', minLength: 10, maxLength: 1000 },
        isVerified: { bsonType: 'bool' },
        helpful: { bsonType: 'number', minimum: 0 }
      }
    }
  }
});

// Favorites Collection
db.createCollection('favorites', {
  validator: {
    \$jsonSchema: {
      bsonType: 'object',
      required: ['user', 'product'],
      properties: {
        user: { bsonType: 'objectId' },
        product: { bsonType: 'objectId' },
        addedAt: { bsonType: 'date' }
      }
    }
  }
});

print('✅ Collections created successfully');
" --quiet

echo "🔍 Creating indexes for optimal performance..."

# Create indexes
mongosh --eval "
use $DB_NAME;

// Users Collection Indexes
db.users.createIndex({ 'mobile': 1 }, { unique: true });
db.users.createIndex({ 'email': 1 }, { sparse: true });
db.users.createIndex({ 'role': 1, 'isVerified': 1 });
db.users.createIndex({ 'role': 1, 'location': 1 });
db.users.createIndex({ 'role': 1, 'craft': 1 });
db.users.createIndex({ 'rating': -1 });
db.users.createIndex({ 'createdAt': -1 });

// Products Collection Indexes
db.products.createIndex({ 'artisan': 1, 'isActive': 1 });
db.products.createIndex({ 'category': 1, 'isActive': 1 });
db.products.createIndex({ 'artisan': 1, 'category': 1 });
db.products.createIndex({ 'price': 1, 'rating': 1 });
db.products.createIndex({ 'createdAt': -1, 'isActive': 1 });
db.products.createIndex({ 'featured': 1, 'isActive': 1 });
db.products.createIndex({ 'trending': 1, 'isActive': 1 });
db.products.createIndex({ 'rating': -1, 'isActive': 1 });

// Orders Collection Indexes
db.orders.createIndex({ 'orderNumber': 1 }, { unique: true });
db.orders.createIndex({ 'customer': 1, 'createdAt': -1 });
db.orders.createIndex({ 'status': 1, 'createdAt': -1 });
db.orders.createIndex({ 'paymentStatus': 1 });
db.orders.createIndex({ 'createdAt': -1 });

// Reviews Collection Indexes
db.reviews.createIndex({ 'product': 1, 'user': 1 }, { unique: true });
db.reviews.createIndex({ 'product': 1, 'rating': 1 });
db.reviews.createIndex({ 'user': 1, 'createdAt': -1 });
db.reviews.createIndex({ 'product': 1, 'createdAt': -1 });
db.reviews.createIndex({ 'rating': -1 });

// Favorites Collection Indexes
db.favorites.createIndex({ 'user': 1, 'product': 1 }, { unique: true });
db.favorites.createIndex({ 'user': 1, 'addedAt': -1 });
db.favorites.createIndex({ 'product': 1 });

print('✅ Indexes created successfully');
" --quiet

echo "📝 Creating text search indexes..."

# Create text search indexes
mongosh --eval "
use $DB_NAME;

// Text search index for artisans
db.users.createIndex({
  'name': 'text',
  'craft': 'text',
  'location': 'text',
  'region': 'text',
  'state': 'text',
  'city': 'text',
  'bio': 'text',
  'crafts': 'text',
  'techniques': 'text',
  'specializations': 'text',
  'certifications': 'text',
  'searchText': 'text'
}, {
  weights: {
    'name': 10,
    'craft': 8,
    'location': 6,
    'region': 5,
    'state': 4,
    'city': 4,
    'crafts': 3,
    'techniques': 3,
    'specializations': 3,
    'bio': 2,
    'certifications': 2,
    'searchText': 1
  },
  name: 'artisan_search_index'
});

// Text search index for products
db.products.createIndex({
  'name': 'text',
  'description': 'text',
  'category': 'text',
  'subcategory': 'text',
  'craft': 'text',
  'artisanName': 'text',
  'location': 'text',
  'region': 'text',
  'tags': 'text',
  'materials': 'text',
  'color': 'text',
  'technique': 'text',
  'occasion': 'text',
  'searchKeywords': 'text',
  'searchText': 'text'
}, {
  weights: {
    'name': 10,
    'category': 8,
    'subcategory': 6,
    'craft': 6,
    'artisanName': 5,
    'tags': 4,
    'materials': 3,
    'description': 2,
    'searchKeywords': 3,
    'searchText': 1
  },
  name: 'product_search_index'
});

print('✅ Text search indexes created successfully');
" --quiet

echo "📊 Verifying database setup..."

# Verify setup
mongosh --eval "
use $DB_NAME;

print('📋 Collections:');
db.getCollectionNames().forEach(function(collection) {
  print('  - ' + collection);
});

print('\\n🔍 Indexes:');
db.users.getIndexes().forEach(function(index) {
  print('  users: ' + index.name);
});
db.products.getIndexes().forEach(function(index) {
  print('  products: ' + index.name);
});
db.orders.getIndexes().forEach(function(index) {
  print('  orders: ' + index.name);
});
db.reviews.getIndexes().forEach(function(index) {
  print('  reviews: ' + index.name);
});
db.favorites.getIndexes().forEach(function(index) {
  print('  favorites: ' + index.name);
});

print('\\n📈 Database stats:');
print('  Users: ' + db.users.countDocuments());
print('  Products: ' + db.products.countDocuments());
print('  Orders: ' + db.orders.countDocuments());
print('  Reviews: ' + db.reviews.countDocuments());
print('  Favorites: ' + db.favorites.countDocuments());
" --quiet

echo ""
echo "✅ Database recreation completed successfully!"
echo "📊 Database: $DB_NAME"
echo "🔍 Collections: users, products, orders, reviews, favorites"
echo "📝 Indexes: Created for optimal performance"
echo "🚀 Database is ready for use!"
echo ""
echo "Next steps:"
echo "1. Start the backend server: npm run dev"
echo "2. Test the API endpoints"
echo "3. Seed sample data if needed"
echo ""
