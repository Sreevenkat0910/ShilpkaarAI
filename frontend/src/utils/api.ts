// API utility functions for consistent API calls across the application
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export interface ApiResponse<T> {
  data: T
  error?: string
  status: number
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

// Get authentication token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken')
}

// Create headers with authentication
export const createAuthHeaders = (): HeadersInit => {
  const token = getAuthToken()
  if (!token) {
    throw new ApiError(401, 'No authentication token found')
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

// Generic API call function
export const apiCall = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const url = `${API_BASE}${endpoint}`
    const token = getAuthToken()
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(url, {
      ...options,
      headers
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      throw new ApiError(response.status, errorData.message || `API call failed: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    return {
      data,
      status: response.status
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(0, error instanceof Error ? error.message : 'Network error')
  }
}

// Analytics specific API calls
export const analyticsApi = {
  getOverview: (timeFrame: string = '30days') => 
    apiCall(`/analytics/overview?timeFrame=${timeFrame}`),
    
  getSalesTrend: (timeFrame: string = '30days') => 
    apiCall(`/analytics/sales-trend?timeFrame=${timeFrame}`),
    
  getTopProducts: (timeFrame: string = '30days', limit: number = 10) => 
    apiCall(`/analytics/top-products?timeFrame=${timeFrame}&limit=${limit}`),
    
  getCategoryPerformance: (timeFrame: string = '30days') => 
    apiCall(`/analytics/category-performance?timeFrame=${timeFrame}`),
    
  getCustomerInsights: (timeFrame: string = '30days') => 
    apiCall(`/analytics/customer-insights?timeFrame=${timeFrame}`),
    
  getSeasonalTrends: () => 
    apiCall('/analytics/seasonal-trends'),
    
  getRecommendations: () => 
    apiCall('/analytics/recommendations'),
    
  getAlerts: () => 
    apiCall('/analytics/alerts'),
    
  getInventoryInsights: () => 
    apiCall('/analytics/inventory-insights')
}

// Auth specific API calls
export const authApi = {
  login: (mobile: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ mobile, password })
    }),
    
  register: (userData: any) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
    
  getMe: () =>
    apiCall('/auth/me'),
    
  logout: () =>
    apiCall('/auth/logout', { method: 'POST' })
}

// Review specific API calls
export const reviewApi = {
  getProductReviews: (productId: string, page: number = 1, limit: number = 10, sort: string = 'newest') =>
    apiCall(`/reviews/product/${productId}?page=${page}&limit=${limit}&sort=${sort}`),
    
  getReviewSummary: (productId: string) =>
    apiCall(`/reviews/product/${productId}/summary`),
    
  createReview: (productId: string, rating: number, comment: string, images?: string[]) =>
    apiCall('/reviews', {
      method: 'POST',
      body: JSON.stringify({ productId, rating, comment, images })
    }),
    
  updateReview: (reviewId: string, rating?: number, comment?: string) =>
    apiCall(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify({ rating, comment })
    }),
    
  deleteReview: (reviewId: string) =>
    apiCall(`/reviews/${reviewId}`, { method: 'DELETE' }),
    
  markHelpful: (reviewId: string) =>
    apiCall(`/reviews/${reviewId}/helpful`, { method: 'POST' }),
    
  removeHelpful: (reviewId: string) =>
    apiCall(`/reviews/${reviewId}/helpful`, { method: 'DELETE' }),
    
  getUserReviews: (userId: string, page: number = 1, limit: number = 10) =>
    apiCall(`/reviews/user/${userId}?page=${page}&limit=${limit}`)
}

// Favorites specific API calls
export const favoritesApi = {
  getUserFavorites: (page: number = 1, limit: number = 20, sortBy: string = 'addedAt') =>
    apiCall(`/favorites?page=${page}&limit=${limit}&sortBy=${sortBy}`),
    
  addToFavorites: (productId: string) =>
    apiCall(`/favorites/${productId}`, { method: 'POST' }),
    
  removeFromFavorites: (productId: string) =>
    apiCall(`/favorites/${productId}`, { method: 'DELETE' }),
    
  toggleFavorite: (productId: string) =>
    apiCall(`/favorites/toggle/${productId}`, { method: 'POST' }),
    
  checkFavoriteStatus: (productId: string) =>
    apiCall(`/favorites/check/${productId}`),
    
  getProductFavoriteCount: (productId: string) =>
    apiCall(`/favorites/count/${productId}`),
    
  getUserFavoriteCount: () =>
    apiCall('/favorites/user/count')
}

export default {
  API_BASE,
  getAuthToken,
  createAuthHeaders,
  apiCall,
  analyticsApi,
  authApi,
  reviewApi,
  favoritesApi
}
