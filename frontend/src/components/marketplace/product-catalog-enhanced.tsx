import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { 
  Grid3X3, 
  List, 
  Heart, 
  Star,
  MapPin,
  TrendingUp,
  Sparkles,
  ArrowLeft,
  Filter,
  Loader2
} from 'lucide-react'
import { useRouter } from '../router'
import { useFavorites } from '../favorites/favorites-context'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import { useProductsStore, Product, SearchFilters } from '../../stores/products-store'
import SearchBar from '../search/search-bar'
import AdvancedFilters from '../search/advanced-filters'
import FilterChips from '../search/filter-chips'

export default function ProductCatalog() {
  const { navigate, goBack } = useRouter()
  const { isFavorited, toggleFavorite } = useFavorites()
  
  const {
    filteredProducts,
    filterOptions,
    searchFilters,
    pagination,
    isLoading,
    error,
    searchProducts,
    setSearchFilters,
    clearSearchFilters,
    fetchCategories
  } = useProductsStore()

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState<string | null>(null)

  useEffect(() => {
    // Load initial products and categories
    searchProducts()
    fetchCategories()
  }, [])

  useEffect(() => {
    // Update search query when filters change
    if (searchFilters.q !== searchQuery) {
      setSearchQuery(searchFilters.q || '')
    }
  }, [searchFilters.q])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    searchProducts({ q: query })
  }

  const handleFiltersChange = (filters: Partial<SearchFilters>) => {
    setSearchFilters(filters)
    searchProducts(filters)
  }

  const handleClearFilters = () => {
    clearSearchFilters()
    setSearchQuery('')
    searchProducts()
  }

  const handleRemoveFilter = (key: keyof SearchFilters) => {
    const newFilters = { ...searchFilters, [key]: undefined }
    setSearchFilters(newFilters)
    searchProducts(newFilters)
  }

  const handlePageChange = (page: number) => {
    searchProducts({ ...searchFilters, page })
  }

  const handleSortChange = (sortBy: string) => {
    searchProducts({ ...searchFilters, sortBy })
  }

  const handleFavoriteToggle = async (productId: string) => {
    try {
      setFavoriteLoading(productId)
      await toggleFavorite(productId)
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setFavoriteLoading(null)
    }
  }

  const renderProductCard = (product: Product) => (
    <Card key={product._id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/60 backdrop-blur-sm card-shadow">
      <CardContent className="p-0">
        <div className="relative">
          <div className="aspect-square overflow-hidden rounded-t-lg">
            <ImageWithFallback
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white rounded-full shadow-sm"
            onClick={() => handleFavoriteToggle(product._id)}
            disabled={favoriteLoading === product._id}
          >
            {favoriteLoading === product._id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart className={`h-4 w-4 ${isFavorited(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            )}
          </Button>

          {/* Trending Badge */}
          {product.trending && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
              <TrendingUp className="h-3 w-3 mr-1" />
              Trending
            </Badge>
          )}

          {/* Featured Badge */}
          {product.featured && (
            <Badge className="absolute top-2 left-2 bg-blue-500 text-white">
              <Sparkles className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {product.description}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating || 0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount || 0})
            </span>
          </div>

          {/* Artisan Info */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {product.artisanName} • {product.artisan.location}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
          </div>

          {/* Stock Status */}
          <div className="text-xs text-muted-foreground">
            {product.stock > 0 ? (
              <span className="text-green-600">In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderListView = (product: Product) => (
    <Card key={product._id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/60 backdrop-blur-sm card-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative w-24 h-24 flex-shrink-0">
            <ImageWithFallback
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-1 right-1 h-6 w-6 p-0 bg-white/80 hover:bg-white rounded-full"
              onClick={() => handleFavoriteToggle(product._id)}
              disabled={favoriteLoading === product._id}
            >
              {favoriteLoading === product._id ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Heart className={`h-3 w-3 ${isFavorited(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              )}
            </Button>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {product.description}
                </p>
                
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span>{product.rating?.toFixed(1) || '0.0'}</span>
                    <span className="text-muted-foreground">({product.reviewCount || 0})</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{product.artisanName}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right ml-4">
                <div className="text-xl font-bold text-primary">
                  ₹{product.price.toLocaleString()}
                </div>
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="text-sm text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </div>
                )}
                <Badge variant="secondary" className="text-xs mt-1">
                  {product.category}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card/60 backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="hover:bg-primary/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Product Catalog</h1>
                <p className="text-muted-foreground">
                  Discover unique handmade products from skilled artisans
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-80 flex-shrink-0">
            <AdvancedFilters
              filters={searchFilters}
              filterOptions={filterOptions}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              isLoading={isLoading}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                placeholder="Search for crafts, artisans, or categories..."
                showFilters={false}
                isLoading={isLoading}
                className="w-full"
              />
            </div>

            {/* Filter Chips */}
            <div className="mb-6">
              <FilterChips
                filters={searchFilters}
                onRemoveFilter={handleRemoveFilter}
                onClearAll={handleClearFilters}
              />
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">
                  {pagination.total} products found
                </h2>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={searchFilters.sortBy || 'relevance'} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={() => searchProducts()}>Try Again</Button>
              </div>
            )}

            {/* Products Grid/List */}
            {!isLoading && !error && (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(renderProductCard)}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProducts.map(renderListView)}
                  </div>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.current - 1)}
                        disabled={pagination.current <= 1}
                      >
                        Previous
                      </Button>
                      
                      {[...Array(pagination.pages)].map((_, i) => (
                        <Button
                          key={i + 1}
                          variant={pagination.current === i + 1 ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.current + 1)}
                        disabled={pagination.current >= pagination.pages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No products found matching your criteria</p>
                <Button onClick={handleClearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
