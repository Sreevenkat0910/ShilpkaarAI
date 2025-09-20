import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Sparkles, Bot, Camera, Palette, ArrowRight, Leaf } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { useRouter } from './router'

export default function HeroSection() {
  const { navigate } = useRouter()

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/40 botanical-pattern">
      {/* Organic Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-secondary/30 rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-10rem)]">
          {/* Content */}
          <div className="space-y-10">
            <div className="space-y-8">
              <Badge variant="secondary" className="w-fit px-4 py-2 bg-card/60 border border-primary/20 shadow-sm">
                <Leaf className="w-4 h-4 mr-2 text-primary" />
                AI-Powered Artisan Marketplace
              </Badge>
              
              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl leading-tight tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                  <span className="block text-primary">Authentic</span>
                  <span className="block text-foreground">Crafts Meet</span>
                  <span className="block text-primary">Modern AI</span>
                </h1>
                
                <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                
                <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                  Discover handcrafted treasures from skilled Indian artisans. 
                  Enhanced by AI to tell authentic stories, showcase beauty, 
                  and connect cultures across the world.
                </p>
              </div>
            </div>

            {/* AI Features Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-6 rounded-2xl bg-card/40 border border-primary/10 card-shadow hover:card-shadow-lg transition-all hover:scale-105 backdrop-blur-sm">
                <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">AI Stories</p>
                <p className="text-xs text-muted-foreground mt-1">Authentic narratives</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-card/40 border border-primary/10 card-shadow hover:card-shadow-lg transition-all hover:scale-105 backdrop-blur-sm">
                <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">Enhancement</p>
                <p className="text-xs text-muted-foreground mt-1">Professional photos</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-card/40 border border-primary/10 card-shadow hover:card-shadow-lg transition-all hover:scale-105 backdrop-blur-sm">
                <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Palette className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">AR Preview</p>
                <p className="text-xs text-muted-foreground mt-1">Virtual placement</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="flex-1 sm:flex-none px-8 py-4 shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
                onClick={() => navigate('product-catalog')}
              >
                Explore Marketplace
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1 sm:flex-none px-8 py-4 bg-card/60 border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-all hover:scale-105"
                onClick={() => navigate('artisan-auth')}
              >
                Join as Artisan
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-primary/10">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>500+</div>
                <p className="text-sm text-muted-foreground mt-1">Verified Artisans</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>2000+</div>
                <p className="text-sm text-muted-foreground mt-1">Unique Products</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>50+</div>
                <p className="text-sm text-muted-foreground mt-1">Craft Categories</p>
              </div>
            </div>
          </div>

          {/* Hero Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  <div className="relative overflow-hidden rounded-3xl card-shadow-lg">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1716876995651-1ff85b65a6d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBoYW5kaWNyYWZ0cyUyMHBvdHRlcnklMjBhcnRpc2FufGVufDF8fHx8MTc1ODM2NjIwMHww&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Indian pottery artisan at work"
                      className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
                    <Badge className="absolute bottom-6 left-6 bg-card/90 text-primary border-0 shadow-sm backdrop-blur-sm">
                      Pottery
                    </Badge>
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  <div className="relative overflow-hidden rounded-3xl card-shadow-lg">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1653227907864-560dce4c252d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBqZXdlbHJ5JTIwbWFraW5nJTIwY3JhZnRzfGVufDF8fHx8MTc1ODM2NjIwNXww&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Indian jewelry making"
                      className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
                    <Badge className="absolute bottom-6 left-6 bg-card/90 text-primary border-0 shadow-sm backdrop-blur-sm">
                      Jewelry
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  <div className="relative overflow-hidden rounded-3xl card-shadow-lg">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1632726733402-4a059a476028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB0ZXh0aWxlcyUyMHdlYXZpbmclMjBhcnRpc2FufGVufDF8fHx8MTc1ODM2NjIwMnww&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Indian textile weaving"
                      className="w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
                    <Badge className="absolute bottom-6 left-6 bg-card/90 text-primary border-0 shadow-sm backdrop-blur-sm">
                      Textiles
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating AI Badge */}
            <div className="absolute -top-6 -right-6 bg-primary text-primary-foreground p-4 rounded-2xl shadow-lg animate-bounce">
              <Sparkles className="h-7 w-7" />
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 -left-8 w-4 h-4 bg-accent rounded-full opacity-60"></div>
            <div className="absolute bottom-1/4 -right-4 w-6 h-6 bg-secondary rounded-full opacity-40"></div>
          </div>
        </div>
      </div>
    </section>
  )
}