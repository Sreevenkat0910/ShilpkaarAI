# 🚀 ShilpkaarAI Supabase + Vercel Deployment Guide

This guide will help you deploy your ShilpkaarAI application completely free using Supabase and Vercel.

## 📋 Prerequisites

- GitHub account
- Supabase account (free)
- Vercel account (free)
- Your ShilpkaarAI codebase

## 🗄️ Step 1: Set Up Supabase Database

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up with your email (no credit card required!)
3. Click "New Project"
4. Fill in project details:
   - **Name**: `shilpkaarai`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users (Asia Pacific for India)
5. Click "Create new project"
6. Wait for setup (2-3 minutes)

### 1.2 Get Your Supabase Credentials
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

### 1.3 Set Up Database Schema
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `supabase-schema.sql` from your project
3. Paste and run the SQL script
4. Verify tables are created in **Table Editor**

## 🌐 Step 2: Deploy Frontend to Vercel

### 2.1 Prepare Frontend
1. Update your frontend API base URL:
   ```bash
   # In frontend/src/utils/api.ts
   const API_BASE_URL = process.env.NODE_ENV === 'production' 
     ? 'https://your-backend-url.vercel.app' 
     : 'http://localhost:5001';
   ```

### 2.2 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click "Deploy"
7. Wait for deployment (2-3 minutes)

## ⚙️ Step 3: Deploy Backend to Vercel

### 3.1 Prepare Backend
1. Create `.env` file in backend folder:
   ```bash
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   PORT=5001
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-app.vercel.app
   ```

2. Update package.json scripts (already done):
   ```json
   {
     "scripts": {
       "start": "node server-supabase.js",
       "dev": "nodemon server-supabase.js"
     }
   }
   ```

### 3.2 Deploy Backend to Vercel
1. In Vercel dashboard, click "New Project"
2. Import your GitHub repository again
3. Configure for backend:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`
   - **Development Command**: `npm run dev`
4. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `FRONTEND_URL`
5. Click "Deploy"

## 🔧 Step 4: Update Frontend API URLs

### 4.1 Update API Configuration
1. In your frontend code, update API base URL:
   ```typescript
   // frontend/src/utils/api.ts
   const API_BASE_URL = process.env.NODE_ENV === 'production' 
     ? 'https://your-backend-app.vercel.app' 
     : 'http://localhost:5001';
   ```

2. Redeploy frontend:
   ```bash
   cd frontend
   npm run build
   # Push to GitHub - Vercel will auto-deploy
   ```

## 🎯 Step 5: Configure Supabase Authentication (Optional)

### 5.1 Enable Email Authentication
1. Go to **Authentication** → **Settings** in Supabase
2. Enable **Email** provider
3. Configure email templates
4. Set up redirect URLs:
   - `https://your-frontend-app.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for development)

### 5.2 Update Frontend Auth (if using Supabase Auth)
1. Install Supabase client in frontend:
   ```bash
   cd frontend
   npm install @supabase/supabase-js
   ```

2. Create Supabase client:
   ```typescript
   // frontend/src/lib/supabase.ts
   import { createClient } from '@supabase/supabase-js'
   
   const supabaseUrl = 'your_supabase_url'
   const supabaseKey = 'your_supabase_anon_key'
   
   export const supabase = createClient(supabaseUrl, supabaseKey)
   ```

## 📁 Step 6: Set Up File Storage (Optional)

### 6.1 Configure Supabase Storage
1. Go to **Storage** in Supabase dashboard
2. Create bucket: `product-images`
3. Set up policies for public access
4. Update your backend to use Supabase Storage for image uploads

## ✅ Step 7: Test Your Deployment

### 7.1 Test Frontend
1. Visit your Vercel frontend URL
2. Check if the app loads correctly
3. Test navigation and UI components

### 7.2 Test Backend
1. Visit `https://your-backend-url.vercel.app/api/health`
2. Should return: `{"status":"OK","database":"Supabase PostgreSQL"}`
3. Test API endpoints

### 7.3 Test Database
1. Go to Supabase **Table Editor**
2. Verify data is being created/read correctly
3. Check **Logs** for any errors

## 🔄 Step 8: Set Up Continuous Deployment

### 8.1 GitHub Integration
1. Both frontend and backend will auto-deploy on GitHub push
2. Set up branch protection rules
3. Use feature branches for development

### 8.2 Environment Management
1. **Development**: Use local Supabase project
2. **Production**: Use production Supabase project
3. Update environment variables in Vercel dashboard

## 🎉 Congratulations!

Your ShilpkaarAI application is now deployed completely free on:
- **Frontend**: Vercel (free forever)
- **Backend**: Vercel (free forever)
- **Database**: Supabase (free forever)
- **Storage**: Supabase (free forever)

## 📊 Cost Breakdown

| Service | Cost | Limits |
|---------|------|--------|
| **Vercel Frontend** | Free | 100GB bandwidth/month |
| **Vercel Backend** | Free | 100GB bandwidth/month |
| **Supabase Database** | Free | 500MB, 50K users |
| **Supabase Storage** | Free | 1GB |
| **Total** | **₹0** | **Forever** |

## 🚨 Important Notes

1. **Free Limits**: Monitor your usage to stay within free tiers
2. **Backup**: Supabase provides automatic backups
3. **Scaling**: Easy to upgrade when you outgrow free tiers
4. **Custom Domain**: Can add custom domain later
5. **SSL**: Automatic HTTPS on all deployments

## 🆘 Troubleshooting

### Common Issues:
1. **CORS Errors**: Check FRONTEND_URL in backend env vars
2. **Database Connection**: Verify Supabase credentials
3. **Build Failures**: Check Vercel build logs
4. **API Errors**: Check Supabase logs

### Support:
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **GitHub Issues**: Create issues in your repository

## 🎯 Next Steps

1. **Custom Domain**: Add your own domain
2. **Analytics**: Set up Vercel Analytics
3. **Monitoring**: Add error tracking
4. **SEO**: Optimize for search engines
5. **Performance**: Monitor and optimize

---

**Your ShilpkaarAI marketplace is now live and completely free! 🚀**
