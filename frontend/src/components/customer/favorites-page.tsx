import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { 
  ArrowLeft,
  Search,
  Heart,
  ShoppingCart,
  Filter,
  Grid3X3,
  List,
  Star,
  MapPin,
  User,
  Share2,
  MessageCircle,
  Eye,
  Trash2,
  Loader2
} from 'lucide-react'
import { useRouter } from '../router'
import { useCart } from '../cart/cart-context'
import { useFavorites } from '../favorites/favorites-context'
import NavigationHeader from '../navigation-header'
import Footer from '../footer'
import { ImageWithFallback } from '../figma/ImageWithFallback'

export default function FavoritesPage() {
  const { goBack, navigate } = useRouter()
  const { addToCart } = useCart()
  const { favorites, loading, error, removeFromFavorites, refreshFavorites } = useFavorites()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [removingId, setRemovingId] = useState<string | null>(null)

  const filteredFavorites = favorites.filter(favorite => {
    const item = favorite.product
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.artisanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || item.category.toLowerCase() === categoryFilter.toLowerCase()
    
    return matchesSearch && matchesCategory
  })

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    const itemA = a.product
    const itemB = b.product
    
    switch (sortBy) {
      case 'recent':
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      case 'oldest':
        return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
      case 'price-high':
        return itemB.price - itemA.price
      case 'price-low':
        return itemA.price - itemB.price
      case 'rating':
        return itemB.rating - itemA.rating
      case 'name':
        return itemA.name.localeCompare(itemB.name)
      default:
        return 0
    }
  })

  const categories = ['all', ...Array.from(new Set(favorites.map(favorite => favorite.product.category.toLowerCase())))]

  const removeFavorite = async (productId: string) => {
    try {
      setRemovingId(productId)
      await removeFromFavorites(productId)
    } catch (error) {
      console.error('Error removing favorite:', error)
    } finally {
      setRemovingId(null)
    }
  }

  const addToCartHandler = (product: any) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      artisan: product.artisanName,
      quantity: 1
    })
  }

  const FavoriteCard = ({ favorite, isListView = false }: { favorite: any, isListView?: boolean }) => {
    const item = favorite.product
    const discount = item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0
    const inStock = item.stock > 0
    
    return (
      <Card className={`border-0 bg-card/60 backdrop-blur-sm card-shadow hover:shadow-lg transition-all group ${
        isListView ? 'h-auto' : 'h-full'
      }`}>
        <div className={`${isListView ? 'flex' : 'block'} h-full`}>
          {/* Image */}
          <div className={`relative ${isListView ? 'w-48 flex-shrink-0' : 'w-full'}`}>
            <ImageWithFallback
              src={item.images[0] || ''}
              alt={item.name}
              className={`object-cover cursor-pointer ${
                isListView ? 'h-32 w-full' : 'h-48 w-full'
              } rounded-t-lg ${isListView ? 'rounded-l-lg rounded-tr-none' : ''}`}
              onClick={() => navigate('product-detail', { id: item._id })}
            />
            {discount > 0 && (
              <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                {discount}% OFF
              </Badge>
            )}
            {!inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                <Badge variant="secondary" className="bg-white/90 text-gray-800">
                  Out of Stock
                </Badge>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 hover:text-red-600"
              onClick={() => removeFavorite(item._id)}
              disabled={removingId === item._id}
            >
              {removingId === item._id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart className="h-4 w-4 fill-current" />
              )}
            </Button>
          </div>

          {/* Content */}
          <div className={`p-4 flex flex-col ${isListView ? 'flex-1' : 'flex-grow'}`}>
            <div className="flex-grow">
              <h3 
                className="font-semibold mb-2 line-clamp-2 cursor-pointer hover:text-primary"
                onClick={() => navigate('product-detail', { id: item._id })}
              >
                {item.name}
              </h3>
              
              <div className="flex items-center space-x-1 mb-2">
                <User className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{item.artisanName}</span>
              </div>
              
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium ml-1">{item.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-muted-foreground">({item.reviewCount} reviews)</span>
                <Badge variant="outline" className="text-xs">
                  {item.category}
                </Badge>
              </div>

              {isListView && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>

            <div className="mt-auto">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg font-bold text-primary">₹{item.price}</span>
                {item.originalPrice && item.originalPrice > item.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{item.originalPrice}
                  </span>
                )}
              </div>

              <div className={`flex gap-2 ${isListView ? 'flex-row' : 'flex-col'}`}>
                <Button 
                  className={`${isListView ? 'flex-1' : 'w-full'}`}
                  onClick={() => addToCartHandler(item)}
                  disabled={!inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                
                <div className={`flex gap-2 ${isListView ? '' : 'w-full'}`}>
                  <Button 
                    variant="outline" 
                    size={isListView ? 'default' : 'sm'}
                    className={isListView ? '' : 'flex-1'}
                    onClick={() => navigate('product-detail', { id: item._id })}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size={isListView ? 'default' : 'sm'}
                    className={isListView ? '' : 'flex-1'}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size={isListView ? 'default' : 'sm'}
                    className={isListView ? '' : 'flex-1'}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
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
              My Favorites
            </h1>
            <p className="text-muted-foreground">
              {loading ? 'Loading...' : `${favorites.length} item${favorites.length !== 1 ? 's' : ''} saved`}
            </p>
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>
        </div>

        {/* Controls */}
        <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search favorites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-input-background border-primary/20"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-input-background border-primary/20">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-input-background border-primary/20">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Added</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="bg-card/60 border-primary/20"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="bg-card/60 border-primary/20"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Favorites Grid/List */}
        {loading ? (
          <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
            <CardContent className="p-12 text-center">
              <Loader2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50 animate-spin" />
              <h3 className="text-lg font-semibold mb-2">Loading favorites...</h3>
              <p className="text-muted-foreground">
                Please wait while we fetch your saved items
              </p>
            </CardContent>
          </Card>
        ) : sortedFavorites.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {sortedFavorites.map((favorite) => (
              <FavoriteCard 
                key={favorite._id} 
                favorite={favorite} 
                isListView={viewMode === 'list'} 
              />
            ))}
          </div>
        ) : (
          <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
            <CardContent className="p-12 text-center">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No favorites found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || categoryFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start exploring and save items you love'
                }
              </p>
              <Button onClick={() => navigate('explore')}>
                <Heart className="h-4 w-4 mr-2" />
                Discover Products
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        {sortedFavorites.length > 0 && (
          <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow mt-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <h3 className="font-semibold mb-1">Quick Actions</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage all your favorites at once
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      const inStockItems = sortedFavorites.filter(favorite => favorite.product.stock > 0)
                      inStockItems.forEach(favorite => addToCartHandler(favorite.product))
                    }}
                    disabled={sortedFavorites.filter(favorite => favorite.product.stock > 0).length === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add All to Cart
                  </Button>
                  <Button variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share List
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      // Clear all favorites
                      sortedFavorites.forEach(favorite => {
                        removeFavorite(favorite.product._id)
                      })
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  )
}