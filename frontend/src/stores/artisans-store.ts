import { create } from 'zustand'
import { artisanApi, ApiError } from '../utils/api'

export interface Artisan {
  _id: string
  name: string
  mobile: string
  email?: string
  role: string
  isVerified: boolean
  avatar?: string
  location: string
  region?: string
  state?: string
  city?: string
  craft: string
  crafts?: string[]
  experience: number
  rating: number
  reviewCount: number
  productsCount: number
  techniques?: string[]
  specializations?: string[]
  certifications?: string[]
  languages?: string[]
  bio?: string
  workshopOffered: boolean
  onlinePresence?: {
    website?: string
    instagram?: string
    facebook?: string
    youtube?: string
  }
  createdAt: string
  updatedAt: string
}

export interface ArtisanSearchFilters {
  q?: string
  craft?: string
  location?: string
  region?: string
  state?: string
  city?: string
  minExperience?: number
  maxExperience?: number
  minRating?: number
  minProducts?: number
  techniques?: string
  specializations?: string
  certifications?: string
  workshopOffered?: boolean
  sortBy?: string
  sortOrder?: string
}

export interface ArtisanPagination {
  current: number
  pages: number
  total: number
  limit: number
}

export interface ArtisanFilterOptions {
  crafts: string[]
  locations: string[]
  regions: string[]
  states: string[]
  cities: string[]
  techniques: string[]
  specializations: string[]
  certifications: string[]
  experienceRange: { minExperience: number; maxExperience: number }
  ratingRange: { minRating: number; maxRating: number }
  productsRange: { minProducts: number; maxProducts: number }
}

export interface ArtisanStats {
  totalArtisans: number
  verifiedArtisans: number
  onlineArtisans: number
  avgRating: number
}

interface ArtisansStore {
  artisans: Artisan[]
  isLoading: boolean
  error: string | null
  
  // Search and filter state
  searchFilters: ArtisanSearchFilters
  pagination: ArtisanPagination
  filterOptions: ArtisanFilterOptions | null
  stats: ArtisanStats | null
  
  // Actions
  fetchArtisans: (count?: number) => Promise<void>
  searchArtisans: (filters?: Partial<ArtisanSearchFilters>) => Promise<void>
  setSearchFilters: (filters: Partial<ArtisanSearchFilters>) => void
  clearSearchFilters: () => void
  getArtisan: (id: string) => Promise<Artisan | null>
  getCrafts: () => Promise<string[]>
  getLocations: () => Promise<any>
  clearError: () => void
}

export const useArtisansStore = create<ArtisansStore>((set, get) => ({
  artisans: [],
  isLoading: false,
  error: null,
  
  // Search and filter state
  searchFilters: {
    sortBy: 'relevance',
    sortOrder: 'desc'
  },
  pagination: {
    current: 1,
    pages: 1,
    total: 0,
    limit: 20
  },
  filterOptions: null,
  stats: null,

  fetchArtisans: async (count = 20) => {
    set({ isLoading: true, error: null })
    try {
      const response = await artisanApi.getAllArtisans(count, 1)
      const { artisans, pagination } = response.data
      
      set({ 
        artisans: artisans,
        pagination: pagination,
        isLoading: false 
      })
    } catch (error) {
      console.error('Error fetching artisans:', error)
      if (error instanceof ApiError) {
        set({ 
          error: error.message,
          isLoading: false 
        })
      } else {
        set({ 
          error: 'Failed to fetch artisans',
          isLoading: false 
        })
      }
    }
  },

  searchArtisans: async (filters: Partial<ArtisanSearchFilters> = {}) => {
    set({ isLoading: true, error: null })
    try {
      const currentFilters = get().searchFilters
      const mergedFilters = { ...currentFilters, ...filters }
      
      const response = await artisanApi.searchArtisans({
        ...mergedFilters,
        page: mergedFilters.sortBy === 'relevance' ? 1 : get().pagination.current,
        limit: get().pagination.limit
      })
      
      const { artisans, pagination, filters: filterOptions, stats } = response.data
      
      set({ 
        artisans: artisans,
        pagination: pagination,
        filterOptions: filterOptions,
        stats: stats,
        searchFilters: mergedFilters,
        isLoading: false 
      })
    } catch (error) {
      console.error('Error searching artisans:', error)
      if (error instanceof ApiError) {
        set({ 
          error: error.message,
          isLoading: false 
        })
      } else {
        set({ 
          error: 'Failed to search artisans',
          isLoading: false 
        })
      }
    }
  },

  setSearchFilters: (filters: Partial<ArtisanSearchFilters>) => {
    set((state) => ({
      searchFilters: { ...state.searchFilters, ...filters }
    }))
  },

  clearSearchFilters: () => {
    set({
      searchFilters: {
        sortBy: 'relevance',
        sortOrder: 'desc'
      },
      pagination: {
        current: 1,
        pages: 1,
        total: 0,
        limit: 20
      }
    })
  },

  getArtisan: async (id: string) => {
    try {
      const response = await artisanApi.getArtisan(id)
      return response.data.artisan
    } catch (error) {
      console.error('Error fetching artisan:', error)
      if (error instanceof ApiError) {
        set({ error: error.message })
      } else {
        set({ error: 'Failed to fetch artisan' })
      }
      return null
    }
  },

  getCrafts: async () => {
    try {
      const response = await artisanApi.getCrafts()
      return response.data
    } catch (error) {
      console.error('Error fetching crafts:', error)
      if (error instanceof ApiError) {
        set({ error: error.message })
      } else {
        set({ error: 'Failed to fetch crafts' })
      }
      return []
    }
  },

  getLocations: async () => {
    try {
      const response = await artisanApi.getLocations()
      return response.data
    } catch (error) {
      console.error('Error fetching locations:', error)
      if (error instanceof ApiError) {
        set({ error: error.message })
      } else {
        set({ error: 'Failed to fetch locations' })
      }
      return {
        locations: [],
        regions: [],
        states: [],
        cities: []
      }
    }
  },

  clearError: () => {
    set({ error: null })
  }
}))
