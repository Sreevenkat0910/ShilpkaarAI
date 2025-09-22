import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { 
  Search, 
  MapPin, 
  Star, 
  Calendar,
  Filter,
  Users,
  Award,
  Sparkles,
  MessageCircle,
  Eye
} from 'lucide-react'
import { useRouter } from '../router'
import NavigationHeader from '../navigation-header'
import Footer from '../footer'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import { apiCall } from '../../utils/api'

interface Artisan {
  id: string
  name: string
  craft: string
  location: string
  experience: number
  rating: number
  review_count: number
  products_count: number
  is_verified: boolean
  bio: string
  created_at: string
}

export default function ArtisansPage() {
  const { navigate } = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedCraft, setSelectedCraft] = useState('all')
  const [sortBy, setSortBy] = useState('rating')
  const [artisans, setArtisans] = useState<Artisan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load artisans from API
  useEffect(() => {
    loadArtisans()
  }, [])

  const loadArtisans = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiCall('/artisans')
      setArtisans(response.data.artisans || [])
    } catch (error) {
      console.error('Error loading artisans:', error)
      setError('Failed to load artisans')
    } finally {
      setLoading(false)
    }
  }

  // Get unique locations and crafts from artisans data
  const locations = ['All Locations', ...new Set(artisans.map(a => a.location.split(',')[1]?.trim()).filter(Boolean))]
  const crafts = ['All Crafts', ...new Set(artisans.map(a => a.craft).filter(Boolean))]

  const filteredArtisans = artisans.filter(artisan => {
    const matchesSearch = artisan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artisan.craft.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artisan.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLocation = selectedLocation === 'all' || 
                           artisan.location.toLowerCase().includes(selectedLocation.toLowerCase())
    const matchesCraft = selectedCraft === 'all' || 
                        artisan.craft.toLowerCase().includes(selectedCraft.toLowerCase())
    
    return matchesSearch && matchesLocation && matchesCraft
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'experience':
        return b.experience - a.experience
      case 'products':
        return b.productsCount - a.productsCount
      case 'joined':
        return parseInt(b.joinedDate) - parseInt(a.joinedDate)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 botanical-pattern">
      <NavigationHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Meet Our Artisans
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Connect with skilled craftspeople preserving traditional Indian art forms. 
            Each artisan brings generations of knowledge and passion to their craft.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 card-shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search artisans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input-background border-primary/20 focus:border-primary/40 rounded-xl"
              />
            </div>
            
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="bg-input-background border-primary/20 focus:border-primary/40 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem 
                    key={location} 
                    value={location === 'All Locations' ? 'all' : location.toLowerCase()}
                  >
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCraft} onValueChange={setSelectedCraft}>
              <SelectTrigger className="bg-input-background border-primary/20 focus:border-primary/40 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {crafts.map((craft) => (
                  <SelectItem 
                    key={craft} 
                    value={craft === 'All Crafts' ? 'all' : craft.toLowerCase()}
                  >
                    {craft}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-input-background border-primary/20 focus:border-primary/40 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="experience">Most Experienced</SelectItem>
                <SelectItem value="products">Most Products</SelectItem>
                <SelectItem value="joined">Recently Joined</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-card/60 backdrop-blur-sm rounded-xl card-shadow">
            <div className="text-2xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
              {filteredArtisans.length}
            </div>
            <p className="text-sm text-muted-foreground">Artisans Found</p>
          </div>
          <div className="text-center p-4 bg-card/60 backdrop-blur-sm rounded-xl card-shadow">
            <div className="text-2xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
              {filteredArtisans.filter(a => a.isVerified).length}
            </div>
            <p className="text-sm text-muted-foreground">Verified</p>
          </div>
          <div className="text-center p-4 bg-card/60 backdrop-blur-sm rounded-xl card-shadow">
            <div className="text-2xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
              {filteredArtisans.filter(a => a.isOnline).length}
            </div>
            <p className="text-sm text-muted-foreground">Online Now</p>
          </div>
          <div className="text-center p-4 bg-card/60 backdrop-blur-sm rounded-xl card-shadow">
            <div className="text-2xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
              {Math.round(filteredArtisans.reduce((acc, a) => acc + a.rating, 0) / filteredArtisans.length * 10) / 10}
            </div>
            <p className="text-sm text-muted-foreground">Avg Rating</p>
          </div>
        </div>

        {/* Artisans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredArtisans.map((artisan) => (
            <Card 
              key={artisan.id}
              className="group cursor-pointer border-0 bg-card/60 backdrop-blur-sm card-shadow hover:card-shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => navigate('product-catalog', { artisan: artisan.id })}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="relative">
                    <ImageWithFallback
                      src={`https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMGFydGlzYW58ZW58MXx8fHwxNzU4MzY2MjE2fDA&ixlib=rb-4.1.0&q=80&w=400`}
                      alt={artisan.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {artisan.is_verified && (
                      <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground p-1 rounded-full">
                        <Award className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {artisan.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">{artisan.craft}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate">{artisan.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{artisan.rating}</span>
                    <span className="text-xs text-muted-foreground ml-1">
                      ({artisan.review_count})
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-secondary/60">
                    {artisan.experience} years
                  </Badge>
                </div>

                <div className="flex items-center text-xs text-muted-foreground mb-4">
                  <Users className="h-3 w-3 mr-1" />
                  <span>{artisan.products_count} products</span>
                  <span className="mx-2">•</span>
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Since {new Date(artisan.created_at).getFullYear()}</span>
                </div>

                {artisan.bio && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {artisan.bio}
                  </p>
                )}

                <div className="flex gap-2">
                  <Button 
                    className="flex-1 group-hover:bg-primary/90"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate('product-catalog', { artisan: artisan.id })
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Work
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-card/60 border-primary/20 hover:bg-primary/5"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle message action
                    }}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArtisans.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-secondary/60 rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No artisans found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or filters
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedLocation('all')
                  setSelectedCraft('all')
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 card-shadow">
          <h2 className="text-2xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Are you an artisan?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join our community of skilled craftspeople and share your art with the world. 
            Get AI-powered tools to enhance your business and reach new customers.
          </p>
          <Button onClick={() => navigate('artisan-auth')} className="px-8">
            <Sparkles className="w-4 h-4 mr-2" />
            Join ShilpkaarAI
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}