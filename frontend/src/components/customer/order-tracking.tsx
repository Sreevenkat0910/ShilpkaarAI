import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { 
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  Phone,
  MessageCircle,
  Star,
  Download,
  User
} from 'lucide-react'
import { useRouter } from '../router'
import NavigationHeader from '../navigation-header'
import Footer from '../footer'
import { ImageWithFallback } from '../figma/ImageWithFallback'

export default function OrderTracking() {
  const { goBack } = useRouter()
  
  // Mock order data - in real app this would come from props or API
  const order = {
    id: 'ORD-12344',
    date: '2024-01-10',
    status: 'In Transit',
    total: 1850,
    items: [
      {
        id: '1',
        name: 'Blue Pottery Vase Set',
        price: 1850,
        quantity: 1,
        artisan: 'Rajesh Kumar',
        image: 'https://images.unsplash.com/photo-1716876995651-1ff85b65a6d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBoYW5kaWNyYWZ0cyUyMHBvdHRlcnklMjBhcnRpc2FufGVufDF8fHx8MTc1ODM2NjIwMHww&ixlib=rb-4.1.0&q=80&w=400'
      }
    ],
    artisan: {
      name: 'Rajesh Kumar',
      location: 'Jaipur, Rajasthan',
      phone: '+91 98765 43210',
      verified: true
    },
    shipping: {
      address: '123, MG Road, Bangalore, Karnataka - 560001',
      estimatedDelivery: '2024-01-18',
      trackingNumber: 'TRK123456789'
    },
    timeline: [
      {
        status: 'Order Placed',
        date: '2024-01-10',
        time: '10:30 AM',
        completed: true,
        description: 'Your order has been confirmed'
      },
      {
        status: 'Payment Confirmed',
        date: '2024-01-10',
        time: '10:32 AM',
        completed: true,
        description: 'Payment received successfully'
      },
      {
        status: 'Order Accepted',
        date: '2024-01-10',
        time: '11:15 AM',
        completed: true,
        description: 'Artisan has accepted your order'
      },
      {
        status: 'In Production',
        date: '2024-01-11',
        time: '09:00 AM',
        completed: true,
        description: 'Your item is being crafted'
      },
      {
        status: 'Quality Check',
        date: '2024-01-13',
        time: '02:30 PM',
        completed: true,
        description: 'Quality verification completed'
      },
      {
        status: 'Shipped',
        date: '2024-01-14',
        time: '11:00 AM',
        completed: true,
        description: 'Package handed to delivery partner'
      },
      {
        status: 'In Transit',
        date: '2024-01-15',
        time: '08:00 AM',
        completed: true,
        description: 'On the way to your location',
        current: true
      },
      {
        status: 'Out for Delivery',
        date: '2024-01-18',
        time: 'Expected',
        completed: false,
        description: 'Will be delivered today'
      },
      {
        status: 'Delivered',
        date: '2024-01-18',
        time: 'Expected',
        completed: false,
        description: 'Package delivered successfully'
      }
    ]
  }

  const currentStep = order.timeline.findIndex(step => step.current) + 1
  const progressPercentage = (currentStep / order.timeline.length) * 100

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
              Track Your Order
            </h1>
            <p className="text-muted-foreground">
              Order #{order.id} • Placed on {new Date(order.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Tracking Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Truck className="h-5 w-5 mr-2 text-primary" />
                      Order Status
                    </CardTitle>
                    <CardDescription>
                      Current status: <Badge className="ml-1 bg-blue-100 text-blue-700">{order.status}</Badge>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                    <p className="font-semibold">{new Date(order.shipping.estimatedDelivery).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={progressPercentage} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {Math.round(progressPercentage)}% Complete • Step {currentStep} of {order.timeline.length}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
                <CardDescription>Track your order journey from creation to delivery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.timeline.map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed 
                            ? step.current 
                              ? 'bg-blue-500 animate-pulse' 
                              : 'bg-green-500' 
                            : 'bg-gray-200'
                        }`}>
                          {step.completed ? (
                            step.current ? (
                              <Truck className="h-4 w-4 text-white" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-white" />
                            )
                          ) : (
                            <div className="w-2 h-2 bg-gray-400 rounded-full" />
                          )}
                        </div>
                        {index < order.timeline.length - 1 && (
                          <div className={`w-px h-12 ${
                            step.completed ? 'bg-green-500' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className={`font-medium ${
                            step.current ? 'text-blue-600' : step.completed ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {step.status}
                          </h4>
                          {step.current && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">Current</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{step.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{step.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{step.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>Items in this order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-secondary/20 rounded-lg">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">by {item.artisan}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm">Qty: {item.quantity}</span>
                          <span className="font-semibold">₹{item.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Artisan Info */}
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Artisan Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{order.artisan.name}</h4>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{order.artisan.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Chat
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Shipping Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">Delivery Address</h4>
                  <p className="text-sm text-muted-foreground">{order.shipping.address}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Tracking Number</h4>
                  <p className="text-sm font-mono bg-secondary/20 p-2 rounded">
                    {order.shipping.trackingNumber}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Estimated Delivery</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.shipping.estimatedDelivery).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Order Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Report Issue
                </Button>
                {order.status === 'Delivered' && (
                  <Button className="w-full justify-start">
                    <Star className="h-4 w-4 mr-2" />
                    Rate & Review
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Need Help */}
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Our support team is here to help with any questions about your order.
                </p>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}