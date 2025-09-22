-- =====================================================
-- SHILPKAARAI DATABASE RECREATION COMMANDS
-- =====================================================
-- This script will completely recreate the MongoDB database
-- Run these commands in MongoDB shell or MongoDB Compass

-- =====================================================
-- STEP 1: DROP EXISTING DATABASE (CAREFUL!)
-- =====================================================
-- WARNING: This will delete ALL data in the database
-- Only run this if you want to start completely fresh

use shilpkaarai
db.dropDatabase()

-- =====================================================
-- STEP 2: CREATE NEW DATABASE AND COLLECTIONS
-- =====================================================

-- Switch to the database
use shilpkaarai

-- =====================================================
-- STEP 3: CREATE COLLECTIONS WITH VALIDATION RULES
-- =====================================================

-- Users Collection
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "mobile", "password", "role"],
      properties: {
        name: {
          bsonType: "string",
          minLength: 2,
          maxLength: 100
        },
        mobile: {
          bsonType: "string",
          pattern: "^[0-9]{10}$"
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        password: {
          bsonType: "string",
          minLength: 6
        },
        role: {
          bsonType: "string",
          enum: ["customer", "artisan"]
        },
        isVerified: {
          bsonType: "bool"
        },
        rating: {
          bsonType: "number",
          minimum: 0,
          maximum: 5
        },
        experience: {
          bsonType: "number",
          minimum: 0
        },
        productsCount: {
          bsonType: "number",
          minimum: 0
        },
        reviewCount: {
          bsonType: "number",
          minimum: 0
        }
      }
    }
  }
})

-- Products Collection
db.createCollection("products", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "description", "price", "category", "artisan", "artisanName", "images"],
      properties: {
        name: {
          bsonType: "string",
          minLength: 2,
          maxLength: 200
        },
        description: {
          bsonType: "string",
          minLength: 10,
          maxLength: 2000
        },
        price: {
          bsonType: "number",
          minimum: 0
        },
        originalPrice: {
          bsonType: "number",
          minimum: 0
        },
        category: {
          bsonType: "string",
          minLength: 1
        },
        artisan: {
          bsonType: "objectId"
        },
        artisanName: {
          bsonType: "string",
          minLength: 1
        },
        images: {
          bsonType: "array",
          minItems: 1,
          items: {
            bsonType: "string"
          }
        },
        stock: {
          bsonType: "number",
          minimum: 0
        },
        isActive: {
          bsonType: "bool"
        },
        rating: {
          bsonType: "number",
          minimum: 0,
          maximum: 5
        },
        reviewCount: {
          bsonType: "number",
          minimum: 0
        },
        featured: {
          bsonType: "bool"
        },
        trending: {
          bsonType: "bool"
        }
      }
    }
  }
})

-- Orders Collection
db.createCollection("orders", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["orderNumber", "customer", "items", "totalAmount", "shippingAddress"],
      properties: {
        orderNumber: {
          bsonType: "string",
          pattern: "^SPK[0-9]{6}$"
        },
        customer: {
          bsonType: "objectId"
        },
        items: {
          bsonType: "array",
          minItems: 1,
          items: {
            bsonType: "object",
            required: ["product", "quantity", "price"],
            properties: {
              product: {
                bsonType: "objectId"
              },
              quantity: {
                bsonType: "number",
                minimum: 1
              },
              price: {
                bsonType: "number",
                minimum: 0
              }
            }
          }
        },
        totalAmount: {
          bsonType: "number",
          minimum: 0
        },
        status: {
          bsonType: "string",
          enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"]
        },
        paymentStatus: {
          bsonType: "string",
          enum: ["pending", "paid", "failed", "refunded"]
        },
        paymentMethod: {
          bsonType: "string",
          enum: ["cod", "online", "wallet"]
        }
      }
    }
  }
})

-- Reviews Collection
db.createCollection("reviews", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["product", "user", "userName", "rating", "comment"],
      properties: {
        product: {
          bsonType: "objectId"
        },
        user: {
          bsonType: "objectId"
        },
        userName: {
          bsonType: "string",
          minLength: 1
        },
        rating: {
          bsonType: "number",
          minimum: 1,
          maximum: 5
        },
        comment: {
          bsonType: "string",
          minLength: 10,
          maxLength: 1000
        },
        isVerified: {
          bsonType: "bool"
        },
        helpful: {
          bsonType: "number",
          minimum: 0
        }
      }
    }
  }
})

-- Favorites Collection
db.createCollection("favorites", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user", "product"],
      properties: {
        user: {
          bsonType: "objectId"
        },
        product: {
          bsonType: "objectId"
        },
        addedAt: {
          bsonType: "date"
        }
      }
    }
  }
})

-- =====================================================
-- STEP 4: CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Users Collection Indexes
db.users.createIndex({ "mobile": 1 }, { unique: true })
db.users.createIndex({ "email": 1 }, { sparse: true })
db.users.createIndex({ "role": 1, "isVerified": 1 })
db.users.createIndex({ "role": 1, "location": 1 })
db.users.createIndex({ "role": 1, "craft": 1 })
db.users.createIndex({ "rating": -1 })
db.users.createIndex({ "createdAt": -1 })

-- Text search index for artisans
db.users.createIndex({
  "name": "text",
  "craft": "text",
  "location": "text",
  "region": "text",
  "state": "text",
  "city": "text",
  "bio": "text",
  "crafts": "text",
  "techniques": "text",
  "specializations": "text",
  "certifications": "text",
  "searchText": "text"
}, {
  weights: {
    "name": 10,
    "craft": 8,
    "location": 6,
    "region": 5,
    "state": 4,
    "city": 4,
    "crafts": 3,
    "techniques": 3,
    "specializations": 3,
    "bio": 2,
    "certifications": 2,
    "searchText": 1
  },
  name: "artisan_search_index"
})

