import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useOrdersStore } from '../../stores/orders-store'
import { toast } from 'react-hot-toast'

export interface CartItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  artisan: string
  artisanId: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  checkout: (shippingAddress: any) => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { createOrder } = useOrdersStore()

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('shilpkaarai_cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
        localStorage.removeItem('shilpkaarai_cart')
      }
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('shilpkaarai_cart', JSON.stringify(items))
  }, [items])

  const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === newItem.id)
      if (existingItem) {
        return currentItems.map(item =>
          item.id === newItem.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...currentItems, { ...newItem, quantity: 1 }]
    })
    toast.success('Item added to cart!')
  }

  const removeFromCart = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id))
    toast.success('Item removed from cart!')
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
    toast.success('Cart cleared!')
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const checkout = async (shippingAddress: any) => {
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        shippingAddress,
        paymentMethod: 'cod' as const
      }

      await createOrder(orderData)
      clearCart()
      toast.success('Order placed successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order')
      throw error
    }
  }

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      isOpen,
      setIsOpen,
      checkout
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}