import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Package,
  TrendingUp,
  Heart,
  MessageCircle,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Camera,
  Sparkles,
  Copy,
  Share2,
  Archive,
  RefreshCw,
  Settings
} from 'lucide-react'
import { useRouter } from '../router'
import { useAuth } from '../auth/auth-context'
import NavigationHeader from '../navigation-header'
import Footer from '../footer'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import { apiCall, ApiError } from '../../utils/api'

export default function ArtisanProducts() {
  const { navigate } = useRouter()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [deletingProduct, setDeletingProduct] = useState<string | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch all products and filter by current artisan
      const response = await apiCall('/products/all')
      const allProducts = response.data.productsData
      
      // Filter products for current artisan
      const artisanProducts = allProducts.filter((product: any) => 
        product.artisan._id === user?.id
      )
      
      setProducts(artisanProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  // Handler functions for product actions
  const handleEditProduct = (productId: string) => {
    navigate('edit-product', { id: productId })
  }

  const handleViewProduct = (productId: string) => {
    navigate('product-detail', { id: productId })
  }

  const handleDuplicateProduct = (productId: string) => {
    // TODO: Implement duplicate functionality
    console.log('Duplicate product:', productId)
    // For now, just show a message
    alert('Duplicate functionality will be implemented soon!')
  }

  const handleShareProduct = (productId: string) => {
    // TODO: Implement share functionality
    console.log('Share product:', productId)
    // For now, copy product URL to clipboard
    const productUrl = `${window.location.origin}/product/${productId}`
    navigator.clipboard.writeText(productUrl)
    alert('Product link copied to clipboard!')
  }

  const handleArchiveProduct = (productId: string) => {
    // TODO: Implement archive functionality
    console.log('Archive product:', productId)
    alert('Archive functionality will be implemented soon!')
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }
    
    setDeletingProduct(productId)
    try {
      await apiCall(`/products/${productId}`, {
        method: 'DELETE'
      })
      
      // Remove product from local state
      setProducts(prev => prev.filter(p => p._id !== productId))
      alert('Product deleted successfully!')
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product. Please try again.')
    } finally {
      setDeletingProduct(null)
    }
  }

  const handleRefreshProduct = (productId: string) => {
    // TODO: Implement refresh functionality (re-sync with marketplace)
    console.log('Refresh product:', productId)
    alert('Refresh functionality will be implemented soon!')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'draft':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'out_of_stock':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'draft':
        return 'bg-yellow-100 text-yellow-700'
      case 'out_of_stock':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-green-100 text-green-700'
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTab = activeTab === 'all' || product.status === activeTab
    
    return matchesSearch && matchesTab
  })

  const stats = {
    total: products.length,
    active: products.filter(p => p.isActive !== false).length,
    draft: products.filter(p => p.isActive === false).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    totalViews: products.reduce((sum, p) => sum + (p.views || 0), 0),
    totalOrders: products.reduce((sum, p) => sum + (p.orders || 0), 0),
    totalRevenue: products.reduce((sum, p) => sum + (p.price * (p.orders || 0)), 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 botanical-pattern">
        <NavigationHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 botanical-pattern">
        <NavigationHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-red-500 mb-4">❌</div>
            <h2 className="text-2xl font-bold mb-2">Error Loading Products</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchProducts}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 botanical-pattern">
      <NavigationHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl md:text-4xl mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              My Products
            </h1>
            <p className="text-muted-foreground">
              Manage your product listings and track their performance
            </p>
          </div>
          
          <Button 
            onClick={() => navigate('add-product')}
            className="shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mx-auto mb-2">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Total Products</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mx-auto mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-primary">{stats.active}</div>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg mx-auto mb-2">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-primary">{stats.draft}</div>
              <p className="text-xs text-muted-foreground">Drafts</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg mx-auto mb-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-primary">{stats.outOfStock}</div>
              <p className="text-xs text-muted-foreground">Out of Stock</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg mx-auto mb-2">
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-primary">{stats.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total Views</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg mx-auto mb-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-primary">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Total Orders</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mx-auto mb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-primary">₹{(stats.totalRevenue / 1000).toFixed(0)}K</div>
              <p className="text-xs text-muted-foreground">Revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-input-background border-primary/20 focus:border-primary/40 rounded-xl"
                />
              </div>
              <Button variant="outline" className="bg-card/60 border-primary/20">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Tabs */}
        <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 bg-secondary/40 border border-primary/10">
                <TabsTrigger value="all" className="data-[state=active]:bg-card">
                  All ({stats.total})
                </TabsTrigger>
                <TabsTrigger value="active" className="data-[state=active]:bg-card">
                  Active ({stats.active})
                </TabsTrigger>
                <TabsTrigger value="draft" className="data-[state=active]:bg-card">
                  Drafts ({stats.draft})
                </TabsTrigger>
                <TabsTrigger value="out_of_stock" className="data-[state=active]:bg-card">
                  Out of Stock ({stats.outOfStock})
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-secondary/60 rounded-full flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">No products found</h3>
                    <p className="text-muted-foreground mb-6">
                      {searchQuery ? 'Try adjusting your search query' : 'Start by adding your first product'}
                    </p>
                    <Button onClick={() => navigate('add-product')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <Card 
                        key={product._id}
                        className="group border-0 bg-card/40 backdrop-blur-sm card-shadow hover:card-shadow-lg transition-all duration-300"
                      >
                        <CardContent className="p-4">
                          <div className="relative mb-4">
                            <ImageWithFallback
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <div className="absolute top-3 left-3">
                              <Badge className={`${getStatusColor(product.isActive !== false ? 'active' : 'draft')} border-0`}>
                                <div className="flex items-center">
                                  {getStatusIcon(product.isActive !== false ? 'active' : 'draft')}
                                  <span className="ml-1 capitalize">
                                    {product.isActive !== false ? 'Active' : 'Draft'}
                                  </span>
                                </div>
                              </Badge>
                            </div>
                            <div className="absolute top-3 right-3">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem onClick={() => handleViewProduct(product._id)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditProduct(product._id)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Product
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDuplicateProduct(product._id)}>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleShareProduct(product._id)}>
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Share Product
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleRefreshProduct(product._id)}>
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Refresh
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleArchiveProduct(product._id)}>
                                    <Archive className="h-4 w-4 mr-2" />
                                    Archive
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteProduct(product._id)}
                                    className="text-red-600 focus:text-red-600"
                                    disabled={deletingProduct === product._id}
                                  >
                                    {deletingProduct === product._id ? (
                                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                      <Trash2 className="h-4 w-4 mr-2" />
                                    )}
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                                {product.name}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {product.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg font-semibold text-primary">
                                    ₹{product.price.toLocaleString()}
                                  </span>
                                  {product.originalPrice && product.originalPrice > product.price && (
                                    <span className="text-sm text-muted-foreground line-through">
                                      ₹{product.originalPrice.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Stock: {product.stock || 0} units
                                </p>
                              </div>
                              <Badge variant="outline" className="border-primary/20">
                                {product.category}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                              <div className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                <span>{product.views || 0}</span>
                              </div>
                              <div className="flex items-center">
                                <Heart className="h-3 w-3 mr-1" />
                                <span>{product.likes || 0}</span>
                              </div>
                              <div className="flex items-center">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                <span>{product.orders || 0}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                <span className="text-sm font-medium">{product.rating || 0}</span>
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({product.reviewCount || 0})
                                </span>
                              </div>
                              <div className="flex space-x-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-card/60 border-primary/20"
                                  onClick={() => navigate('edit-product', { id: product._id })}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-card/60 border-primary/20"
                                  onClick={() => navigate('product-detail', { id: product._id })}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* AI Enhancement Suggestion */}
        <Card className="border-0 bg-gradient-to-r from-primary/5 to-accent/5 card-shadow mt-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Enhance Your Product Photos with AI</h3>
                <p className="text-muted-foreground mb-4">
                  Upload better product photos to increase sales. Our AI can automatically enhance lighting, 
                  remove backgrounds, and make your products look more professional.
                </p>
                <Button onClick={() => navigate('artisan-ai-tools')}>
                  <Camera className="h-4 w-4 mr-2" />
                  Try AI Enhancement
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}