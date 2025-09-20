import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Separator } from '../ui/separator'
import { Checkbox } from '../ui/checkbox'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone,
  Building2,
  MapPin,
  User,
  Mail,
  Phone,
  Leaf,
  Shield,
  Package
} from 'lucide-react'
import { useCart } from './cart-context'
import { useRouter } from '../router'
import NavigationHeader from '../navigation-header'
import { ImageWithFallback } from '../figma/ImageWithFallback'

export default function CheckoutPage() {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCart()
  const { navigate, goBack } = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [sameAsShipping, setSameAsShipping] = useState(true)

  const shippingCost = getTotalPrice() > 2000 ? 0 : 150
  const taxAmount = getTotalPrice() * 0.18
  const finalTotal = getTotalPrice() + shippingCost + taxAmount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false)
      clearCart()
      navigate('order-confirmation', { 
        orderId: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        total: finalTotal.toFixed(0)
      })
    }, 3000)
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
              Checkout
            </h1>
            <p className="text-muted-foreground">
              Complete your order of {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center" style={{ fontFamily: 'Playfair Display, serif' }}>
                    <MapPin className="h-5 w-5 mr-2" />
                    Shipping Information
                  </CardTitle>
                  <CardDescription>Where should we deliver your handcrafted treasures?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" required className="bg-input-background border-primary/20" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" required className="bg-input-background border-primary/20" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required className="bg-input-background border-primary/20" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+91 9876543210" required className="bg-input-background border-primary/20" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="123 Main Street" required className="bg-input-background border-primary/20" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="Mumbai" required className="bg-input-background border-primary/20" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Select required>
                        <SelectTrigger className="bg-input-background border-primary/20">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MH">Maharashtra</SelectItem>
                          <SelectItem value="DL">Delhi</SelectItem>
                          <SelectItem value="KA">Karnataka</SelectItem>
                          <SelectItem value="TN">Tamil Nadu</SelectItem>
                          <SelectItem value="WB">West Bengal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pincode">PIN Code</Label>
                    <Input id="pincode" placeholder="400001" required className="bg-input-background border-primary/20" />
                  </div>
                </CardContent>
              </Card>

              {/* Billing Information */}
              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center" style={{ fontFamily: 'Playfair Display, serif' }}>
                    <Building2 className="h-5 w-5 mr-2" />
                    Billing Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox 
                      id="sameAsShipping" 
                      checked={sameAsShipping}
                      onCheckedChange={setSameAsShipping}
                    />
                    <Label htmlFor="sameAsShipping" className="text-sm">
                      Same as shipping address
                    </Label>
                  </div>
                  
                  {!sameAsShipping && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="billingAddress">Billing Address</Label>
                        <Input id="billingAddress" placeholder="123 Business Street" className="bg-input-background border-primary/20" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="billingCity">City</Label>
                          <Input id="billingCity" placeholder="Mumbai" className="bg-input-background border-primary/20" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billingPincode">PIN Code</Label>
                          <Input id="billingPincode" placeholder="400001" className="bg-input-background border-primary/20" />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center" style={{ fontFamily: 'Playfair Display, serif' }}>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>Choose your preferred payment option</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-3 p-4 rounded-lg border border-primary/20 hover:bg-secondary/20 transition-colors">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center space-x-3 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5" />
                        <span>Credit/Debit Card</span>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 rounded-lg border border-primary/20 hover:bg-secondary/20 transition-colors">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex items-center space-x-3 cursor-pointer flex-1">
                        <Smartphone className="h-5 w-5" />
                        <span>UPI Payment</span>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 rounded-lg border border-primary/20 hover:bg-secondary/20 transition-colors">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet" className="flex items-center space-x-3 cursor-pointer flex-1">
                        <Building2 className="h-5 w-5" />
                        <span>Digital Wallet</span>
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4 mt-4 p-4 bg-secondary/20 rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="bg-input-background border-primary/20" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" className="bg-input-background border-primary/20" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" className="bg-input-background border-primary/20" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input id="cardName" placeholder="John Doe" className="bg-input-background border-primary/20" />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="mt-4 p-4 bg-secondary/20 rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="upiId">UPI ID</Label>
                        <Input id="upiId" placeholder="user@paytm" className="bg-input-background border-primary/20" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow sticky top-24">
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'Playfair Display, serif' }}>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="relative">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium line-clamp-1">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">by {item.artisan}</p>
                        </div>
                        <div className="text-sm font-medium">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Pricing */}
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
                    
                    <Separator />
                    
                    <div className="flex justify-between font-semibold text-base">
                      <span>Total</span>
                      <span className="text-primary">₹{finalTotal.toFixed(0)}</span>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 shadow-sm" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Complete Order
                      </>
                    )}
                  </Button>

                  {/* Trust Indicators */}
                  <div className="space-y-2 pt-4 border-t border-primary/10">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Shield className="h-3 w-3 mr-2 text-green-600" />
                      <span>Secure 256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Package className="h-3 w-3 mr-2 text-blue-600" />
                      <span>Authentic handcrafted products</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Leaf className="h-3 w-3 mr-2 text-green-600" />
                      <span>Supporting artisan communities</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}