# ShilpkaarAI Backend - Restructured & Optimized

## 🚀 Overview

This is the completely restructured backend for ShilpkaarAI, an artisan marketplace platform. The backend has been rebuilt from the ground up with proper error handling, validation, security, and performance optimizations.

## ✨ Features

### ✅ **FULLY FUNCTIONAL FEATURES**

#### **1. Authentication System**
- ✅ **User Registration** (Customer & Artisan)
- ✅ **User Login/Logout** with JWT tokens
- ✅ **JWT Token Management** with proper validation
- ✅ **Role-based Access Control** (Customer/Artisan)
- ✅ **Profile Management** with validation
- ✅ **Artisan Verification** system

#### **2. Product Management**
- ✅ **Product Creation** (Artisan dashboard)
- ✅ **Product Listing** (All products, by category)
- ✅ **Product Details** (Single product view)
- ✅ **Advanced Product Search & Filtering**
- ✅ **Category Management** with dynamic categories

#### **3. Order Management**
- ✅ **Order Creation** (Complete checkout process)
- ✅ **Order Tracking** (Customer & Artisan views)
- ✅ **Order Status Updates** with notifications
- ✅ **Order History** with pagination

#### **4. Cart & Checkout**
- ✅ **Add to Cart** (Local storage + backend sync)
- ✅ **Cart Management** (Quantity updates, removal)
- ✅ **Checkout Process** (Address, payment method)
- ✅ **Order Confirmation** with order numbers

#### **5. Reviews & Ratings**
- ✅ **Product Reviews** (Star ratings + comments)
- ✅ **Review Management** (Create, update, delete)
- ✅ **Average Rating Calculation** (Auto-updated)
- ✅ **Review Verification** system

#### **6. Favorites/Wishlist**
- ✅ **Add/Remove Favorites** (Toggle functionality)
- ✅ **Favorites Management** (View, sort, paginate)
- ✅ **Favorites Sync** (Cross-device synchronization)
- ✅ **Favorites Count** (Per product/user)

#### **7. Advanced Search & Filters**
- ✅ **Full-text Search** (Products & Artisans)
- ✅ **Server-side Filtering** (Price, location, category, rating)
- ✅ **Search Indexing** (Optimized for large datasets)
- ✅ **Filter Options** (Dynamic filter suggestions)

#### **8. Artisan Dashboard Analytics**
- ✅ **Live Sales Data** (Daily, weekly, monthly)
- ✅ **Order Analytics** (Total orders, revenue trends)
- ✅ **Product Performance** (Views, conversions, best-sellers)
- ✅ **Customer Insights** (Demographics, locations)
- ✅ **Inventory Management** (Stock alerts, recommendations)

## 🏗️ Architecture

### **Database Structure**
- **MongoDB** with proper indexing
- **Text Search** indexes for products and artisans
- **Compound Indexes** for optimal query performance
- **Data Validation** at database level

### **API Structure**
- **RESTful API** design
- **Consistent Response Format** across all endpoints
- **Proper HTTP Status Codes**
- **Comprehensive Error Handling**

### **Security Features**
- **JWT Authentication** with token validation
- **Role-based Access Control**
- **Input Validation** and sanitization
- **Rate Limiting** to prevent abuse
- **CORS Configuration** for frontend integration

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # Database connection & index management
├── middleware/
│   ├── auth.js              # Authentication & authorization middleware
│   └── validation.js        # Request validation & error handling
├── models/
│   ├── User.js              # User/Artisan model
│   ├── Product.js           # Product model
│   ├── Order.js             # Order model
│   ├── Review.js            # Review model
│   └── Favorite.js          # Favorite model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── products.js          # Product management routes
│   ├── orders.js            # Order management routes
│   ├── reviews.js           # Review management routes
│   ├── favorites.js          # Favorites management routes
│   ├── artisans.js          # Artisan management routes
│   ├── analytics.js         # Analytics & dashboard routes
│   └── profile.js           # Profile management routes
├── server.js                # Main server file
├── package.json             # Dependencies & scripts
├── env.example              # Environment variables template
├── recreate-database.sh     # Database recreation script
├── test-functionality.sh    # Comprehensive test script
└── database-recreation.sql  # SQL commands for database setup
```

## 🚀 Quick Start

### **1. Prerequisites**
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### **2. Installation**
```bash
# Clone the repository
git clone <repository-url>
cd ShilpkaarAI/backend

# Install dependencies
npm install

# Copy environment variables
cp env.example .env

# Edit .env file with your configuration
nano .env
```

### **3. Environment Configuration**
```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/shilpkaarai

# Server Configuration
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

### **4. Database Setup**
```bash
# Option 1: Use the automated script
./recreate-database.sh

# Option 2: Manual setup using MongoDB shell
mongosh < database-recreation.sql
```

### **5. Start the Server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### **6. Test Functionality**
```bash
# Run comprehensive tests
./test-functionality.sh

# Or test individual endpoints
curl http://localhost:5001/api/health
```

## 📚 API Documentation

### **Base URL**
```
http://localhost:5001/api
```

### **Authentication Endpoints**
```
POST /auth/register          # User registration
POST /auth/login             # User login
GET  /auth/me                # Get current user
POST /auth/logout            # User logout
```

### **Product Endpoints**
```
GET  /products/all           # Get all products
GET  /products/search        # Advanced product search
GET  /products/one            # Get single product
GET  /products/category       # Get products by category
GET  /products/categories/all # Get all categories
POST /products               # Create product (Artisan)
PUT  /products/:id           # Update product (Artisan)
DELETE /products/:id         # Delete product (Artisan)
```

