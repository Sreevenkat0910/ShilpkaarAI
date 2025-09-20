# 🎨 ShilpkaarAI - Artisan Marketplace Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-18-blue" alt="React 18">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/Node.js-Express-green" alt="Node.js">
  <img src="https://img.shields.io/badge/MongoDB-Database-green" alt="MongoDB">
  <img src="https://img.shields.io/badge/Tailwind-CSS-blue" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Vite-Build-purple" alt="Vite">
</div>

## 🌟 Overview

**ShilpkaarAI** is a modern, AI-powered marketplace platform that connects skilled Indian artisans with customers worldwide. Built with cutting-edge technology, it provides a seamless experience for both artisans to showcase their crafts and customers to discover authentic handcrafted treasures.

### 🎯 Mission
To preserve and promote traditional Indian craftsmanship while providing artisans with modern tools to grow their business and reach global markets.

## ✨ Key Features

### 🔐 **Authentication System**
- **Mobile-based Login**: Secure authentication using mobile numbers
- **Role-based Access**: Separate dashboards for customers and artisans
- **JWT Token Security**: Secure session management
- **Profile Management**: Complete user profile with verification system

### 🛍️ **Customer Experience**
- **Product Discovery**: Browse handcrafted items by category
- **Advanced Search**: Find products by name, description, or artisan
- **Shopping Cart**: Add items, manage quantities, and checkout
- **Order Tracking**: Real-time order status updates
- **Favorites**: Save favorite products for later
- **Responsive Design**: Mobile-first approach for all devices

### 🎨 **Artisan Dashboard**
- **Product Management**: Add, edit, and manage product listings
- **Order Management**: Track customer orders and update status
- **Analytics**: View sales performance and customer insights
- **AI Tools**: Leverage AI for product descriptions and marketing
- **Verification System**: Secure artisan verification process

### 🚀 **Technical Features**
- **Real-time Updates**: Live order tracking and notifications
- **Image Optimization**: High-quality product image handling
- **Category Filtering**: Dynamic product categorization
- **Inventory Management**: Stock tracking and management
- **Payment Integration**: Secure payment processing (COD/Online)

## 🏗️ Architecture

### **Frontend (React + TypeScript)**
```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── auth/           # Authentication components
│   │   ├── artisan/        # Artisan-specific components
│   │   ├── customer/       # Customer-specific components
│   │   ├── marketplace/    # Product browsing components
│   │   ├── cart/          # Shopping cart components
│   │   └── ui/            # Reusable UI components
│   ├── stores/            # Zustand state management
│   └── styles/            # CSS and styling
```

### **Backend (Node.js + Express)**
```
backend/
├── models/                 # MongoDB models
│   ├── User.js           # User/Artisan profiles
│   ├── Product.js        # Product catalog
│   └── Order.js          # Order management
├── routes/               # API endpoints
│   ├── auth.js          # Authentication routes
│   ├── products.js      # Product management
│   ├── orders.js        # Order processing
│   └── profile.js       # User profiles
└── middleware/          # Authentication middleware
```

## 🛠️ Tech Stack

### **Frontend Technologies**
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Zustand** - Lightweight state management
- **React Hot Toast** - Beautiful notifications
- **React Router** - Client-side routing

### **Backend Technologies**
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing

### **Development Tools**
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Nodemon** - Development server auto-restart

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5 or higher)

### Installation

1. **Download the project**
```bash
# Download and extract the project files
cd ShilpkaarAI
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

3. **Setup Frontend**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

4. **Seed Database**
```bash
cd backend
node seed.js
```

### Environment Variables

**Backend (.env)**
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/shilpkaarai
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5001/api
```

## 🔐 Test Accounts

### **Customer Accounts**
| Name | Mobile | Password | Location |
|------|--------|----------|----------|
| Amit Singh | 9876543213 | password123 | Mumbai, Maharashtra |
| Sneha Reddy | 9876543214 | password123 | Bangalore, Karnataka |