-- Products Collection Indexes
db.products.createIndex({ "artisan": 1, "isActive": 1 })
db.products.createIndex({ "category": 1, "isActive": 1 })
db.products.createIndex({ "artisan": 1, "category": 1 })
db.products.createIndex({ "price": 1, "rating": 1 })
db.products.createIndex({ "createdAt": -1, "isActive": 1 })
db.products.createIndex({ "featured": 1, "isActive": 1 })
db.products.createIndex({ "trending": 1, "isActive": 1 })
db.products.createIndex({ "rating": -1, "isActive": 1 })

-- Text search index for products
db.products.createIndex({
  "name": "text",
  "description": "text",
  "category": "text",
  "subcategory": "text",
  "craft": "text",
  "artisanName": "text",
  "location": "text",
  "region": "text",
  "tags": "text",
  "materials": "text",
  "color": "text",
  "technique": "text",
  "occasion": "text",
  "searchKeywords": "text",
  "searchText": "text"
}, {
  weights: {
    "name": 10,
    "category": 8,
    "subcategory": 6,
    "craft": 6,
    "artisanName": 5,
    "tags": 4,
    "materials": 3,
    "description": 2,
    "searchKeywords": 3,
    "searchText": 1
  },
  name: "product_search_index"
})

-- Orders Collection Indexes
db.orders.createIndex({ "orderNumber": 1 }, { unique: true })
db.orders.createIndex({ "customer": 1, "createdAt": -1 })
db.orders.createIndex({ "status": 1, "createdAt": -1 })
db.orders.createIndex({ "paymentStatus": 1 })
db.orders.createIndex({ "createdAt": -1 })

-- Reviews Collection Indexes
db.reviews.createIndex({ "product": 1, "user": 1 }, { unique: true })
db.reviews.createIndex({ "product": 1, "rating": 1 })
db.reviews.createIndex({ "user": 1, "createdAt": -1 })
db.reviews.createIndex({ "product": 1, "createdAt": -1 })
db.reviews.createIndex({ "rating": -1 })

-- Favorites Collection Indexes
db.favorites.createIndex({ "user": 1, "product": 1 }, { unique: true })
db.favorites.createIndex({ "user": 1, "addedAt": -1 })
db.favorites.createIndex({ "product": 1 })

-- =====================================================
-- STEP 5: INSERT SAMPLE DATA (OPTIONAL)
-- =====================================================

-- Sample Users
db.users.insertMany([
  {
    "name": "Rajesh Kumar",
    "mobile": "9876543210",
    "email": "rajesh@example.com",
    "password": "$2a$10$example_hash_here",
    "role": "artisan",
    "isVerified": true,
    "location": "Jaipur, Rajasthan",
    "region": "North India",
    "state": "Rajasthan",
    "city": "Jaipur",
    "craft": "Pottery",
    "crafts": ["Pottery", "Ceramics"],
    "experience": 15,
    "rating": 4.8,
    "reviewCount": 45,
    "productsCount": 12,
    "techniques": ["Hand Throwing", "Glazing"],
    "specializations": ["Traditional Pottery", "Modern Ceramics"],
    "bio": "Master potter with 15 years of experience in traditional Rajasthani pottery",
    "workshopOffered": true,
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "name": "Priya Sharma",
    "mobile": "9876543211",
    "email": "priya@example.com",
    "password": "$2a$10$example_hash_here",
    "role": "customer",
    "isVerified": false,
    "location": "Mumbai, Maharashtra",
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
])

-- Sample Products
db.products.insertMany([
  {
    "name": "Traditional Rajasthani Pottery Vase",
    "description": "Beautiful handcrafted pottery vase made using traditional techniques passed down through generations",
    "price": 2500,
    "originalPrice": 3000,
    "images": [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500"
    ],
    "category": "Home Decor",
    "subcategory": "Vases",
    "artisan": ObjectId(), // Replace with actual artisan ID
    "artisanName": "Rajesh Kumar",
    "stock": 5,
    "isActive": true,
    "tags": ["Traditional", "Handmade", "Rajasthani"],
    "materials": ["Clay", "Natural Dyes"],
    "color": ["Terracotta", "Brown"],
    "technique": ["Hand Throwing"],
    "craft": "Pottery",
    "location": "Jaipur, Rajasthan",
    "region": "North India",
    "rating": 4.8,
    "reviewCount": 12,
    "featured": true,
    "trending": false,
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
])

-- =====================================================
-- STEP 6: VERIFY DATABASE SETUP
-- =====================================================

-- Check collections
show collections

-- Check indexes
db.users.getIndexes()
db.products.getIndexes()
db.orders.getIndexes()
db.reviews.getIndexes()
db.favorites.getIndexes()

-- Check sample data
db.users.find().limit(5)
db.products.find().limit(5)

-- =====================================================
-- STEP 7: BACKUP COMMANDS (FOR FUTURE REFERENCE)
-- =====================================================

-- Create backup
-- mongodump --db shilpkaarai --out /path/to/backup

-- Restore from backup
-- mongorestore --db shilpkaarai /path/to/backup/shilpkaarai

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

print("✅ Database recreation completed successfully!")
print("📊 Collections created: users, products, orders, reviews, favorites")
print("🔍 Indexes created for optimal performance")
print("📝 Sample data inserted (optional)")
print("🚀 Database is ready for use!")