### **Order Endpoints**
```
POST /orders                 # Create order
GET  /orders/myorders        # Get customer orders
GET  /orders/artisan/allorders # Get artisan orders
GET  /orders/:id             # Get single order
PUT  /orders/:id/status      # Update order status
```

### **Review Endpoints**
```
GET  /reviews/product/:id    # Get product reviews
GET  /reviews/product/:id/summary # Get review summary
POST /reviews                # Create review
PUT  /reviews/:id            # Update review
DELETE /reviews/:id          # Delete review
POST /reviews/:id/helpful    # Mark review as helpful
```

### **Favorites Endpoints**
```
GET  /favorites              # Get user favorites
POST /favorites/:id          # Add to favorites
DELETE /favorites/:id        # Remove from favorites
GET  /favorites/check/:id    # Check favorite status
POST /favorites/toggle/:id   # Toggle favorite status
```

### **Artisan Endpoints**
```
GET  /artisans/all           # Get all artisans
GET  /artisans/search        # Advanced artisan search
GET  /artisans/:id           # Get single artisan
GET  /artisans/crafts/all    # Get all crafts
GET  /artisans/locations/all # Get all locations
```

### **Analytics Endpoints**
```
GET  /analytics/overview           # Analytics overview
GET  /analytics/sales-trend        # Sales trend data
GET  /analytics/top-products       # Top performing products
GET  /analytics/category-performance # Category performance
GET  /analytics/customer-insights  # Customer insights
GET  /analytics/seasonal-trends   # Seasonal trends
GET  /analytics/recommendations    # AI recommendations
GET  /analytics/alerts            # Business alerts
GET  /analytics/inventory-insights # Inventory insights
```

### **Profile Endpoints**
```
GET  /profile                # Get user profile
PUT  /profile                # Update user profile
PUT  /profile/verify         # Verify artisan
DELETE /profile              # Delete account
```

## 🔧 Development

### **Available Scripts**
```bash
npm start                    # Start production server
npm run dev                  # Start development server with nodemon
npm run dev-mongo            # Start with MongoDB connection
```

### **Database Management**
```bash
# Recreate database (WARNING: Deletes all data)
./recreate-database.sh

# Test all functionality
./test-functionality.sh

# Manual database operations
mongosh
use shilpkaarai
# ... run MongoDB commands
```

### **Code Quality**
- **ESLint** configuration for code quality
- **Consistent Error Handling** across all routes
- **Input Validation** using express-validator
- **Async/Await** pattern for better error handling

## 🛡️ Security Features

### **Authentication & Authorization**
- JWT token-based authentication
- Role-based access control (Customer/Artisan)
- Token expiration and validation
- Password hashing with bcrypt

### **Input Validation**
- Request body validation
- Query parameter validation
- File upload validation
- SQL injection prevention

### **Rate Limiting**
- Configurable rate limits
- IP-based limiting
- Different limits for different endpoints

### **CORS Configuration**
- Configurable CORS origins
- Credential support
- Method and header restrictions

## 📊 Performance Optimizations

### **Database Optimizations**
- **Text Search Indexes** for full-text search
- **Compound Indexes** for complex queries
- **Query Optimization** with proper indexing
- **Connection Pooling** for better performance

### **API Optimizations**
- **Pagination** for large datasets
- **Response Compression** for large responses
- **Caching Headers** where appropriate
- **Async Operations** for better concurrency

## 🧪 Testing

### **Automated Testing**
```bash
# Run comprehensive functionality tests
./test-functionality.sh

# Test specific endpoints
curl -X GET http://localhost:5001/api/health
curl -X GET http://localhost:5001/api/products/all
```

### **Manual Testing**
- Use Postman or similar tools
- Test all CRUD operations
- Verify authentication flows
- Test error scenarios

## 🚀 Deployment

### **Production Checklist**
- [ ] Update environment variables
- [ ] Set up MongoDB Atlas or production MongoDB
- [ ] Configure CORS for production domain
- [ ] Set up SSL certificates
- [ ] Configure rate limiting for production
- [ ] Set up monitoring and logging
- [ ] Test all endpoints in production environment

### **Environment Variables for Production**
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shilpkaarai
FRONTEND_URL=https://your-domain.com
JWT_SECRET=your_production_jwt_secret
RATE_LIMIT_MAX_REQUESTS=100
```

## 🔍 Troubleshooting

### **Common Issues**

#### **Database Connection Issues**
```bash
# Check MongoDB status
brew services list | grep mongodb
# or
sudo systemctl status mongod

# Check connection string
echo $MONGODB_URI
```

#### **Authentication Issues**
- Verify JWT_SECRET is set
- Check token format in Authorization header
- Ensure user exists in database

#### **CORS Issues**
- Verify FRONTEND_URL in environment
- Check CORS configuration in server.js
- Ensure credentials are enabled

#### **Performance Issues**
- Check database indexes
- Monitor query performance
- Verify connection pooling

### **Debug Mode**
```bash
# Enable debug logging
DEBUG=* npm run dev

# Check specific module
DEBUG=express:router npm run dev
```

## 📈 Monitoring & Logging

### **Health Check**
```bash
curl http://localhost:5001/api/health
```

### **Logs**
- Request logging with timestamps
- Error logging with stack traces
- Database connection status
- Performance metrics

## 🤝 Contributing

### **Code Standards**
- Use async/await instead of callbacks
- Implement proper error handling
- Add input validation
- Write comprehensive tests
- Follow RESTful API conventions

### **Pull Request Process**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation
- Test with the provided test scripts

---

**🎉 Congratulations! Your ShilpkaarAI backend is now fully restructured and optimized for production use.**
