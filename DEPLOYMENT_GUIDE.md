# 🚀 ShilpkaarAI Deployment Guide

## Free Deployment Options

### Option 1: Railway (Recommended)
**Cost**: Free ($5 credit monthly)
**Setup**: 
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Connect your repository
4. Deploy backend automatically

### Option 2: Render
**Cost**: Free (750 hours/month)
**Setup**:
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Create new Web Service
4. Connect your repository

### Option 3: Vercel + Railway
**Frontend**: Vercel (free)
**Backend**: Railway (free)
**Best for**: Maximum performance

## Environment Variables Needed

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shilpkaarai

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Server
PORT=5001
NODE_ENV=production
```

## Frontend Configuration

Update `frontend/src/utils/api.ts` to use deployed backend URL:

```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.railway.app' 
  : 'http://localhost:5001'
```

## Deployment Steps

1. **Deploy Backend**:
   - Choose Railway or Render
   - Connect GitHub repository
   - Set environment variables
   - Deploy

2. **Update Frontend**:
   - Update API URL in frontend
   - Redeploy to GitHub Pages

3. **Test**:
   - Verify API endpoints work
   - Test authentication
   - Test all features

## Database Options

### MongoDB Atlas (Free)
- 512MB free storage
- Perfect for development/small apps
- Easy setup

### Railway MongoDB (Paid)
- $5/month
- More storage and features
- Integrated with Railway

## Cost Breakdown

| Service | Frontend | Backend | Database | Total |
|---------|----------|---------|----------|-------|
| GitHub Pages | Free | - | - | Free |
| Railway | - | Free* | Free* | Free* |
| Render | - | Free | - | Free |
| MongoDB Atlas | - | - | Free | Free |

*Railway gives $5 credit monthly, more than enough for small apps
