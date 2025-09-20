# Authentication & API Integration Guide

## 🔐 Authentication Issues Fixed

### Problems Identified and Resolved:

1. **Token Key Mismatch**
   - ❌ Analytics component was using `localStorage.getItem('token')`
   - ✅ Fixed to use `localStorage.getItem('accessToken')` (consistent with auth context)

2. **API URL Inconsistency**
   - ❌ Auth context defaulted to port 5000, analytics used port 5001
   - ✅ Fixed all components to use port 5001 consistently

3. **Missing Error Handling**
   - ❌ Generic error messages without specific status codes
   - ✅ Added proper error handling with status-specific messages

4. **No Authentication Validation**
   - ❌ No checks for token existence before API calls
   - ✅ Added token validation and proper error messages

## 🛠️ Solutions Implemented

### 1. Created Centralized API Utility (`/frontend/src/utils/api.ts`)

```typescript
// Consistent API calls with proper error handling
export const analyticsApi = {
  getOverview: (timeFrame: string = '30days') => 
    apiCall(`/analytics/overview?timeFrame=${timeFrame}`),
  // ... other endpoints
}
```

### 2. Updated All Components to Use Consistent API URLs

- ✅ `auth-context.tsx`: Fixed default port from 5000 to 5001
- ✅ `orders-store.ts`: Fixed default port from 5000 to 5001  
- ✅ `products-store.ts`: Fixed default port from 5000 to 5001
- ✅ `artisan-analytics.tsx`: Updated to use API utility

### 3. Enhanced Error Handling

```typescript
if (error instanceof ApiError) {
  if (error.status === 401) {
    setError('Authentication failed. Please log in again.')
  } else if (error.status === 403) {
    setError('Access denied. Only artisans can view analytics.')
  }
}
```

## 🚀 How to Prevent Future Issues

### 1. Always Use the API Utility

```typescript
// ✅ Good - Use the centralized API utility
import { analyticsApi } from '../../utils/api'
const data = await analyticsApi.getOverview('30days')

// ❌ Bad - Direct fetch calls
const response = await fetch('/api/analytics/overview')
```

### 2. Consistent Token Handling

```typescript
// ✅ Good - Use the utility function
import { getAuthToken } from '../../utils/api'
const token = getAuthToken()

// ❌ Bad - Direct localStorage access
const token = localStorage.getItem('token') // Wrong key!
```

### 3. Environment Configuration

Ensure all components use the same environment variable:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
```

### 4. Authentication Checks

Always validate authentication before making API calls:
```typescript
useEffect(() => {
  if (user && user.role === 'artisan') {
    fetchData()
  } else if (!user) {
    setError('Please log in to view this page.')
  }
}, [user])
```

## 🧪 Testing Checklist

Before deploying any API-related changes:

- [ ] Test authentication with valid token
- [ ] Test authentication with invalid token  
- [ ] Test authentication with no token
- [ ] Verify all API endpoints use consistent base URL
- [ ] Check error handling for different HTTP status codes
- [ ] Test with different user roles (artisan vs customer)

## 🔧 Backend Requirements

Ensure the backend has:
- [ ] JWT_SECRET environment variable set
- [ ] All analytics endpoints properly protected with auth middleware
- [ ] Consistent error response format
- [ ] Proper CORS configuration for frontend URL

## 📝 API Endpoints Reference

### Analytics Endpoints (All require authentication)
- `GET /api/analytics/overview?timeFrame={timeFrame}`
- `GET /api/analytics/sales-trend?timeFrame={timeFrame}`
- `GET /api/analytics/top-products?timeFrame={timeFrame}&limit={limit}`
- `GET /api/analytics/category-performance?timeFrame={timeFrame}`
- `GET /api/analytics/customer-insights?timeFrame={timeFrame}`
- `GET /api/analytics/seasonal-trends`
- `GET /api/analytics/recommendations`
- `GET /api/analytics/alerts`
- `GET /api/analytics/inventory-insights`

### Auth Endpoints
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me` (requires auth)
- `POST /api/auth/logout` (requires auth)

## 🎯 Key Takeaways

1. **Consistency is Key**: Always use the same token key, API URL, and error handling patterns
2. **Centralize API Logic**: Use utility functions instead of scattered fetch calls
3. **Validate Early**: Check authentication before making API calls
4. **Handle Errors Gracefully**: Provide specific error messages based on status codes
5. **Test Thoroughly**: Always test authentication flows end-to-end

This guide ensures that authentication and API integration issues will not occur again.
