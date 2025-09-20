import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { 
  CheckCircle, 
  Package, 
  MapPin, 
  Calendar, 
  ArrowRight,
  Download,
  MessageCircle,
  Home,
  Truck
} from 'lucide-react'
import { useRouter } from '../router'
import NavigationHeader from '../navigation-header'
import Footer from '../footer'

export default function OrderConfirmation() {
  const { navigate, router } = useRouter()
  const orderId = router.params.orderId || 'ORD-SAMPLE123'
  const total = router.params.total || '5250'

  const estimatedDelivery = new Date()
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 botanical-pattern">
      <NavigationHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Order Confirmed!
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Thank you for supporting our artisan community
            </p>
            <p className="text-sm text-muted-foreground">
              Order ID: <span className="font-medium text-primary">{orderId}</span>
            </p>
          </div>

          {/* Order Details */}
          <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow mb-6">
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Playfair Display, serif' }}>
                Order Details
              </CardTitle>
              <CardDescription>
                Your order has been successfully placed and payment confirmed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Order Total</h4>
                      <p className="text-2xl font-bold text-primary">₹{total}</p>
                      <p className="text-xs text-muted-foreground">Including taxes and shipping</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Estimated Delivery</h4>
                      <p className="font-medium">{estimatedDelivery.toLocaleDateString('en-IN', { 
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                      <p className="text-xs text-muted-foreground">3-7 business days</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Shipping Address</h4>
                      <p className="text-sm text-muted-foreground">
                        123 Main Street<br />
                        Mumbai, Maharashtra 400001<br />
                        India
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Payment Status</h4>
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        Payment Confirmed
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">via Credit Card</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow mb-6">
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Playfair Display, serif' }}>
                What Happens Next?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-secondary/20 rounded-lg">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Order Confirmation</h4>
                    <p className="text-sm text-muted-foreground">
                      You'll receive an email confirmation shortly with order details
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-secondary/20 rounded-lg">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Artisan Preparation</h4>
                    <p className="text-sm text-muted-foreground">
                      Our artisans will carefully prepare and package your items
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-secondary/20 rounded-lg">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Shipping & Tracking</h4>
                    <p className="text-sm text-muted-foreground">
                      We'll send you tracking details once your order ships
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button 
              onClick={() => navigate('order-tracking', { orderId })}
              className="h-12"
            >
              <Truck className="w-4 h-4 mr-2" />
              Track Your Order
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => {/* Handle download */}}
              className="h-12 bg-card/60 border-primary/20"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Button 
              variant="outline"
              onClick={() => navigate('home')}
              className="bg-card/60 border-primary/20"
            >
              <Home className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => {/* Handle contact */}}
              className="bg-card/60 border-primary/20"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </div>

          {/* Impact Message */}
          <Card className="border-0 bg-gradient-to-r from-primary/5 to-accent/5 card-shadow">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Thank You for Supporting Artisan Communities
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your purchase directly supports skilled craftspeople and helps preserve traditional Indian art forms. 
                Together, we're building a sustainable future for handcrafted excellence.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('artisans')}
                className="bg-card/60 border-primary/20"
              >
                Meet Our Artisans
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}