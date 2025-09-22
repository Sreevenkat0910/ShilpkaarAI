import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { 
  TrendingUp, 
  Star, 
  Calendar, 
  Sparkles, 
  Heart,
  ArrowRight,
  Bot,
  MapPin
} from 'lucide-react'
import { useRouter } from '../router'
import { useFavorites } from '../favorites/favorites-context'
import NavigationHeader from '../navigation-header'
import Footer from '../footer'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import { searchApi } from '../../utils/api'

export default function ExplorePage() {
  const { navigate } = useRouter()
  const { isFavorited, toggleFavorite, favorites, loading: favoritesLoading } = useFavorites()
  const [favoriteLoading, setFavoriteLoading] = useState<string | null>(null)
  const [trendingProducts, setTrendingProducts] = useState<any[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [newArrivals, setNewArrivals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Load real products from backend
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      
      // Load trending products (products with trending flag or high ratings)
      const trendingResponse = await searchApi.searchProducts({ 
        trending: true, 
        limit: 6,
        sortBy: 'rating',
        sortOrder: 'desc'
      })
      
      // Load featured products (products with featured flag)
      const featuredResponse = await searchApi.searchProducts({ 
        featured: true, 
        limit: 6,
        sortBy: 'rating',
        sortOrder: 'desc'
      })
      
      // Load new arrivals (recently created products)
      const newArrivalsResponse = await searchApi.searchProducts({ 
        limit: 6,
        sortBy: 'newest',
        sortOrder: 'desc'
      })
      
      setTrendingProducts(trendingResponse.data.data.products || [])
      setFeaturedProducts(featuredResponse.data.data.products || [])
      setNewArrivals(newArrivalsResponse.data.data.products || [])
      
    } catch (error) {
      console.error('Error loading products:', error)
      // Fallback to empty arrays if API fails
      setTrendingProducts([])
      setFeaturedProducts([])
      setNewArrivals([])
    } finally {
      setLoading(false)
    }
  }

  const collections = [
    {
      id: 'festive',
      name: 'Festive Collection 2024',
      description: 'Celebrate festivals with traditional crafts',
      itemCount: 85,
      image: 'https://images.unsplash.com/photo-1609592043399-94c725a67a7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXN0aXZhbCUyMGRlY29yYXRpb24lMjBpbmRpYW58ZW58MXx8fHwxNzU4MzY2MjEyfDA&ixlib=rb-4.1.0&q=80&w=800',
      badge: 'Limited Time'
    },
    {
      id: 'winter',
      name: 'Winter Comfort',
      description: 'Warm textiles and cozy crafts for winter',
      itemCount: 120,
      image: 'https://images.unsplash.com/photo-1594736797933-d0f06ba42d6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW50ZXIlMjB0ZXh0aWxlcyUyMGluZGlhbnxlbnwxfHx8fDE3NTgzNjYyMTN8MA&ixlib=rb-4.1.0&q=80&w=800',
      badge: 'Seasonal'
    },
    {
      id: 'bridal',
      name: 'Bridal Heritage',
      description: 'Exquisite pieces for special occasions',
      itemCount: 65,
      image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlkYWwlMjBqZXdlbHJ5JTIwaW5kaWFufGVufDF8fHx8MTc1ODM2NjIxNHww&ixlib=rb-4.1.0&q=80&w=800',
      badge: 'Premium'
    }
  ]

  const aiPicks = [
    {
      id: '815ae716-eb37-4c80-ac35-97a6e0548144', // Terracotta Plant Pot Set
      name: 'Terracotta Plant Pot Set',
      reason: 'Perfect for art lovers based on your browsing',
      confidence: 95,
      price: 800,
      image: 'https://images.unsplash.com/photo-1716876995651-1ff85b65a6d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBoYW5kaWNyYWZ0cyUyMHBvdHRlcnklMjBhcnRpc2FufGVufDF8fHx8MTc1ODM2NjIwMHww&ixlib=rb-4.1.0&q=80&w=400'
    },
    {
      id: '86b284dc-c072-44bc-b45a-a72c3ed7a750', // Traditional Brass Lamp
      name: 'Traditional Brass Lamp',
      reason: 'Trending in your location',
      confidence: 88,
      price: 2200,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBicmFzcyUyMGxhbXB8ZW58MXx8fHwxNzU4MzY2MjE0fDA&ixlib=rb-4.1.0&q=80&w=400'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 botanical-pattern">
      <NavigationHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Explore Discoveries
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Curated collections, trending crafts, and AI-powered recommendations 
            tailored just for you
          </p>
        </div>

        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-card/60 border border-primary/10 p-1 rounded-2xl max-w-2xl mx-auto mb-12">
            <TabsTrigger value="trending" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="collections" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              Collections
            </TabsTrigger>
            <TabsTrigger value="ai-picks" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Bot className="w-4 h-4 mr-2" />
              AI Picks
            </TabsTrigger>
            <TabsTrigger value="favorites" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Heart className="w-4 h-4 mr-2" />
              Favorites
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Trending Now
              </h2>
              <p className="text-muted-foreground">
                Most popular products this week across all categories
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="border-0 bg-card/60 backdrop-blur-sm">
                    <div className="relative overflow-hidden rounded-t-2xl">
                      <div className="w-full h-56 bg-gray-200 animate-pulse" />
                    </div>
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse mb-3" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse mb-4" />
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                        <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : trendingProducts.length > 0 ? (
                trendingProducts.map((product, index) => (
                <Card 
                  key={product.id}
                  className="group cursor-pointer border-0 bg-card/60 backdrop-blur-sm card-shadow hover:card-shadow-lg transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('product-detail', { id: product.id })}
                >
                  <div className="relative overflow-hidden rounded-t-2xl">
                    <ImageWithFallback
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1632726733402-4a059a476028?w=400'}
                      alt={product.name}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {index === 0 && (
                        <Badge className="bg-red-500 text-white border-0 shadow-sm">
                          #1 Trending
                        </Badge>
                      )}
                      {product.trending && (
                        <Badge className="bg-purple-500 text-white border-0 shadow-sm">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI Enhanced
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`absolute top-4 right-4 bg-white/80 hover:bg-white ${
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

                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center mb-3">
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
                      <span className="text-sm text-muted-foreground ml-2">
                        ({product.reviewCount || 0})
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <span className="font-medium">{product.artisanName}</span>
                      <span className="mx-1">•</span>
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{product.artisan?.location || 'India'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-primary">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                      <Button size="sm" className="group-hover:bg-primary/90">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No trending products found</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="collections" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Curated Collections
              </h2>
              <p className="text-muted-foreground">
                Handpicked themes and seasonal highlights
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {collections.map((collection) => (
                <Card 
                  key={collection.id}
                  className="group cursor-pointer border-0 bg-card/60 backdrop-blur-sm card-shadow hover:card-shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden"
                  onClick={() => navigate('product-catalog', { collection: collection.id })}
                >
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                    <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground border-0 shadow-sm">
                      {collection.badge}
                    </Badge>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-semibold text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {collection.name}
                      </h3>
                      <p className="text-sm text-white/90">
                        {collection.itemCount} items
                      </p>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4">
                      {collection.description}
                    </p>
                    <Button className="w-full group-hover:bg-primary/90">
                      Explore Collection
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai-picks" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                AI Recommendations
              </h2>
              <p className="text-muted-foreground">
                Personalized picks based on your preferences and browsing
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {aiPicks.map((pick) => (
                <Card 
                  key={pick.id}
                  className="group cursor-pointer border-0 bg-gradient-to-br from-purple-50 to-card/60 backdrop-blur-sm card-shadow hover:card-shadow-lg transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('product-detail', { id: pick.id })}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="relative flex-shrink-0">
                        <ImageWithFallback
                          src={pick.image}
                          alt={pick.name}
                          className="w-24 h-24 object-cover rounded-xl"
                        />
                        <div className="absolute -top-2 -right-2 bg-purple-500 text-white p-1.5 rounded-full">
                          <Bot className="h-3 w-3" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                          {pick.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {pick.reason}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary">₹{pick.price}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                              {pick.confidence}% match
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 ${
                                isFavorited(pick.id) ? 'text-red-500' : 'text-muted-foreground'
                              }`}
                              onClick={async (e) => {
                                e.stopPropagation()
                                try {
                                  setFavoriteLoading(pick.id)
                                  await toggleFavorite(pick.id)
                                } catch (error) {
                                  console.error('Error toggling favorite:', error)
                                } finally {
                                  setFavoriteLoading(null)
                                }
                              }}
                              disabled={favoriteLoading === pick.id}
                            >
                              <Heart className={`h-4 w-4 ${isFavorited(pick.id) ? 'fill-current' : ''}`} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Your Favorites
              </h2>
              <p className="text-muted-foreground">
                Items you've saved for later
              </p>
            </div>

            {favoritesLoading ? (
              <div className="text-center py-16">
                <div className="w-8 h-8 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted-foreground">Loading favorites...</p>
              </div>
            ) : favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {favorites.slice(0, 6).map((favorite) => (
                  <Card 
                    key={favorite._id}
                    className="group cursor-pointer border-0 bg-card/60 backdrop-blur-sm card-shadow hover:card-shadow-lg transition-all duration-300 hover:scale-105"
                    onClick={() => navigate('product-detail', { id: favorite.product._id })}
                  >
                    <div className="relative overflow-hidden rounded-t-2xl">
                      <ImageWithFallback
                        src={favorite.product.images[0] || ''}
                        alt={favorite.product.name}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 bg-white/80 hover:bg-white text-red-500"
                        onClick={async (e) => {
                          e.stopPropagation()
                          try {
                            setFavoriteLoading(favorite.product._id)
                            await toggleFavorite(favorite.product._id)
                          } catch (error) {
                            console.error('Error toggling favorite:', error)
                          } finally {
                            setFavoriteLoading(null)
                          }
                        }}
                        disabled={favoriteLoading === favorite.product._id}
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </Button>
                    </div>

                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                        {favorite.product.name}
                      </h3>
                      
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(favorite.product.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({favorite.product.reviewCount})
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <span className="font-medium">{favorite.product.artisanName}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-primary">₹{favorite.product.price}</span>
                          {favorite.product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{favorite.product.originalPrice}
                            </span>
                          )}
                        </div>
                        <Button size="sm" className="group-hover:bg-primary/90">
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-secondary/60 rounded-full flex items-center justify-center">
                  <Heart className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">No favorites yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start exploring and save items you love to see them here
                </p>
                <Button onClick={() => navigate('categories')}>
                  Explore Categories
                </Button>
              </div>
            )}

            {favorites.length > 6 && (
              <div className="text-center">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('favorites')}
                  className="bg-card/60 border-primary/20"
                >
                  View All Favorites
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}