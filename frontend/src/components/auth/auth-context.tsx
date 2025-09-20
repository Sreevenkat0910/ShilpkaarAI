import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export type UserRole = 'customer' | 'artisan' | null

export interface User {
  id: string
  email?: string
  name: string
  mobile: string
  role: UserRole
  avatar?: string
  isVerified?: boolean
  location?: string
  craft?: string // For artisans
  experience?: number // For artisans
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (mobile: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: RegisterData) => Promise<void>
  switchRole: (newRole: UserRole) => void
  updateProfile: (updates: Partial<User>) => void
}

interface RegisterData {
  name: string
  mobile: string
  password: string
  role: UserRole
  email?: string
  craft?: string
  location?: string
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        try {
          const response = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          setUser(response.data.user)
        } catch (error: any) {
          // Only log error if it's not a 401 (unauthorized) which is expected for invalid tokens
          if (error.response?.status !== 401) {
            console.error('Auth check failed:', error)
          }
          localStorage.removeItem('accessToken')
          localStorage.removeItem('role')
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (mobile: string, password: string) => {
    setIsLoading(true)
    
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        mobile,
        password
      })
      
      const { accessToken, role, user: userData } = response.data
      
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('role', role)
      
      setUser(userData)
    } catch (error: any) {
      console.error('Login error:', error)
      throw new Error(error.response?.data?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('role')
  }

  const register = async (userData: RegisterData) => {
    setIsLoading(true)
    
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData)
      
      const { accessToken, role, user: newUser } = response.data
      
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('role', role)
      
      setUser(newUser)
    } catch (error: any) {
      console.error('Registration error:', error)
      throw new Error(error.response?.data?.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const switchRole = (newRole: UserRole) => {
    if (user && newRole) {
      const updatedUser = { ...user, role: newRole }
      setUser(updatedUser)
      localStorage.setItem('role', newRole)
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (user) {
      try {
        const token = localStorage.getItem('accessToken')
        const response = await axios.put(`${API_URL}/profile`, updates, {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        setUser(response.data.user)
      } catch (error: any) {
        console.error('Profile update error:', error)
        throw new Error(error.response?.data?.message || 'Profile update failed')
      }
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
      register,
      switchRole,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}