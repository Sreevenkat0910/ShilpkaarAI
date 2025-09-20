import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { ArrowLeft, Search, ArrowRight, Sparkles } from 'lucide-react'
import { useRouter } from '../router'
import NavigationHeader from '../navigation-header'
import Footer from '../footer'
import { ImageWithFallback } from '../figma/ImageWithFallback'

export default function CategoriesPage() {
  const { navigate, goBack } = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    {
      id: 'textiles',
      name: 'Textiles & Fabrics',
      description: 'Handwoven sarees, fabrics, and traditional garments',
      itemCount: 450,
      trending: true,
      image: 'https://images.unsplash.com/photo-1632726733402-4a059a476028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB0ZXh0aWxlcyUyMHdlYXZpbmclMjBhcnRpc2FufGVufDF8fHx8MTc1ODM2NjIwMnww&ixlib=rb-4.1.0&q=80&w=1080',
      subcategories: ['Sarees', 'Silk Fabrics', 'Cotton Textiles', 'Block Prints']
    },
    {
      id: 'pottery',
      name: 'Pottery & Ceramics',
      description: 'Traditional clay pottery, terracotta, and ceramic art',
      itemCount: 320,
      trending: false,
      image: 'https://images.unsplash.com/photo-1716876995651-1ff85b65a6d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBoYW5kaWNyYWZ0cyUyMHBvdHRlcnklMjBhcnRpc2FufGVufDF8fHx8MTc1ODM2NjIwMHww&ixlib=rb-4.1.0&q=80&w=1080',
      subcategories: ['Blue Pottery', 'Terracotta', 'Clay Vessels', 'Decorative Items']
    },
    {
      id: 'jewelry',
      name: 'Jewelry & Ornaments',
      description: 'Handcrafted silver, brass, and traditional jewelry',
      itemCount: 280,
      trending: true,
      image: 'https://images.unsplash.com/photo-1653227907864-560dce4c252d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBqZXdlbHJ5JTIwbWFraW5nJTIwY3JhZnRzfGVufDF8fHx8MTc1ODM2NjIwNXww&ixlib=rb-4.1.0&q=80&w=1080',
      subcategories: ['Silver Work', 'Brass Items', 'Traditional Sets', 'Modern Fusion']
    },
    {
      id: 'woodwork',
      name: 'Woodwork & Carving',
      description: 'Hand-carved furniture, sculptures, and decorative pieces',
      itemCount: 180,
      trending: false,
      image: 'https://images.unsplash.com/photo-1595126035905-21b5c2b67c42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kd29ya2luZyUyMGluZGlhbiUyMGFydGlzYW58ZW58MXx8fHwxNzU4MzY2MjA3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      subcategories: ['Furniture', 'Sculptures', 'Toys', 'Decorative']
    },
    {
      id: 'metalwork',
      name: 'Metalwork & Crafts',
      description: 'Brass, copper, and iron crafts with traditional techniques',
      itemCount: 150,
      trending: false,
      image: 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXRhbHdvcmslMjBjcmFmdHMlMjBpbmRpYW58ZW58MXx8fHwxNzU4MzY2MjA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      subcategories: ['Brass Work', 'Copper Items', 'Iron Crafts', 'Mixed Metal']
    },
    {
      id: 'paintings',
      name: 'Paintings & Art',
      description: 'Traditional paintings, folk art, and contemporary pieces',
      itemCount: 200,
      trending: true,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBwYWludGluZ3MlMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NTgzNjYyMTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      subcategories: ['Madhubani', 'Warli Art', 'Miniature', 'Contemporary']
    }
  ]

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 botanical-pattern">
      <NavigationHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Craft Categories
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore authentic handcrafted treasures organized by traditional craft categories. 
            Each category represents centuries of artisan heritage and skill.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-card/60 border-primary/20 focus:border-primary/40 rounded-2xl text-center"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredCategories.map((category) => (
            <Card 
              key={category.id} 
              className="group cursor-pointer border-0 bg-card/60 backdrop-blur-sm card-shadow hover:card-shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden"
              onClick={() => navigate('product-catalog', { category: category.id })}
            >
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                  {category.trending && (
                    <Badge className="bg-red-500 text-white border-0 shadow-sm">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-semibold text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {category.name}
                  </h3>
                  <p className="text-sm text-white/90">
                    {category.itemCount} items
                  </p>
                </div>
              </div>

              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {category.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {category.subcategories.slice(0, 3).map((sub) => (
                    <Badge key={sub} variant="secondary" className="text-xs bg-secondary/60">
                      {sub}
                    </Badge>
                  ))}
                  {category.subcategories.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-secondary/60">
                      +{category.subcategories.length - 3} more
                    </Badge>
                  )}
                </div>

                <Button 
                  className="w-full group-hover:bg-primary/90 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate('product-catalog', { category: category.id })
                  }}
                >
                  Explore {category.name}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-secondary/60 rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No categories found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms
            </p>
            <Button onClick={() => setSearchQuery('')}>
              Clear search
            </Button>
          </div>
        )}

        {/* Featured Section */}
        <div className="text-center">
          <h2 className="text-2xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Can't find what you're looking for?
          </h2>
          <p className="text-muted-foreground mb-6">
            Browse all products or get in touch with our artisan community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('product-catalog')}
              className="bg-card/60 border-primary/20 hover:bg-primary/5"
            >
              Browse All Products
            </Button>
            <Button onClick={() => navigate('artisans')}>
              Meet Our Artisans
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}