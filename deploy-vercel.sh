#!/bin/bash

# =====================================================
# VERCEL DEPLOYMENT SCRIPT
# =====================================================
# Run this script to deploy both frontend and backend

echo "🚀 ShilpkaarAI Vercel Deployment Script"
echo "======================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "📋 Deployment Steps:"
echo "1. Login to Vercel: vercel login"
echo "2. Deploy backend: cd backend && vercel --prod"
echo "3. Deploy frontend: cd frontend && vercel --prod"
echo "4. Set environment variables in Vercel dashboard"
echo ""
echo "🔗 Vercel Dashboard: https://vercel.com/dashboard"
echo "📖 Full Guide: DEPLOYMENT_GUIDE_SUPABASE.md"
echo ""
echo "⚠️  IMPORTANT: You need to:"
echo "1. Set up Supabase project first"
echo "2. Run the SQL script in Supabase"
echo "3. Get your Supabase credentials"
echo "4. Set environment variables in Vercel"
echo ""
echo "Ready to deploy? Run: vercel login"
