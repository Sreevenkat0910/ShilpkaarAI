import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { 
  ShoppingBag, 
  Heart, 
  Package, 
  MapPin, 
  Calendar,
  Star,
  MessageCircle,
  ArrowRight,
  Settings,
  LogOut,
  Truck,
  CreditCard,
  Award
} from 'lucide-react'
import { useRouter } from '../router'
import { useAuth } from '../auth/auth-context'
import { useFavorites } from '../favorites/favorites-context'
import { useOrdersStore } from '../../stores/orders-store'
import NavigationHeader from '../navigation-header'
import Footer from '../footer'
import { ImageWithFallback } from '../figma/ImageWithFallback'

export default function CustomerDashboard() {
  const { navigate } = useRouter()
  const { user, logout } = useAuth()
  const { favorites, loading: favoritesLoading, getUserFavoriteCount, removeFromFavorites, isFavorited } = useFavorites()
  const { myOrders, isLoading: ordersLoading, fetchMyOrders } = useOrdersStore()
  const [activeTab, setActiveTab] = useState('orders')
  const [removingId, setRemovingId] = useState<string | null>(null)

  // Load orders when component mounts
  React.useEffect(() => {
    if (user) {
      fetchMyOrders()
    }
  }, [user, fetchMyOrders])

  // Get recent orders (last 2)
  const recentOrders = myOrders.slice(0, 2)

  const handleRemoveFavorite = async (productId: string) => {
    try {
      setRemovingId(productId)
      await removeFromFavorites(productId)
    } catch (error) {
      console.error('Error removing favorite:', error)
    } finally {
      setRemovingId(null)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('home')
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 botanical-pattern">
      <NavigationHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                Welcome back, {user.name}
              </h1>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  <span>Customer</span>
                </div>
                {user.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{user.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('settings')}
              className="bg-card/60 border-primary/20"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="bg-card/60 border-primary/20 hover:border-destructive/30 hover:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{ordersLoading ? '...' : myOrders.length}</p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{favoritesLoading ? '...' : favorites.length}</p>
                  <p className="text-sm text-muted-foreground">Favorites</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">0</p>
                  <p className="text-sm text-muted-foreground">Reviews Given</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">0</p>
                  <p className="text-sm text-muted-foreground">Active Chats</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Dashboard */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Playfair Display, serif' }}>
                  Your Dashboard
                </CardTitle>
                <CardDescription>
                  Manage your orders, favorites, and account settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 bg-secondary/40 border border-primary/10">
                    <TabsTrigger value="orders" className="data-[state=active]:bg-card">
                      Recent Orders
                    </TabsTrigger>
                    <TabsTrigger value="favorites" className="data-[state=active]:bg-card">
                      Favorites
                    </TabsTrigger>
                    <TabsTrigger value="messages" className="data-[state=active]:bg-card">
                      Messages
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="orders" className="space-y-4 mt-6">
                    {ordersLoading ? (
                      <div className="text-center py-8">
                        <div className="w-8 h-8 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-muted-foreground">Loading orders...</p>
                      </div>
                    ) : recentOrders.length > 0 ? (
                      <>
                        {recentOrders.map((order) => (
                          <div key={order._id} className="flex items-center space-x-4 p-4 bg-secondary/20 rounded-xl">
                            <ImageWithFallback
                              src={order.items[0]?.product?.images[0] || ''}
                              alt="Order item"
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium">Order {order.orderNumber}</h4>
                              <p className="text-sm text-muted-foreground">
                                {order.items.length} items • by {order.items[0]?.product?.artisanName || 'Unknown'}
                              </p>
                              <div className="flex items-center space-x-3 mt-1">
                                <Badge 
                                  variant={order.status === 'delivered' ? 'default' : 'secondary'}
                                  className={order.status === 'delivered' ? 'bg-green-100 text-green-700' : ''}
                                >
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">₹{order.totalAmount}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => navigate('order-tracking', { orderId: order._id })}
                                >
                                  <Truck className="h-4 w-4 mr-1" />
                                  Track
                                </Button>
                                {order.items[0]?.product && isFavorited(order.items[0].product._id) && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="bg-card/60 border-primary/20"
                                    onClick={() => handleRemoveFavorite(order.items[0].product._id)}
                                    disabled={removingId === order.items[0].product._id}
                                  >
                                    {removingId === order.items[0].product._id ? (
                                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <Heart className="h-4 w-4 fill-current text-red-500" />
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <Button 
                          variant="outline" 
                          className="w-full bg-card/60 border-primary/20"
                          onClick={() => navigate('orders')}
                        >
                          View All Orders
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="font-semibold mb-2">No orders yet</h3>
                        <p className="text-muted-foreground mb-4 text-sm">
                          Start shopping and your orders will appear here
                        </p>
                        <Button onClick={() => navigate('explore')}>
                          <Package className="h-4 w-4 mr-2" />
                          Start Shopping
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="favorites" className="space-y-4 mt-6">
                    {favoritesLoading ? (
                      <div className="text-center py-8">
                        <div className="w-8 h-8 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-muted-foreground">Loading favorites...</p>
                      </div>
                    ) : favorites.length > 0 ? (
                      <>
                        {favorites.slice(0, 3).map((favorite) => (
                          <div key={favorite._id} className="flex items-center space-x-4 p-4 bg-secondary/20 rounded-xl">
                            <ImageWithFallback
                              src={favorite.product.images[0] || ''}
                              alt={favorite.product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium">{favorite.product.name}</h4>
                              <p className="text-sm text-muted-foreground">by {favorite.product.artisanName}</p>
                              <p className="font-semibold text-primary mt-1">₹{favorite.product.price}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm"
                                onClick={() => navigate('product-detail', { id: favorite.product._id })}
                              >
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="bg-card/60 border-primary/20"
                                onClick={() => handleRemoveFavorite(favorite.product._id)}
                                disabled={removingId === favorite.product._id}
                              >
                                {removingId === favorite.product._id ? (
                                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Heart className="h-4 w-4 fill-current text-red-500" />
                                )}
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        <Button 
                          variant="outline" 
                          className="w-full bg-card/60 border-primary/20"
                          onClick={() => navigate('favorites')}
                        >
                          View All Favorites
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                          <Heart className="h-8 w-8 text-red-600" />
                        </div>
                        <h3 className="font-semibold mb-2">No favorites yet</h3>
                        <p className="text-muted-foreground mb-4 text-sm">
                          Start exploring and save items you love
                        </p>
                        <Button onClick={() => navigate('explore')}>
                          <Heart className="h-4 w-4 mr-2" />
                          Discover Products
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="messages" className="space-y-4 mt-6">
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                        <MessageCircle className="h-8 w-8 text-purple-600" />
                      </div>
                      <h3 className="font-semibold mb-2">No new messages</h3>
                      <p className="text-muted-foreground mb-4 text-sm">
                        Start a conversation with artisans about their products
                      </p>
                      <Button onClick={() => navigate('artisans')}>
                        Browse Artisans
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  onClick={() => navigate('categories')}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Shop by Category
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-card/60 border-primary/20"
                  onClick={() => navigate('explore')}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Explore Collections
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-card/60 border-primary/20"
                  onClick={() => navigate('artisans')}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat with Artisans
                </Button>
              </CardContent>
            </Card>

            {/* Profile Status */}
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Profile Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Verified</span>
                  <Badge className="bg-green-100 text-green-700">Verified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Phone Verified</span>
                  <Badge className="bg-green-100 text-green-700">Verified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Delivery Address</span>
                  <Badge variant="secondary">Added</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Payment Method</span>
                  <Badge variant="secondary">
                    <CreditCard className="h-3 w-3 mr-1" />
                    Added
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Our support team is here to help with any questions.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full bg-card/60 border-primary/20"
                  onClick={() => navigate('support')}
                >
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