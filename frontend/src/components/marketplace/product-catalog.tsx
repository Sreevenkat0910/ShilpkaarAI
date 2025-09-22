import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Slider } from '../ui/slider'
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Heart, 
  Star,
  MapPin,
  TrendingUp,
  Sparkles,
  ArrowLeft,
  Mic
} from 'lucide-react'
import { useRouter } from '../router'
import { useFavorites } from '../favorites/favorites-context'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import { searchApi } from '../../utils/api'

interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  rating: number
  review_count: number
  artisan: {
    id: string
    name: string
    location: string
    craft: string
  }
  artisan_name: string
  category: string
  images: string[]
  tags: string[]
  stock: number
  created_at: string
}

export default function ProductCatalog() {
  const { router, navigate, goBack } = useRouter()
  const { isFavorited, toggleFavorite } = useFavorites()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('relevance')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favoriteLoading, setFavoriteLoading] = useState<string | null>(null)
  const [availableCategories, setAvailableCategories] = useState<string[]>([])

  // Get category and artisan from router params
  const categoryFromRoute = router.params.category
  const artisanFromRoute = router.params.artisan

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [])

  // Update selected category when route changes
  useEffect(() => {
    console.log('🔍 Category from route:', categoryFromRoute)
    console.log('🔍 Artisan from route:', artisanFromRoute)
    if (categoryFromRoute) {
      setSelectedCategory(categoryFromRoute)
      loadProducts(categoryFromRoute)
    } else if (artisanFromRoute) {
      // If viewing artisan's products, load all products and filter by artisan
      loadProducts(undefined, artisanFromRoute)
    }
  }, [categoryFromRoute, artisanFromRoute])

  const loadProducts = async (category?: string, artisanId?: string) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Loading products for category:', category, 'artisan:', artisanId)
      
      const searchParams: any = {
        page: 1,
        limit: 20,
        sortBy: sortBy
      }
      
      // Add category filter if specified
      if (category && category !== 'all') {
        searchParams.category = category
        console.log('📂 Added category filter:', category)
      }
      
      // Add artisan filter if specified
      if (artisanId) {
        searchParams.artisan_id = artisanId
        console.log('👨‍🎨 Added artisan filter:', artisanId)
      }
      
      // Add search query if specified
      if (searchQuery) {
        searchParams.q = searchQuery
      }
      
      // Add price range filter
      if (priceRange[0] > 0 || priceRange[1] < 5000) {
        searchParams.minPrice = priceRange[0]
        searchParams.maxPrice = priceRange[1]
      }
      
      console.log('🌐 API call with params:', searchParams)
      const response = await searchApi.searchProducts(searchParams)
      console.log('📦 API response:', response.data)
      
      if (response && response.data && response.data.products) {
        console.log('✅ Products loaded:', response.data.products.length)
        setProducts(response.data.products)
      } else {
        console.warn('❌ Products not found in API response')
        setProducts([])
      }
    } catch (error) {
      console.error('Error loading products:', error)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await searchApi.getCategories()
      if (response && response.data) {
        setAvailableCategories(response.data)
      } else {
        console.warn('Categories not found in API response')
        setAvailableCategories([])
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      setAvailableCategories([])
    }
  }

  const categories = ['All Categories', ...(availableCategories || [])]

  // Products are already filtered by the API, so we use them directly
  const filteredProducts = products || []

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    loadProducts(category === 'All Categories' ? 'all' : category, artisanFromRoute)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    loadProducts(selectedCategory === 'all' ? undefined : selectedCategory, artisanFromRoute)
  }

  const handlePriceRangeChange = (range: number[]) => {
    setPriceRange(range)
    loadProducts(selectedCategory === 'all' ? undefined : selectedCategory, artisanFromRoute)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    loadProducts(selectedCategory === 'all' ? undefined : selectedCategory, artisanFromRoute)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={goBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for crafts, artisans, or categories..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 pr-10 bg-secondary/50"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Artisan Products Header */}
      {artisanFromRoute && (
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Artisan's Collection</h1>
              <p className="text-muted-foreground">
                Discover the beautiful handcrafted products by this talented artisan
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 bg-card/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Filter className="h-5 w-5" />
                  <h3 className="font-semibold">Filters</h3>
                </div>

                <div className="space-y-6">
                  {/* Category */}
                  <div>
                    <h4 className="font-medium mb-3">Category</h4>
                    <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem 
                            key={category} 
                            value={category === 'All Categories' ? 'all' : category.toLowerCase()}
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium mb-3">Price Range</h4>
                    <div className="px-2">
                      <Slider
                        value={priceRange}
                        onValueChange={handlePriceRangeChange}
                        max={5000}
                        min={0}
                        step={100}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Filters */}
                  <div>
                    <h4 className="font-medium mb-3">Quick Filters</h4>
                    <div className="space-y-2">
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Enhanced
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        Verified Artisans
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {filteredProducts?.length || 0} products found
                </span>
                <Separator orientation="vertical" className="h-6" />
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="text-red-500 mb-4">❌</div>
                <h2 className="text-2xl font-bold mb-2">Error Loading Products</h2>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={loadProducts}>Try Again</Button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredProducts.map((product) => (
                <Card
                  key={product.id} 
                  className="group cursor-pointer border-0 bg-card/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                  onClick={() => navigate('product-detail', { id: product.id })}
                >
                  <CardContent className="p-0">
                    {viewMode === 'grid' ? (
                      <>
                        <div className="relative overflow-hidden rounded-t-lg">
                          <ImageWithFallback
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {product.tags.includes('trending') && (
                              <Badge className="bg-red-500 text-white">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                            {product.tags.includes('ai-enhanced') && (
                              <Badge className="bg-purple-500 text-white">
                                <Sparkles className="w-3 h-3 mr-1" />
                                AI Enhanced
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`absolute top-2 right-2 bg-white/80 hover:bg-white ${
                              isFavorited(product.id) ? 'text-red-500' : 'text-muted-foreground'
                            }`}
                            onClick={async (e) => {
                              e.stopPropagation()
                              try {
                                setFavoriteLoading(product.id)
                                await toggleFavorite(product.id)
                              } catch (error) {
                                console.error('Error toggling favorite:', error)
                              } finally {
                                setFavoriteLoading(null)
                              }
                            }}
                            disabled={favoriteLoading === product.id}
                          >
                            <Heart className={`h-4 w-4 ${isFavorited(product.id) ? 'fill-current' : ''}`} />
                          </Button>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(product.rating)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground ml-1">
                              ({product.review_count})
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mb-3">
                            <span className="font-medium">{product.artisan_name}</span>
                            <Badge variant="secondary" className="ml-1 text-xs">
                              ✓
                            </Badge>
                            <span className="mx-1">•</span>
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{product.artisan.location}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-primary">₹{product.price}</span>
                              {product.original_price && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ₹{product.original_price}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex p-4 space-x-4">
                        <div className="relative flex-shrink-0">
                          <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          {product.isAIEnhanced && (
                            <Badge className="absolute -top-1 -right-1 bg-purple-500 text-white p-1">
                              <Sparkles className="w-2 h-2" />
                            </Badge>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                            {product.description}
                          </p>
                          <div className="flex items-center text-xs text-muted-foreground mb-2">
                            <span className="font-medium">{product.artisan}</span>
                            {product.isVerified && (
                              <Badge variant="secondary" className="ml-1 text-xs">✓</Badge>
                            )}
                            <span className="mx-1">•</span>
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{product.location}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-primary">₹{product.price}</span>
                              {product.original_price && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ₹{product.original_price}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                              <span className="text-sm">{product.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <Button onClick={() => setSearchQuery('')}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}