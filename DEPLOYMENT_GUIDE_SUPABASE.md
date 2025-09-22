# 🚀 SUPABASE + VERCEL DEPLOYMENT GUIDE

## ✅ **STEP 1: SUPABASE SETUP**

### 1.1 Create Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `shilpkaarai`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

### 1.2 Run Database Setup
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the entire contents of `supabase-recreation.sql`
3. Paste and run the SQL script
4. Wait for completion (should take 1-2 minutes)

### 1.3 Get Supabase Credentials
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## ✅ **STEP 2: BACKEND DEPLOYMENT (Vercel)**

### 2.1 Prepare Backend
```bash
cd backend
npm install
```

### 2.2 Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy backend
vercel --prod
```

### 2.3 Set Environment Variables in Vercel
1. Go to your Vercel dashboard
2. Select your backend project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=your-super-secret-jwt-key-change-this
FRONTEND_URL=https://your-frontend-app.vercel.app
NODE_ENV=production
```

### 2.4 Get Backend URL
After deployment, Vercel will give you a URL like:
`https://your-backend-app.vercel.app`

## ✅ **STEP 3: FRONTEND DEPLOYMENT (Vercel)**

### 3.1 Prepare Frontend
```bash
cd frontend
npm install
```

### 3.2 Deploy to Vercel
```bash
# Deploy frontend
vercel --prod
```

### 3.3 Set Environment Variables in Vercel
1. Go to your frontend project in Vercel dashboard
2. Go to **Settings** → **Environment Variables**
3. Add this variable:

```bash
VITE_API_URL=https://your-backend-app.vercel.app/api
```

### 3.4 Get Frontend URL
After deployment, Vercel will give you a URL like:
`https://your-frontend-app.vercel.app`

## ✅ **STEP 4: UPDATE BACKEND FRONTEND_URL**

1. Go back to your backend project in Vercel
2. Update the `FRONTEND_URL` environment variable:
```bash
FRONTEND_URL=https://your-frontend-app.vercel.app
```
3. Redeploy the backend

## ✅ **STEP 5: TEST YOUR DEPLOYMENT**

### 5.1 Test Backend
```bash
curl https://your-backend-app.vercel.app/api/health
```
Should return:
```json
{
  "success": true,
  "status": "OK",
  "message": "ShilpkaarAI API is running",
  "database": "Connected"
}
```

### 5.2 Test Frontend
1. Open your frontend URL
2. Try registering a new user
3. Try browsing products
4. Check browser console for any errors

## ✅ **STEP 6: SAMPLE ACCOUNTS FOR TESTING**

After running the SQL script, these accounts are available:

### Artisans:
- **Priya Sharma**: `9876543210` / `password123`
- **Kavitha Reddy**: `9876543215` / `password123`
- **Rajesh Kumar**: `9876543211` / `password123`
- **Rajeshwar Singh**: `9876543212` / `password123`
- **Sunita Devi**: `9876543213` / `password123`
- **Hari Prasad**: `9876543214` / `password123`

### Customer:
- **Test Customer**: `9999999999` / `password123`

## 🔧 **TROUBLESHOOTING**

### Common Issues:

1. **"Invalid supabaseUrl" Error**
   - Check your SUPABASE_URL format
   - Should be: `https://your-project-id.supabase.co`

2. **"Database connection failed"**
   - Verify your Supabase credentials
   - Check if the SQL script ran successfully

3. **CORS Errors**
   - Make sure FRONTEND_URL is set correctly in backend
   - Check that frontend URL matches exactly

4. **"Product not found" Errors**
   - Verify the SQL script created sample data
   - Check if products table has data

### Debug Commands:
```bash
# Check backend logs
vercel logs your-backend-app

# Check frontend logs
vercel logs your-frontend-app

# Test API endpoints
curl https://your-backend-app.vercel.app/api/products/all
```

## 🎉 **SUCCESS!**

Once everything is deployed and working:
- ✅ Backend running on Vercel
- ✅ Frontend running on Vercel
- ✅ Database on Supabase
- ✅ All features working
- ✅ **Cost: ₹0** (completely free!)

Your ShilpkaarAI marketplace is now live! 🚀
