import { useState } from 'react'
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

export default function ArtisansPage() {
  const { navigate } = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedCraft, setSelectedCraft] = useState('all')
  const [sortBy, setSortBy] = useState('rating')

  const artisans = [
    {
      id: '1',
      name: 'Priya Sharma',
      craft: 'Textile Weaving',
      location: 'Varanasi, Uttar Pradesh',
      experience: 15,
      rating: 4.9,
      reviewCount: 234,
      productsCount: 45,
      isVerified: true,
      isOnline: true,
      specialties: ['Banarasi Silk', 'Traditional Weaving', 'Custom Designs'],
      joinedDate: '2019',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMGFydGlzYW58ZW58MXx8fHwxNzU4MzY2MjE2fDA&ixlib=rb-4.1.0&q=80&w=400',
      portfolio: [
        'https://images.unsplash.com/photo-1632726733402-4a059a476028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB0ZXh0aWxlcyUyMHdlYXZpbmclMjBhcnRpc2FufGVufDF8fHx8MTc1ODM2NjIwMnww&ixlib=rb-4.1.0&q=80&w=200'
      ]
    },
    {
      id: '2',
      name: 'Rajesh Kumar',
      craft: 'Blue Pottery',
      location: 'Jaipur, Rajasthan',
      experience: 22,
      rating: 4.7,
      reviewCount: 189,
      productsCount: 38,
      isVerified: true,
      isOnline: false,
      specialties: ['Blue Pottery', 'Ceramic Art', 'Traditional Designs'],
      joinedDate: '2018',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjBhcnRpc2FufGVufDF8fHx8MTc1ODM2NjIxN3ww&ixlib=rb-4.1.0&q=80&w=400',
      portfolio: [
        'https://images.unsplash.com/photo-1716876995651-1ff85b65a6d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBoYW5kaWNyYWZ0cyUyMHBvdHRlcnklMjBhcnRpc2FufGVufDF8fHx8MTc1ODM2NjIwMHww&ixlib=rb-4.1.0&q=80&w=200'
      ]
    },
    {
      id: '3',
      name: 'Meera Patel',
      craft: 'Silver Jewelry',
      location: 'Cuttack, Odisha',
      experience: 18,
      rating: 4.8,
      reviewCount: 312,
      productsCount: 67,
      isVerified: true,
      isOnline: true,
      specialties: ['Silver Filigree', 'Traditional Jewelry', 'Custom Pieces'],
      joinedDate: '2020',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b2bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMGFydGlzYW4lMjBqZXdlbHJ5fGVufDF8fHx8MTc1ODM2NjIxOHww&ixlib=rb-4.1.0&q=80&w=400',
      portfolio: [
        'https://images.unsplash.com/photo-1653227907864-560dce4c252d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBqZXdlbHJ5JTIwbWFraW5nJTIwY3JhZnRzfGVufDF8fHx8MTc1ODM2NjIwNXww&ixlib=rb-4.1.0&q=80&w=200'
      ]
    },
    {
      id: '4',
      name: 'Arjun Singh',
      craft: 'Wood Carving',
      location: 'Saharanpur, Uttar Pradesh',
      experience: 25,
      rating: 4.6,
      reviewCount: 156,
      productsCount: 29,
      isVerified: true,
      isOnline: false,
      specialties: ['Wood Carving', 'Furniture', 'Decorative Items'],
      joinedDate: '2017',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjBhcnRpc2FuJTIwd29vZCUyMGNhcnZpbmd8ZW58MXx8fHwxNzU4MzY2MjE5fDA&ixlib=rb-4.1.0&q=80&w=400',
      portfolio: [
        'https://images.unsplash.com/photo-1595126035905-21b5c2b67c42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kd29ya2luZyUyMGluZGlhbiUyMGFydGlzYW58ZW58MXx8fHwxNzU4MzY2MjA3fDA&ixlib=rb-4.1.0&q=80&w=200'
      ]
    }
  ]

  const locations = ['All Locations', 'Rajasthan', 'Uttar Pradesh', 'Odisha', 'Gujarat', 'Maharashtra']
  const crafts = ['All Crafts', 'Textile Weaving', 'Pottery', 'Jewelry', 'Wood Carving', 'Metalwork', 'Paintings']

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
                      src={artisan.avatar}
                      alt={artisan.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {artisan.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                    {artisan.isVerified && (
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
                      ({artisan.reviewCount})
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-secondary/60">
                    {artisan.experience} years
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {artisan.specialties.slice(0, 2).map((specialty) => (
                    <Badge key={specialty} variant="outline" className="text-xs border-primary/20">
                      {specialty}
                    </Badge>
                  ))}
                  {artisan.specialties.length > 2 && (
                    <Badge variant="outline" className="text-xs border-primary/20">
                      +{artisan.specialties.length - 2}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center text-xs text-muted-foreground mb-4">
                  <Users className="h-3 w-3 mr-1" />
                  <span>{artisan.productsCount} products</span>
                  <span className="mx-2">•</span>
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Since {artisan.joinedDate}</span>
                </div>

                {artisan.portfolio.length > 0 && (
                  <div className="mb-4">
                    <ImageWithFallback
                      src={artisan.portfolio[0]}
                      alt="Portfolio sample"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  </div>
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
            Join ShipkaarAI
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}