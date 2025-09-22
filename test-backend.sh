#!/bin/bash

# =====================================================
# LOCAL TESTING SCRIPT
# =====================================================
# Test the backend locally before deploying

echo "🧪 Testing ShilpkaarAI Backend Locally"
echo "====================================="

cd backend

echo "📦 Installing dependencies..."
npm install

echo "🔍 Checking for syntax errors..."
node -c server.js
if [ $? -eq 0 ]; then
    echo "✅ Server syntax OK"
else
    echo "❌ Server syntax errors found"
    exit 1
fi

echo "🔍 Checking Supabase models..."
node -c models/supabase.js
if [ $? -eq 0 ]; then
    echo "✅ Supabase models OK"
else
    echo "❌ Supabase models errors found"
    exit 1
fi

echo "🔍 Checking routes..."
for route in routes/*-supabase.js; do
    if [ -f "$route" ]; then
        node -c "$route"
        if [ $? -eq 0 ]; then
            echo "✅ $(basename $route) OK"
        else
            echo "❌ $(basename $route) errors found"
            exit 1
        fi
    fi
done

echo ""
echo "🎉 All checks passed!"
echo ""
echo "⚠️  To test with Supabase:"
echo "1. Update .env with your Supabase credentials"
echo "2. Run: npm run dev"
echo "3. Test: curl http://localhost:5001/api/health"
echo ""
echo "📖 See DEPLOYMENT_GUIDE_SUPABASE.md for full setup"
