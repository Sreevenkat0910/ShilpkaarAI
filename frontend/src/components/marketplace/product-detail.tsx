import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Separator } from '../ui/separator'
import { 
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart,
  Star,
  MapPin,
  Shield,
  Truck,
  RotateCcw,
  Phone,
  MessageCircle,
  Eye,
  Award,
  Verified,
  Package,
  Zap,
  Users,
  Clock
} from 'lucide-react'
import { useRouter } from '../router'
import { useCart } from '../cart/cart-context'
import { useFavorites } from '../favorites/favorites-context'
import NavigationHeader from '../navigation-header'
import Footer from '../footer'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import ReviewsSection from './reviews-section'
import { apiCall, ApiError } from '../../utils/api'

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  artisan: {
    id: string
    name: string
    location: string
    craft: string
    experience: number
  }
  artisanName: string
  stock: number
  tags: string[]
  rating: number
  reviewCount: number
  materials?: string[]
  dimensions?: {
    length: number
    width: number
    height: number
    unit: string
  }
  weight?: number
  createdAt: string
  updatedAt: string
}

export default function ProductDetail() {
  const { router, goBack, navigate } = useRouter()
  const { addToCart } = useCart()
  const { isFavorited, toggleFavorite } = useFavorites()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  useEffect(() => {
    loadProduct()
  }, [router.params?.id])

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (!router.params?.id) {
        setError('Product ID is required')
        return
      }

      const response = await apiCall(`/products/one?id=${router.params.id}`)
      setProduct(response.data.product)
    } catch (error) {
      console.error('Error loading product:', error)
      if (error instanceof ApiError) {
        setError(error.message)
      } else {
        setError('Failed to load product')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      artisan: product.artisanName,
      quantity
    })
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('cart')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 botanical-pattern">
        <NavigationHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 botanical-pattern">
        <NavigationHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-red-500 mb-4">❌</div>
            <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
            <p className="text-muted-foreground mb-4">{error || 'The product you are looking for does not exist.'}</p>
            <Button onClick={goBack}>Go Back</Button>
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
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <button onClick={goBack} className="hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span>/</span>
          <button onClick={() => navigate('categories')} className="hover:text-primary">
            Categories
          </button>
          <span>/</span>
          <button onClick={() => navigate('categories')} className="hover:text-primary">
            {product.category}
          </button>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div className="space-y-4">
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <ImageWithFallback
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-96 object-cover"
                  />
                  {product.originalPrice && product.originalPrice > product.price && (
                    <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute top-4 right-4 bg-white/90 hover:bg-white ${
                      isFavorited(product.id) ? 'text-red-500' : 'text-muted-foreground'
                    }`}
                    onClick={async () => {
                      try {
                        setFavoriteLoading(true)
                        await toggleFavorite(product.id)
                      } catch (error) {
                        console.error('Error toggling favorite:', error)
                      } finally {
                        setFavoriteLoading(false)
                      }
                    }}
                    disabled={favoriteLoading}
                  >
                    <Heart className={`h-5 w-5 ${isFavorited(product._id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Thumbnail Images */}
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{product.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
                </div>
                <Badge variant="outline">
                  In Stock
                </Badge>
                <Badge className="bg-green-100 text-green-700">
                  <Eye className="h-3 w-3 mr-1" />
                  {Math.floor(Math.random() * 50) + 20} viewing
                </Badge>
              </div>

              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl font-bold text-primary">₹{product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Artisan Info */}
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{product.artisan.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{product.artisan.name}</h3>
                      <Verified className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{product.artisan.location}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span>4.9</span>
                      </div>
                      <span className="text-muted-foreground">{product.artisan.experience} years experience</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.stock} in stock
                </span>
              </div>

              <div className="flex space-x-3">
                <Button className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleBuyNow}>
                  <Zap className="h-4 w-4 mr-2" />
                  Buy Now
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Shipping & Returns */}
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Free Shipping</p>
                    <p className="text-sm text-muted-foreground">
                      Delivery in 7-10 business days
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">15 days return</p>
                    <p className="text-sm text-muted-foreground">Easy returns and exchanges</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">6 months craftsmanship guarantee</p>
                    <p className="text-sm text-muted-foreground">Quality assurance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-sm">Handcrafted by skilled artisans</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-sm">Traditional techniques and materials</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-sm">Authentic craftsmanship</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-sm">Quality guaranteed</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow mb-8">
          <CardContent className="p-6">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-secondary/40 border border-primary/10">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
                <TabsTrigger value="artisan">Artisan Story</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
                    <span className="font-medium">Category</span>
                    <span className="text-muted-foreground">{product.category}</span>
                  </div>
                  {product.materials && product.materials.length > 0 && (
                    <div className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
                      <span className="font-medium">Materials</span>
                      <span className="text-muted-foreground">{product.materials.join(', ')}</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
                      <span className="font-medium">Dimensions</span>
                      <span className="text-muted-foreground">
                        {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} {product.dimensions.unit}
                      </span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
                      <span className="font-medium">Weight</span>
                      <span className="text-muted-foreground">{product.weight} grams</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
                    <span className="font-medium">Stock</span>
                    <span className="text-muted-foreground">{product.stock} available</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
                    <span className="font-medium">Created</span>
                    <span className="text-muted-foreground">{new Date(product.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <ReviewsSection productId={product._id} productName={product.name} />
              </TabsContent>

              <TabsContent value="artisan" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback>{product.artisan.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{product.artisan.name}</h3>
                      <p className="text-muted-foreground">{product.artisan.craft}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span>4.9</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{product.artisan.experience} years experience</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="text-center p-4">
                      <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <div className="font-semibold">47</div>
                      <div className="text-sm text-muted-foreground">Products</div>
                    </Card>
                    <Card className="text-center p-4">
                      <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <div className="font-semibold">234</div>
                      <div className="text-sm text-muted-foreground">Reviews</div>
                    </Card>
                    <Card className="text-center p-4">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <div className="font-semibold">{product.artisan.experience} years</div>
                      <div className="text-sm text-muted-foreground">Experience</div>
                    </Card>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    Master artisan specializing in {product.artisan.craft} with over {product.artisan.experience} years of experience. 
                    Based in {product.artisan.location}, this skilled craftsman creates authentic handmade products using traditional techniques.
                  </p>

                  <div className="flex space-x-3">
                    <Button onClick={() => navigate('artisan-profile', { id: product.artisan._id })}>
                      View Artisan Profile
                    </Button>
                    <Button variant="outline">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message Artisan
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}