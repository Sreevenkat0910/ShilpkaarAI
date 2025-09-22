# ✅ ShilpkaarAI Deployment Checklist

## 🗄️ Database Setup (5 minutes)
- [ ] Go to https://ligdkkmdyhzzxkmvvhfb.supabase.co
- [ ] Click "SQL Editor" → "New Query"
- [ ] Copy entire contents of `supabase-schema.sql`
- [ ] Paste and click "Run"
- [ ] Verify tables created in "Table Editor"

## 🌐 Backend Deployment (5 minutes)
- [ ] Go to https://vercel.com
- [ ] Sign up/login with GitHub
- [ ] Click "New Project"
- [ ] Import your GitHub repository
- [ ] Set Root Directory: `backend`
- [ ] Add Environment Variables:
  - [ ] `SUPABASE_URL` = `https://ligdkkmdyhzzxkmvvhfb.supabase.co`
  - [ ] `SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZ2Rra21keWh6enhrbXZ2aGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NjkxNjAsImV4cCI6MjA3NDA0NTE2MH0.bVRFOmxxzDxF69XI4x3Q5ci-VX55ss0YICNsiQW5MOo`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZ2Rra21keWh6enhrbXZ2aGZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODQ2OTE2MCwiZXhwIjoyMDc0MDQ1MTYwfQ.xUoTElTgu4d06FcPUuka6dzfAqFyH8JacqH8eXDEUUY`
  - [ ] `FRONTEND_URL` = `https://your-frontend-url.vercel.app` (update after frontend deploy)
- [ ] Click "Deploy"
- [ ] Copy backend URL (e.g., `https://your-backend-app.vercel.app`)

## 🎨 Frontend Deployment (5 minutes)
- [ ] Create another Vercel project
- [ ] Set Root Directory: `frontend`
- [ ] Add Environment Variable:
  - [ ] `VITE_API_URL` = `https://your-backend-url.vercel.app`
- [ ] Click "Deploy"
- [ ] Copy frontend URL (e.g., `https://your-frontend-app.vercel.app`)

## 🔄 Final Configuration (2 minutes)
- [ ] Update backend `FRONTEND_URL` with frontend URL
- [ ] Update frontend `VITE_API_URL` with backend URL
- [ ] Redeploy both projects

## 🧪 Testing (3 minutes)
- [ ] Visit frontend URL
- [ ] Test navigation and UI
- [ ] Test API endpoints
- [ ] Check Supabase dashboard for data

## 🎉 Success!
- [ ] App is live and working
- [ ] Total cost: ₹0
- [ ] Completely free forever!

---

**Estimated total time: 20 minutes**
**Total cost: ₹0 forever!**
