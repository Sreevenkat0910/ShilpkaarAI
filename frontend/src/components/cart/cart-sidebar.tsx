import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { Separator } from '../ui/separator'
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  X, 
  ArrowRight,
  Package,
  Leaf,
  Sparkles
} from 'lucide-react'
import { useCart } from './cart-context'
import { useRouter } from '../router'
import { ImageWithFallback } from '../figma/ImageWithFallback'

export default function CartSidebar() {
  const { items, updateQuantity, removeFromCart, getTotalItems, getTotalPrice, isOpen, setIsOpen } = useCart()
  const { navigate } = useRouter()

  const shippingCost = getTotalPrice() > 2000 ? 0 : 150
  const taxRate = 0.18 // 18% GST
  const taxAmount = getTotalPrice() * taxRate
  const finalTotal = getTotalPrice() + shippingCost + taxAmount

  const handleCheckout = () => {
    setIsOpen(false)
    navigate('checkout')
  }

  const handleContinueShopping = () => {
    setIsOpen(false)
    navigate('categories')
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-full sm:w-96 bg-card border-border/60 flex flex-col">
        <SheetHeader className="pb-4 border-b border-border/60">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <ShoppingCart className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <SheetTitle className="text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
                Your Cart
              </SheetTitle>
              <p className="text-sm text-muted-foreground">
                {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-auto py-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary/60 rounded-full flex items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6 text-sm">
                Discover unique handcrafted treasures from our artisans
              </p>
              <Button onClick={handleContinueShopping} className="w-full">
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-secondary/20 rounded-xl p-4 space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="absolute -top-1 -right-1">
                        <Sparkles className="h-3 w-3 text-primary" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">by {item.artisan}</p>
                      
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="font-semibold text-primary">₹{item.price}</span>
                        {item.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            ₹{item.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 bg-card border-primary/20"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 bg-card border-primary/20"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="text-sm font-semibold">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border/60 pt-4 space-y-4">
            {/* Order Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{getTotalPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                  {shippingCost === 0 ? 'Free' : `₹${shippingCost}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>₹{taxAmount.toFixed(0)}</span>
              </div>
              
              {shippingCost === 0 && (
                <div className="flex items-center space-x-1 text-xs text-green-600">
                  <Leaf className="h-3 w-3" />
                  <span>Free shipping on orders above ₹2,000</span>
                </div>
              )}
              
              <Separator className="my-2" />
              
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span className="text-primary">₹{finalTotal.toFixed(0)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button onClick={handleCheckout} className="w-full h-12 shadow-sm">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={handleContinueShopping}
                className="w-full bg-card/60 border-primary/20 hover:bg-primary/5"
              >
                Continue Shopping
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center space-x-4 pt-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Authentic Products</span>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}