import { create } from 'zustand'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  artisan: {
    _id: string
    name: string
    location?: string
    craft?: string
  }
  artisanName: string
  stock: number
  isActive: boolean
  tags?: string[]
  materials?: string[]
  createdAt: string
  updatedAt: string
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
  
  // Actions
  fetchProducts: (count?: number) => Promise<void>
  fetchCategories: (count?: number) => Promise<void>
  fetchProductByCategory: (category: string) => Promise<void>
  fetchSingleProduct: (productId: string) => Promise<void>
  searchProducts: (searchTerm: string) => void
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

  fetchProducts: async (count = 20) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.get(`${API_URL}/products/all?count=${count}`)
      const { productsData } = response.data
      
      set({ 
        allProducts: productsData,
        filteredProducts: productsData,
        isLoading: false 
      })
    } catch (error: any) {
      console.error('Error fetching products:', error)
      set({ 
        error: error.response?.data?.message || 'Failed to fetch products',
        isLoading: false 
      })
    }
  },

  fetchCategories: async (count = 20) => {
    try {
      const response = await axios.get(`${API_URL}/products/categories/all?count=${count}`)
      set({ allCategories: response.data })
    } catch (error: any) {
      console.error('Error fetching categories:', error)
      set({ error: error.response?.data?.message || 'Failed to fetch categories' })
    }
  },

  fetchProductByCategory: async (category: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.get(`${API_URL}/products/category?category=${category}`)
      set({ 
        filteredProducts: response.data,
        selectedCategory: category,
        isLoading: false 
      })
    } catch (error: any) {
      console.error('Error fetching products by category:', error)
      set({ 
        error: error.response?.data?.message || 'Failed to fetch products by category',
        isLoading: false 
      })
    }
  },

  fetchSingleProduct: async (productId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.get(`${API_URL}/products/one?id=${productId}`)
      set({ 
        singleProduct: response.data.productData,
        isLoading: false 
      })
    } catch (error: any) {
      console.error('Error fetching single product:', error)
      set({ 
        error: error.response?.data?.message || 'Failed to fetch product',
        isLoading: false 
      })
    }
  },

  searchProducts: (searchTerm: string) => {
    set({ searchTerm })
    const { allProducts } = get()
    
    if (searchTerm === '') {
      set({ filteredProducts: allProducts })
      return
    }

    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    set({ filteredProducts: filtered })
  },

  setSelectedCategory: (category: string) => {
    set({ selectedCategory: category })
  },

  clearError: () => {
    set({ error: null })
  }
}))
