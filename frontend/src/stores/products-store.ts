import { create } from 'zustand'
import { searchApi, ApiError } from '../utils/api'

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  subcategory?: string
  craft?: string
  artisan: {
    _id: string
    name: string
    location?: string
    craft?: string
    experience?: number
    rating?: number
  }
  artisanName: string
  stock: number
  isActive: boolean
  tags?: string[]
  materials?: string[]
  color?: string[]
  technique?: string[]
  occasion?: string[]
  location?: string
  region?: string
  ageGroup?: string
  gender?: string
  season?: string[]
  sustainability?: string
  condition?: string
  availability?: string
  featured?: boolean
  trending?: boolean
  rating?: number
  reviewCount?: number
  createdAt: string
  updatedAt: string
}

export interface SearchFilters {
  q?: string
  category?: string
  subcategory?: string
  craft?: string
  artisan?: string
  location?: string
  region?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  materials?: string
  colors?: string
  techniques?: string
  occasions?: string
  ageGroup?: string
  gender?: string
  season?: string
  sustainability?: string
  condition?: string
  availability?: string
  featured?: boolean
  trending?: boolean
  sortBy?: string
  sortOrder?: string
}

export interface Pagination {
  current: number
  pages: number
  total: number
  limit: number
}

export interface FilterOptions {
  categories: string[]
  subcategories: string[]
  crafts: string[]
  locations: string[]
  regions: string[]
  materials: string[]
  colors: string[]
  techniques: string[]
  occasions: string[]
  priceRange: { minPrice: number; maxPrice: number }
  ratingRange: { minRating: number; maxRating: number }
}

interface ProductsStore {
  allProducts: Product[]
  filteredProducts: Product[]
  allCategories: string[]
  selectedCategory: string
  searchTerm: string
  singleProduct: Product | null
  isLoading: boolean
  error: string | null
  
  // Search and filter state
  searchFilters: SearchFilters
  pagination: Pagination
  filterOptions: FilterOptions | null
  
  // Actions
  fetchProducts: (count?: number) => Promise<void>
  fetchCategories: (count?: number) => Promise<void>
  fetchProductByCategory: (category: string) => Promise<void>
  fetchSingleProduct: (productId: string) => Promise<void>
  searchProducts: (filters?: Partial<SearchFilters>) => Promise<void>
  setSearchFilters: (filters: Partial<SearchFilters>) => void
  clearSearchFilters: () => void
  setSelectedCategory: (category: string) => void
  clearError: () => void
}

export const useProductsStore = create<ProductsStore>((set, get) => ({
  allProducts: [],
  filteredProducts: [],
  allCategories: [],
  selectedCategory: 'All',
  searchTerm: '',
  singleProduct: null,
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

  fetchProducts: async (count = 20) => {
    set({ isLoading: true, error: null })
    try {
      const response = await searchApi.getAllProducts(count, 1)
      const { productsData, pagination } = response.data
      
      set({ 
        allProducts: productsData,
        filteredProducts: productsData,
        pagination: pagination,
        isLoading: false 
      })
    } catch (error) {
      console.error('Error fetching products:', error)
      if (error instanceof ApiError) {
        set({ 
          error: error.message,
          isLoading: false 
        })
      } else {
        set({ 
          error: 'Failed to fetch products',
          isLoading: false 
        })
      }
    }
  },

  fetchCategories: async (count = 20) => {
    try {
      const response = await searchApi.getCategories(count)
      set({ allCategories: response.data })
    } catch (error) {
      console.error('Error fetching categories:', error)
      if (error instanceof ApiError) {
        set({ error: error.message })
      } else {
        set({ error: 'Failed to fetch categories' })
      }
    }
  },

  fetchProductByCategory: async (category: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await searchApi.getProductsByCategory(category)
      set({ 
        filteredProducts: response.data,
        selectedCategory: category,
        isLoading: false 
      })
    } catch (error) {
      console.error('Error fetching products by category:', error)
      if (error instanceof ApiError) {
        set({ 
          error: error.message,
          isLoading: false 
        })
      } else {
        set({ 
          error: 'Failed to fetch products by category',
          isLoading: false 
        })
      }
    }
  },

  fetchSingleProduct: async (productId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await searchApi.getProduct(productId)
      set({ 
        singleProduct: response.data.productData,
        isLoading: false 
      })
    } catch (error) {
      console.error('Error fetching single product:', error)
      if (error instanceof ApiError) {
        set({ 
          error: error.message,
          isLoading: false 
        })
      } else {
        set({ 
          error: 'Failed to fetch product',
          isLoading: false 
        })
      }
    }
  },

  searchProducts: async (filters: Partial<SearchFilters> = {}) => {
    set({ isLoading: true, error: null })
    try {
      const currentFilters = get().searchFilters
      const mergedFilters = { ...currentFilters, ...filters }
      
      const response = await searchApi.searchProducts({
        ...mergedFilters,
        page: mergedFilters.sortBy === 'relevance' ? 1 : get().pagination.current,
        limit: get().pagination.limit
      })
      
      const { products, pagination, filters: filterOptions } = response.data
      
      set({ 
        filteredProducts: products,
        pagination: pagination,
        filterOptions: filterOptions,
        searchFilters: mergedFilters,
        isLoading: false 
      })
    } catch (error) {
      console.error('Error searching products:', error)
      if (error instanceof ApiError) {
        set({ 
          error: error.message,
          isLoading: false 
        })
      } else {
        set({ 
          error: 'Failed to search products',
          isLoading: false 
        })
      }
    }
  },

  setSearchFilters: (filters: Partial<SearchFilters>) => {
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

  setSelectedCategory: (category: string) => {
    set({ selectedCategory: category })
  },

  clearError: () => {
    set({ error: null })
  }
}))