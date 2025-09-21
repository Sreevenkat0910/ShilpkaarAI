# Environment Variables for Production Deployment

# For Railway/Render deployment, set these in your platform's environment variables section

# API URL for frontend (update this after deploying backend)
VITE_API_URL=https://your-backend-url.railway.app/api

# Backend Environment Variables
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shilpkaarai
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5001
NODE_ENV=production

# Optional: CORS settings
CORS_ORIGIN=https://sreevenkat0910.github.io
