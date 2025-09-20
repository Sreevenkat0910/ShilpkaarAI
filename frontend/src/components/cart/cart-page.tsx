import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { 
  Plus, 
  Minus, 
  X, 
  ArrowRight,
  Package,
  Leaf,
  Sparkles,
  ArrowLeft,
  ShoppingCart,
  Truck,
  Shield,
  RefreshCw
} from 'lucide-react'
import { useCart } from './cart-context'
import { useRouter } from '../router'
import NavigationHeader from '../navigation-header'
import Footer from '../footer'
import { ImageWithFallback } from '../figma/ImageWithFallback'

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalItems, getTotalPrice } = useCart()
  const { navigate, goBack } = useRouter()

  const shippingCost = getTotalPrice() > 2000 ? 0 : 150
  const taxRate = 0.18 // 18% GST
  const taxAmount = getTotalPrice() * taxRate
  const finalTotal = getTotalPrice() + shippingCost + taxAmount

  const handleCheckout = () => {
    navigate('checkout')
  }

  const handleContinueShopping = () => {
    navigate('categories')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 botanical-pattern">
      <NavigationHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="icon" onClick={goBack} className="hover:bg-card/60">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl" style={{ fontFamily: 'Playfair Display, serif' }}>
              Shopping Cart
            </h1>
            <p className="text-muted-foreground">
              {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-secondary/60 rounded-full flex items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Discover unique handcrafted treasures from our talented artisan community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleContinueShopping} className="px-8">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Start Shopping
              </Button>
              <Button variant="outline" onClick={() => navigate('explore')}>
                Explore Collections
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Cart Items
                    </h2>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('categories')}
                      className="bg-card/60 border-primary/20"
                    >
                      Add More Items
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-start space-x-4 p-4 bg-secondary/20 rounded-xl">
                        <div className="relative">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded-lg card-shadow"
                          />
                          <div className="absolute -top-2 -right-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold mb-1">{item.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">by {item.artisan}</p>
                          
                          <div className="flex items-center space-x-3 mb-3">
                            <span className="font-bold text-primary">₹{item.price}</span>
                            {item.originalPrice && (
                              <>
                                <span className="text-sm text-muted-foreground line-through">
                                  ₹{item.originalPrice}
                                </span>
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                  {Math.round((1 - item.price / item.originalPrice) * 100)}% off
                                </Badge>
                              </>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-10 w-10 bg-card border-primary/20"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-12 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-10 w-10 bg-card border-primary/20"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-semibold">
                                ₹{(item.price * item.quantity).toLocaleString()}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromCart(item.id)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-1"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-card/60 rounded-xl card-shadow">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Secure Payment</h4>
                    <p className="text-xs text-muted-foreground">256-bit SSL encryption</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-card/60 rounded-xl card-shadow">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Truck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Fast Delivery</h4>
                    <p className="text-xs text-muted-foreground">3-7 business days</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-card/60 rounded-xl card-shadow">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <RefreshCw className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Easy Returns</h4>
                    <p className="text-xs text-muted-foreground">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Order Summary
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({getTotalItems()} items)</span>
                      <span>₹{getTotalPrice().toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                        {shippingCost === 0 ? 'Free' : `₹${shippingCost}`}
                      </span>
                    </div>
                    
                    {shippingCost === 0 && (
                      <div className="flex items-center space-x-2 text-xs text-green-600 bg-green-50 p-2 rounded-lg">
                        <Leaf className="h-3 w-3" />
                        <span>You saved ₹150 on shipping!</span>
                      </div>
                    )}
                    
                    {shippingCost > 0 && (
                      <div className="text-xs text-muted-foreground bg-secondary/40 p-2 rounded-lg">
                        Add ₹{(2000 - getTotalPrice()).toLocaleString()} more for free shipping
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span>GST (18%)</span>
                      <span>₹{taxAmount.toFixed(0)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-primary">₹{finalTotal.toFixed(0)}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mt-6">
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

                  <div className="mt-6 p-4 bg-secondary/20 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Why ShilpkaarAI?</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Authentic handcrafted products</li>
                      <li>• Direct support to artisan communities</li>
                      <li>• AI-enhanced product stories</li>
                      <li>• Sustainable and ethical sourcing</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}