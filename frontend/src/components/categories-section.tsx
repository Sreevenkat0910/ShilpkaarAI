import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { ArrowRight } from 'lucide-react'

export default function CategoriesSection() {
  const categories = [
    {
      id: 1,
      name: 'Textiles & Fabrics',
      description: 'Handwoven sarees, rugs, and traditional fabrics',
      count: '450+ products',
      color: 'bg-red-100 text-red-700',
      icon: '🧶'
    },
    {
      id: 2,
      name: 'Pottery & Ceramics',
      description: 'Traditional clay works and modern ceramics',
      count: '320+ products',
      color: 'bg-orange-100 text-orange-700',
      icon: '🏺'
    },
    {
      id: 3,
      name: 'Jewelry & Accessories',
      description: 'Handcrafted ornaments and accessories',
      count: '680+ products',
      color: 'bg-yellow-100 text-yellow-700',
      icon: '💎'
    },
    {
      id: 4,
      name: 'Woodwork & Sculpture',
      description: 'Carved furniture and decorative pieces',
      count: '290+ products',
      color: 'bg-green-100 text-green-700',
      icon: '🪵'
    },
    {
      id: 5,
      name: 'Metalwork & Brass',
      description: 'Traditional brass items and metal crafts',
      count: '180+ products',
      color: 'bg-blue-100 text-blue-700',
      icon: '⚱️'
    },
    {
      id: 6,
      name: 'Paintings & Art',
      description: 'Traditional and contemporary artworks',
      count: '420+ products',
      color: 'bg-purple-100 text-purple-700',
      icon: '🎨'
    }
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore Craft Categories
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the rich diversity of Indian handicrafts across various traditional and contemporary categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-card/60 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{category.icon}</div>
                  <Badge className={category.color}>
                    {category.count}
                  </Badge>
                </div>
                
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4">
                  {category.description}
                </p>
                
                <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                  Explore Category
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Artisan Communities */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">Featured Artisan Communities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Rajasthan', specialty: 'Block Prints', artisans: '120+' },
              { name: 'Kashmir', specialty: 'Pashmina', artisans: '85+' },
              { name: 'Kerala', specialty: 'Coir Products', artisans: '95+' },
              { name: 'Gujarat', specialty: 'Bandhani', artisans: '150+' }
            ].map((community, index) => (
              <Card key={index} className="text-center p-4 bg-card/40">
                <CardContent className="p-0">
                  <div className="text-lg font-semibold text-primary">{community.artisans}</div>
                  <div className="font-medium">{community.name}</div>
                  <div className="text-sm text-muted-foreground">{community.specialty}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}