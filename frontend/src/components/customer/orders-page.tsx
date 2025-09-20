import React, { useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { 
  ArrowLeft,
  Search,
  Filter,
  Package,
  Truck,
  CheckCircle,
  Clock,
  RotateCcw,
  Download,
  Star,
  MessageCircle,
  Calendar,
  MapPin,
  User
} from 'lucide-react'
import { useRouter } from '../router'
import { useOrdersStore } from '../../stores/orders-store'
import NavigationHeader from '../navigation-header'
import Footer from '../footer'
import { ImageWithFallback } from '../figma/ImageWithFallback'

export default function OrdersPage() {
  const { goBack, navigate } = useRouter()
  const { myOrders, isLoading, fetchMyOrders } = useOrdersStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  // Load orders when component mounts
  React.useEffect(() => {
    fetchMyOrders()
  }, [fetchMyOrders])

  // Filter and sort orders
  const filteredOrders = myOrders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some(item => item.product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'amount-high':
        return b.totalAmount - a.totalAmount
      case 'amount-low':
        return a.totalAmount - b.totalAmount
      default:
        return 0
    }
  })

  // Calculate order statistics
  const orderStats = {
    total: myOrders.length,
    delivered: myOrders.filter(order => order.status === 'delivered').length,
    shipped: myOrders.filter(order => order.status === 'shipped').length,
    confirmed: myOrders.filter(order => order.status === 'confirmed').length,
    cancelled: myOrders.filter(order => order.status === 'cancelled').length
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
      case 'shipped':
        return <Truck className="h-4 w-4" />
      case 'confirmed':
        return <Package className="h-4 w-4" />
      case 'cancelled':
        return <RotateCcw className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-700'
      case 'shipped':
        return 'bg-blue-100 text-blue-700'
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
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
              My Orders
            </h1>
            <p className="text-muted-foreground">
              Track and manage all your orders
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
            <CardContent className="p-4 text-center">
              <h3 className="text-2xl font-bold text-primary">{orderStats.total}</h3>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </CardContent>
          </Card>
          <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
            <CardContent className="p-4 text-center">
              <h3 className="text-2xl font-bold text-green-600">{orderStats.delivered}</h3>
              <p className="text-sm text-muted-foreground">Delivered</p>
            </CardContent>
          </Card>
          <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
            <CardContent className="p-4 text-center">
              <h3 className="text-2xl font-bold text-blue-600">{orderStats.shipped}</h3>
              <p className="text-sm text-muted-foreground">Shipped</p>
            </CardContent>
          </Card>
          <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
            <CardContent className="p-4 text-center">
              <h3 className="text-2xl font-bold text-yellow-600">{orderStats.confirmed}</h3>
              <p className="text-sm text-muted-foreground">Confirmed</p>
            </CardContent>
          </Card>
          <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
            <CardContent className="p-4 text-center">
              <h3 className="text-2xl font-bold text-red-600">{orderStats.cancelled}</h3>
              <p className="text-sm text-muted-foreground">Cancelled</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-input-background border-primary/20"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-input-background border-primary/20">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-input-background border-primary/20">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="amount-high">Highest Amount</SelectItem>
                  <SelectItem value="amount-low">Lowest Amount</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="bg-card/60 border-primary/20">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          ) : sortedOrders.length > 0 ? (
            sortedOrders.map((order) => (
              <Card key={order._id} className="border-0 bg-card/60 backdrop-blur-sm card-shadow hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Order Image and Basic Info */}
                    <div className="flex items-center space-x-4">
                      <ImageWithFallback
                        src={order.items[0]?.product?.images[0] || ''}
                        alt="Order item"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">Order #{order.orderNumber}</h3>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Artisan Info */}
                    <div>
                      <h4 className="font-medium mb-1">Artisan</h4>
                      <div className="flex items-center space-x-2 mb-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{order.items[0]?.product?.artisanName || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{order.shippingAddress?.city || 'Unknown'}</span>
                      </div>
                    </div>

                    {/* Status and Delivery */}
                    <div>
                      <h4 className="font-medium mb-2">Status</h4>
                      <Badge className={`${getStatusColor(order.status)} mb-2`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </Badge>
                      {order.trackingNumber && (
                        <p className="text-sm text-muted-foreground">
                          Tracking: {order.trackingNumber}
                        </p>
                      )}
                    </div>

                    {/* Total and Actions */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <h4 className="font-medium mb-1">Total</h4>
                        <p className="text-2xl font-bold text-primary">₹{order.totalAmount}</p>
                      </div>
                      <div className="flex flex-col space-y-2 mt-4">
                        <Button 
                          size="sm" 
                          onClick={() => navigate('order-tracking', { orderId: order._id })}
                          className="w-full"
                        >
                          <Package className="h-4 w-4 mr-1" />
                          Track Order
                        </Button>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          {order.status === 'delivered' && (
                            <Button variant="outline" size="sm" className="flex-1">
                              <Star className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Details */}
                  <div className="mt-4 pt-4 border-t border-border/60">
                    <h4 className="font-medium mb-2">Order Items:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="text-sm bg-secondary/20 p-2 rounded">
                          <span className="font-medium">{item.product.name}</span>
                          <span className="text-muted-foreground"> × {item.quantity}</span>
                          <span className="float-right">₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'You haven\'t placed any orders yet'
                  }
                </p>
                <Button onClick={() => navigate('explore')}>
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}