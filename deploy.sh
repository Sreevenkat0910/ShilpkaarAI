#!/bin/bash

# ShilpkaarAI Deployment Script
# This script helps you deploy your app to Supabase + Vercel

echo "🚀 ShilpkaarAI Deployment Script"
echo "================================="

# Check if required tools are installed
check_tool() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed. Please install it first."
        exit 1
    else
        echo "✅ $1 is installed"
    fi
}

echo "📋 Checking prerequisites..."
check_tool "node"
check_tool "npm"
check_tool "git"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Please run this script from the ShilpkaarAI root directory"
    exit 1
fi

echo "✅ Project structure looks good"

# Install dependencies
echo "📦 Installing dependencies..."
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

echo "✅ Dependencies installed"

# Build frontend
echo "🔨 Building frontend..."
cd frontend && npm run build && cd ..

if [ $? -eq 0 ]; then
    echo "✅ Frontend built successfully"
else
    echo "❌ Frontend build failed"
    exit 1
fi

# Check if .env files exist
echo "🔍 Checking environment configuration..."

if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env not found. Please create it with your Supabase credentials:"
    echo "   SUPABASE_URL=your_supabase_url"
    echo "   SUPABASE_ANON_KEY=your_supabase_anon_key"
    echo "   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key"
    echo "   FRONTEND_URL=https://your-frontend-app.vercel.app"
    echo ""
    echo "   You can copy from backend/env.example"
fi

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo ""
echo "1. 📊 Set up Supabase:"
echo "   - Go to https://supabase.com"
echo "   - Create a new project"
echo "   - Run the SQL from supabase-schema.sql in SQL Editor"
echo "   - Get your credentials from Settings → API"
echo ""
echo "2. 🌐 Deploy Frontend to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Import your GitHub repository"
echo "   - Set Root Directory to 'frontend'"
echo "   - Add environment variable: VITE_API_URL=https://your-backend-url.vercel.app"
echo "   - Deploy!"
echo ""
echo "3. ⚙️ Deploy Backend to Vercel:"
echo "   - Create another Vercel project"
echo "   - Set Root Directory to 'backend'"
echo "   - Add environment variables:"
echo "     - SUPABASE_URL=your_supabase_url"
echo "     - SUPABASE_ANON_KEY=your_supabase_anon_key"
echo "     - SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key"
echo "     - FRONTEND_URL=https://your-frontend-url.vercel.app"
echo "   - Deploy!"
echo ""
echo "4. 🔄 Update Frontend API URL:"
echo "   - Update VITE_API_URL in Vercel dashboard"
echo "   - Redeploy frontend"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo ""
echo "🎉 Your app will be completely free forever!"
echo "   - Frontend: Vercel (free)"
echo "   - Backend: Vercel (free)"
echo "   - Database: Supabase (free)"
echo "   - Storage: Supabase (free)"
echo ""
echo "Total cost: ₹0 🚀"
