import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { 
  MapPin, 
  Star, 
  Calendar,
  Filter,
  Users,
  Award,
  Sparkles,
  MessageCircle,
  Eye,
  Loader2,
  TrendingUp,
  CheckCircle
} from 'lucide-react'
import { useRouter } from '../router'
import NavigationHeader from '../navigation-header'
import Footer from '../footer'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import { useArtisansStore, Artisan, ArtisanSearchFilters } from '../../stores/artisans-store'
import SearchBar from '../search/search-bar'
import FilterChips from '../search/filter-chips'

export default function ArtisansPage() {
  const { navigate } = useRouter()
  
  const {
    artisans,
    filterOptions,
    searchFilters,
    pagination,
    stats,
    isLoading,
    error,
    searchArtisans,
    setSearchFilters,
    clearSearchFilters,
    fetchArtisans
  } = useArtisansStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // Load initial artisans
    searchArtisans()
  }, [])

  useEffect(() => {
    // Update search query when filters change
    if (searchFilters.q !== searchQuery) {
      setSearchQuery(searchFilters.q || '')
    }
  }, [searchFilters.q])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    searchArtisans({ q: query })
  }

  const handleFiltersChange = (filters: Partial<ArtisanSearchFilters>) => {
    setSearchFilters(filters)
    searchArtisans(filters)
  }

  const handleClearFilters = () => {
    clearSearchFilters()
    setSearchQuery('')
    searchArtisans()
  }

  const handleRemoveFilter = (key: keyof ArtisanSearchFilters) => {
    const newFilters = { ...searchFilters, [key]: undefined }
    setSearchFilters(newFilters)
    searchArtisans(newFilters)
  }

  const handlePageChange = (page: number) => {
    searchArtisans({ ...searchFilters, page })
  }

  const handleSortChange = (sortBy: string) => {
    searchArtisans({ ...searchFilters, sortBy })
  }

  const renderArtisanCard = (artisan: Artisan) => (
    <Card key={artisan._id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/60 backdrop-blur-sm card-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden">
              <ImageWithFallback
                src={artisan.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(artisan.name)}&background=random`}
                alt={artisan.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Online Status */}
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
              artisan.isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`} />
            
            {/* Verified Badge */}
            {artisan.isVerified && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {artisan.name}
                </h3>
                <p className="text-muted-foreground">{artisan.craft}</p>
              </div>
              
              <div className="flex items-center gap-2">
                {artisan.trending && (
                  <Badge className="bg-red-500 text-white">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Trending
                  </Badge>
                )}
                {artisan.featured && (
                  <Badge className="bg-blue-500 text-white">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <MapPin className="h-4 w-4" />
              <span>{artisan.location}</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{artisan.rating.toFixed(1)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {artisan.reviewCount} reviews
                </p>
              </div>
              
              <div className="text-center">
                <div className="font-semibold mb-1">{artisan.experience}</div>
                <p className="text-xs text-muted-foreground">years experience</p>
              </div>
              
              <div className="text-center">
                <div className="font-semibold mb-1">{artisan.productsCount}</div>
                <p className="text-xs text-muted-foreground">products</p>
              </div>
            </div>

            {/* Specialties */}
            {artisan.specializations && artisan.specializations.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Specialties:</p>
                <div className="flex flex-wrap gap-1">
                  {artisan.specializations.slice(0, 3).map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {artisan.specializations.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{artisan.specializations.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Bio */}
            {artisan.bio && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {artisan.bio}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate(`/artisan/${artisan._id}`)}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Profile
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate(`/artisan/${artisan._id}/products`)}
              >
                <Award className="h-4 w-4 mr-2" />
                Products
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate(`/messages/${artisan._id}`)}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Meet Our Artisans</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with skilled craftspeople preserving traditional Indian art forms. 
            Each artisan brings generations of knowledge and passion to their craft.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Search artisans..."
              showFilters={false}
              isLoading={isLoading}
              className="w-full"
            />
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-card/60 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-primary">{stats.totalArtisans}</div>
                <div className="text-sm text-muted-foreground">Artisans Found</div>
              </div>
              <div className="bg-card/60 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-primary">{stats.verifiedArtisans}</div>
                <div className="text-sm text-muted-foreground">Verified</div>
              </div>
              <div className="bg-card/60 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-primary">{stats.onlineArtisans}</div>
                <div className="text-sm text-muted-foreground">Online Now</div>
              </div>
              <div className="bg-card/60 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-primary">{stats.avgRating.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-80 flex-shrink-0">
            <Card className="w-full">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </h3>
                
                <div className="space-y-4">
                  {/* Craft Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Craft</label>
                    <Select
                      value={searchFilters.craft || ''}
                      onValueChange={(value) => handleFiltersChange({ craft: value === 'all' ? undefined : value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Crafts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Crafts</SelectItem>
                        {filterOptions?.crafts.map((craft) => (
                          <SelectItem key={craft} value={craft}>
                            {craft}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <Select
                      value={searchFilters.location || ''}
                      onValueChange={(value) => handleFiltersChange({ location: value === 'all' ? undefined : value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {filterOptions?.locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Experience Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Min Experience</label>
                    <Select
                      value={searchFilters.minExperience?.toString() || ''}
                      onValueChange={(value) => handleFiltersChange({ minExperience: value === 'all' ? undefined : parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any Experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Experience</SelectItem>
                        <SelectItem value="5">5+ years</SelectItem>
                        <SelectItem value="10">10+ years</SelectItem>
                        <SelectItem value="15">15+ years</SelectItem>
                        <SelectItem value="20">20+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Min Rating</label>
                    <Select
                      value={searchFilters.minRating?.toString() || ''}
                      onValueChange={(value) => handleFiltersChange({ minRating: value === 'all' ? undefined : parseFloat(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Rating</SelectItem>
                        <SelectItem value="4">4+ Stars</SelectItem>
                        <SelectItem value="3">3+ Stars</SelectItem>
                        <SelectItem value="2">2+ Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Workshop Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Workshop Offered</label>
                    <Select
                      value={searchFilters.workshopOffered?.toString() || ''}
                      onValueChange={(value) => handleFiltersChange({ workshopOffered: value === 'all' ? undefined : value === 'true' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any</SelectItem>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
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
                  {pagination.total} artisans found
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
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                    <SelectItem value="products">Products</SelectItem>
                    <SelectItem value="joined">Joined Date</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={() => searchArtisans()}>Try Again</Button>
              </div>
            )}

            {/* Artisans List */}
            {!isLoading && !error && (
              <>
                <div className="space-y-6">
                  {artisans.map(renderArtisanCard)}
                </div>

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
                <p className="text-muted-foreground">Loading artisans...</p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && artisans.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No artisans found matching your criteria</p>
                <Button onClick={handleClearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
