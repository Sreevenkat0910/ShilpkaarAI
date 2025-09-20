import { useState, createContext, useContext, ReactNode } from 'react'

type Page = 
  | 'home'
  | 'categories'
  | 'explore'
  | 'artisans'
  | 'auth'
  | 'customer-auth'
  | 'artisan-auth'
  | 'product-catalog'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'order-tracking'
  | 'customer-dashboard'
  | 'artisan-dashboard'
  | 'artisan-products'
  | 'add-product'
  | 'edit-product'
  | 'artisan-ai-tools'
  | 'artisan-analytics'
  | 'artisan-profile'
  | 'artisan-onboarding'
  | 'artisan-verification'
  | 'messages'
  | 'favorites'
  | 'orders'
  | 'settings'
  | 'support'

interface RouterState {
  currentPage: Page
  params: Record<string, string>
}

interface RouterContextType {
  router: RouterState
  navigate: (page: Page, params?: Record<string, string>) => void
  goBack: () => void
}

const RouterContext = createContext<RouterContextType | null>(null)

export function Router({ children }: { children: ReactNode }) {
  const [router, setRouter] = useState<RouterState>({
    currentPage: 'home',
    params: {}
  })
  const [history, setHistory] = useState<RouterState[]>([])

  const navigate = (page: Page, params: Record<string, string> = {}) => {
    setHistory(prev => [...prev, router])
    setRouter({ currentPage: page, params })
  }

  const goBack = () => {
    if (history.length > 0) {
      const previous = history[history.length - 1]
      setHistory(prev => prev.slice(0, -1))
      setRouter(previous)
    }
  }

  return (
    <RouterContext.Provider value={{ router, navigate, goBack }}>
      {children}
    </RouterContext.Provider>
  )
}

export function useRouter() {
  const context = useContext(RouterContext)
  if (!context) {
    throw new Error('useRouter must be used within a Router')
  }
  return context
}