### **Artisan Accounts**
| Name | Mobile | Password | Craft | Location |
|------|--------|----------|-------|----------|
| Priya Sharma | 9876543210 | password123 | Textile Weaving | Varanasi, UP |
| Rajesh Kumar | 9876543211 | password123 | Blue Pottery | Jaipur, Rajasthan |
| Meera Patel | 9876543212 | password123 | Jewelry Making | Surat, Gujarat |

## 📱 API Endpoints

### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### **Products**
- `GET /api/products/all` - Get all products
- `GET /api/products/one` - Get single product
- `GET /api/products/category` - Get products by category
- `GET /api/products/categories/all` - Get all categories
- `POST /api/products` - Create product (Artisan only)
- `PUT /api/products/:id` - Update product (Artisan only)
- `DELETE /api/products/:id` - Delete product (Artisan only)

### **Orders**
- `POST /api/orders` - Create new order
- `GET /api/orders/myorders` - Get customer orders
- `GET /api/orders/artisan/allorders` - Get artisan orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status

### **Profile**
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `PUT /api/profile/verify` - Verify artisan
- `DELETE /api/profile` - Delete account

## 🎨 Sample Products

The platform includes a curated collection of authentic handcrafted items:

- **Handwoven Banarasi Silk Saree** - Traditional textile artistry
- **Blue Pottery Dinner Set** - Jaipur's famous blue pottery
- **Silver Filigree Earrings** - Intricate jewelry craftsmanship
- **Wooden Hand Carved Bowl Set** - Sustainable teak wood bowls
- **Handwoven Cotton Kurta** - Traditional block-printed clothing

## 🔄 Development Workflow

### **Backend Development**
```bash
cd backend
npm run dev          # Start development server
npm start           # Start production server
node seed.js        # Seed database with sample data
```

### **Frontend Development**
```bash
cd frontend
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

## 📊 Database Schema

### **Users Collection**
```javascript
{
  name: String,
  mobile: String (unique),
  email: String (optional),
  password: String (hashed),
  role: String (customer/artisan),
  isVerified: Boolean,
  location: String,
  craft: String (for artisans),
  experience: Number (for artisans)
}
```

### **Products Collection**
```javascript
{
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  images: [String],
  category: String,
  artisan: ObjectId (ref: User),
  artisanName: String,
  stock: Number,
  isActive: Boolean,
  tags: [String],
  materials: [String]
}
```

### **Orders Collection**
```javascript
{
  orderNumber: String (unique),
  customer: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: String,
  shippingAddress: Object,
  paymentStatus: String,
  paymentMethod: String
}
```

## 🚀 Deployment

### **Backend Deployment**
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to Heroku, Vercel, or AWS
4. Set up domain and SSL

### **Frontend Deployment**
1. Build the production bundle
2. Deploy to Vercel, Netlify, or AWS S3
3. Configure environment variables
4. Set up custom domain

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Download the project files
2. Create your feature modifications
3. Test your changes thoroughly
4. Submit your improvements

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development**: React + TypeScript implementation
- **Backend Development**: Node.js + Express API
- **Database Design**: MongoDB schema and relationships
- **UI/UX Design**: Modern, responsive interface

## 🔮 Future Enhancements

- **AI-Powered Recommendations**: Machine learning for product suggestions
- **AR Product Visualization**: Augmented reality for product preview
- **Multi-language Support**: Regional language support
- **Advanced Analytics**: Detailed sales and customer analytics
- **Mobile App**: Native iOS and Android applications
- **Payment Gateway Integration**: Multiple payment options
- **Live Chat Support**: Real-time customer support
- **Social Features**: Reviews, ratings, and social sharing

## 📞 Support

For support and questions:
- Contact the development team
- Check the documentation

---

<div align="center">
  <p>Made with ❤️ for Indian Artisans</p>
  <p>© 2025 ShilpkaarAI. All rights reserved.</p>
</div>