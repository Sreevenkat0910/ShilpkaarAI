#!/bin/bash

# =====================================================
# SUPABASE DATABASE RECREATION SCRIPT
# =====================================================
# This script helps you recreate your Supabase database
# Run this after updating your Supabase project

echo "🚀 Supabase Database Recreation Script"
echo "======================================"

# Check if SQL file exists
if [ ! -f "supabase-recreation.sql" ]; then
    echo "❌ Error: supabase-recreation.sql not found!"
    echo "Please make sure the SQL file is in the current directory."
    exit 1
fi

echo "📋 Instructions:"
echo "1. Go to your Supabase project dashboard"
echo "2. Navigate to SQL Editor"
echo "3. Copy and paste the contents of supabase-recreation.sql"
echo "4. Run the SQL commands"
echo ""
echo "⚠️  WARNING: This will DELETE ALL existing data!"
echo "Make sure you have backups if needed."
echo ""
echo "📁 SQL file location: $(pwd)/supabase-recreation.sql"
echo ""
echo "🔗 Supabase Dashboard: https://supabase.com/dashboard"
echo ""
echo "After running the SQL commands:"
echo "1. Update your .env file with Supabase credentials"
echo "2. Run: npm install"
echo "3. Run: npm run dev"
echo "4. Test your API endpoints"
echo ""
echo "✅ Ready to recreate your database!"
