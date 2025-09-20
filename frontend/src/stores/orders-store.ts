import { create } from 'zustand'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export interface OrderItem {
  product: {
    _id: string
    name: string
    images: string[]
    price: number
    artisan: string
    artisanName: string
  }
  quantity: number
  price: number
}

export interface Order {
  _id: string
  orderNumber: string
  customer: {
    _id: string
    name: string
    mobile: string
    email?: string
  }
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: {
    name: string
    mobile: string
    address: string
    city: string
    state: string
    pincode: string
    country: string
  }
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: 'cod' | 'online' | 'wallet'
  paymentId?: string
  trackingNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface OrdersStore {
  myOrders: Order[]
  artisanOrders: Order[]
  currentOrder: Order | null
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchMyOrders: () => Promise<void>
  fetchArtisanOrders: () => Promise<void>
  fetchOrder: (orderId: string) => Promise<void>
  createOrder: (orderData: CreateOrderData) => Promise<void>
  updateOrderStatus: (orderId: string, status: string, trackingNumber?: string) => Promise<void>
  clearError: () => void
}

export interface CreateOrderData {
  items: Array<{
    productId: string
    quantity: number
  }>
  shippingAddress: {
    name: string
    mobile: string
    address: string
    city: string
    state: string
    pincode: string
    country?: string
  }
  paymentMethod?: 'cod' | 'online' | 'wallet'
}

export const useOrdersStore = create<OrdersStore>((set, get) => ({
  myOrders: [],
  artisanOrders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  fetchMyOrders: async () => {
    set({ isLoading: true, error: null })
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(`${API_URL}/orders/myorders`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      set({ 
        myOrders: response.data,
        isLoading: false 
      })
    } catch (error: any) {
      console.error('Error fetching my orders:', error)
      set({ 
        error: error.response?.data?.message || 'Failed to fetch orders',
        isLoading: false 
      })
    }
  },

  fetchArtisanOrders: async () => {
    set({ isLoading: true, error: null })
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(`${API_URL}/orders/artisan/allorders`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      set({ 
        artisanOrders: response.data,
        isLoading: false 
      })
    } catch (error: any) {
      console.error('Error fetching artisan orders:', error)
      set({ 
        error: error.response?.data?.message || 'Failed to fetch artisan orders',
        isLoading: false 
      })
    }
  },

  fetchOrder: async (orderId: string) => {
    set({ isLoading: true, error: null })
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(`${API_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      set({ 
        currentOrder: response.data,
        isLoading: false 
      })
    } catch (error: any) {
      console.error('Error fetching order:', error)
      set({ 
        error: error.response?.data?.message || 'Failed to fetch order',
        isLoading: false 
      })
    }
  },

  createOrder: async (orderData: CreateOrderData) => {
    set({ isLoading: true, error: null })
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.post(`${API_URL}/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Refresh orders after creating new one
      await get().fetchMyOrders()
      
      set({ 
        currentOrder: response.data.order,
        isLoading: false 
      })
      
      return response.data.order
    } catch (error: any) {
      console.error('Error creating order:', error)
      set({ 
        error: error.response?.data?.message || 'Failed to create order',
        isLoading: false 
      })
      throw error
    }
  },

  updateOrderStatus: async (orderId: string, status: string, trackingNumber?: string) => {
    set({ isLoading: true, error: null })
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.put(`${API_URL}/orders/${orderId}/status`, {
        status,
        trackingNumber
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Update the order in the store
      const { myOrders, artisanOrders } = get()
      const updatedOrder = response.data.order
      
      set({
        myOrders: myOrders.map(order => 
          order._id === orderId ? updatedOrder : order
        ),
        artisanOrders: artisanOrders.map(order => 
          order._id === orderId ? updatedOrder : order
        ),
        currentOrder: get().currentOrder?._id === orderId ? updatedOrder : get().currentOrder,
        isLoading: false
      })
    } catch (error: any) {
      console.error('Error updating order status:', error)
      set({ 
        error: error.response?.data?.message || 'Failed to update order status',
        isLoading: false 
      })
    }
  },

  clearError: () => {
    set({ error: null })
  }
}))
