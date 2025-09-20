import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { favoritesApi, ApiError } from '../../utils/api'
import { useAuth } from '../auth/auth-context'

interface Favorite {
  _id: string
  user: string
  product: {
    _id: string
    name: string
    description: string
    price: number
    originalPrice?: number
    images: string[]
    category: string
    artisan: string
    artisanName: string
    stock: number
    rating: number
    reviewCount: number
    tags: string[]
    materials: string[]
    createdAt: string
  }
  addedAt: string
}

interface FavoritesContextType {
  favorites: Favorite[]
  favoriteIds: Set<string>
  loading: boolean
  error: string | null
  addToFavorites: (productId: string) => Promise<void>
  removeFromFavorites: (productId: string) => Promise<void>
  toggleFavorite: (productId: string) => Promise<boolean>
  isFavorited: (productId: string) => boolean
  refreshFavorites: () => Promise<void>
  getUserFavoriteCount: () => Promise<number>
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

interface FavoritesProviderProps {
  children: ReactNode
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load favorites when user is authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      refreshFavorites()
    } else if (!authLoading && !isAuthenticated) {
      // Clear favorites when user is not authenticated
      setFavorites([])
      setFavoriteIds(new Set())
      setError(null)
    }
  }, [isAuthenticated, authLoading])

  const refreshFavorites = async () => {
    if (!isAuthenticated) {
      setFavorites([])
      setFavoriteIds(new Set())
      setError(null)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await favoritesApi.getUserFavorites(1, 100) // Load first 100 favorites
      setFavorites(response.data.data || [])
      
      // Update favorite IDs set for quick lookup
      const ids = new Set(response.data.data?.map((fav: Favorite) => fav.product._id) || [])
      setFavoriteIds(ids)
    } catch (err) {
      console.error('Error loading favorites:', err)
      if (err instanceof ApiError && err.status === 401) {
        // User not authenticated, clear favorites
        setFavorites([])
        setFavoriteIds(new Set())
      } else {
        setError('Failed to load favorites')
      }
    } finally {
      setLoading(false)
    }
  }

  const addToFavorites = async (productId: string) => {
    if (!isAuthenticated) {
      throw new ApiError(401, 'Please log in to add items to favorites')
    }

    try {
      setError(null)
      
      const response = await favoritesApi.addToFavorites(productId)
      
      // Add to local state
      const newFavorite = response.data
      setFavorites(prev => [newFavorite, ...prev])
      setFavoriteIds(prev => new Set([...prev, productId]))
      
    } catch (err) {
      console.error('Error adding to favorites:', err)
      if (err instanceof ApiError) {
        if (err.status === 400) {
          setError('Product already in favorites')
        } else if (err.status === 404) {
          setError('Product not found')
        } else {
          setError('Failed to add product to favorites')
        }
      } else {
        setError('Failed to add product to favorites')
      }
      throw err
    }
  }

  const removeFromFavorites = async (productId: string) => {
    if (!isAuthenticated) {
      throw new ApiError(401, 'Please log in to manage favorites')
    }

    try {
      console.log('API: Removing from favorites:', productId)
      setError(null)
      
      await favoritesApi.removeFromFavorites(productId)
      console.log('API: Successfully removed from favorites:', productId)
      
      // Remove from local state
      setFavorites(prev => prev.filter(fav => fav.product._id !== productId))
      setFavoriteIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
      
    } catch (err) {
      console.error('API: Error removing from favorites:', err)
      if (err instanceof ApiError) {
        if (err.status === 404) {
          setError('Product not found in favorites')
        } else {
          setError('Failed to remove product from favorites')
        }
      } else {
        setError('Failed to remove product from favorites')
      }
      throw err
    }
  }

  const toggleFavorite = async (productId: string): Promise<boolean> => {
    if (!isAuthenticated) {
      throw new ApiError(401, 'Please log in to manage favorites')
    }

    try {
      setError(null)
      
      const response = await favoritesApi.toggleFavorite(productId)
      const isFavorited = response.data.data.isFavorited
      
      if (isFavorited) {
        // Product was added to favorites - refresh the full list
        await refreshFavorites()
      } else {
        // Product was removed from favorites
        setFavorites(prev => prev.filter(fav => fav.product._id !== productId))
        setFavoriteIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(productId)
          return newSet
        })
      }
      
      return isFavorited
    } catch (err) {
      console.error('Error toggling favorite:', err)
      if (err instanceof ApiError) {
        if (err.status === 404) {
          setError('Product not found')
        } else {
          setError('Failed to toggle favorite status')
        }
      } else {
        setError('Failed to toggle favorite status')
      }
      throw err
    }
  }

  const isFavorited = (productId: string): boolean => {
    return favoriteIds.has(productId)
  }

  const getUserFavoriteCount = async (): Promise<number> => {
    if (!isAuthenticated) {
      return 0
    }

    try {
      const response = await favoritesApi.getUserFavoriteCount()
      return response.data.data.count
    } catch (err) {
      console.error('Error getting favorite count:', err)
      return 0
    }
  }

  const value: FavoritesContextType = {
    favorites,
    favoriteIds,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorited,
    refreshFavorites,
    getUserFavoriteCount
  }

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
