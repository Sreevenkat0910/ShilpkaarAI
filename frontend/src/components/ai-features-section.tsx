import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Bot, Camera, Palette, Mic, Globe, Zap } from 'lucide-react'

export default function AIFeaturesSection() {
  const features = [
    {
      icon: Bot,
      title: 'AI Product Storytelling',
      description: 'Generate compelling product descriptions that capture the cultural significance and craftsmanship behind each piece.',
      status: 'Live',
      statusColor: 'bg-green-500',
      demo: 'Try Demo'
    },
    {
      icon: Camera,
      title: 'Photo Enhancement',
      description: 'Transform product photos with studio-quality lighting, background replacement, and professional editing.',
      status: 'Live',
      statusColor: 'bg-green-500',
      demo: 'Upload Photo'
    },
    {
      icon: Palette,
      title: 'AR Product Visualization',
      description: 'Let customers visualize products in their space using augmented reality technology.',
      status: 'Beta',
      statusColor: 'bg-yellow-500',
      demo: 'View AR'
    },
    {
      icon: Mic,
      title: 'Voice-First Interface',
      description: 'Navigate and manage your store using voice commands in multiple Indian languages.',
      status: 'Coming Soon',
      statusColor: 'bg-gray-500',
      demo: 'Learn More'
    },
    {
      icon: Globe,
      title: 'Multi-language Support',
      description: 'Automatic translation of product descriptions to reach customers across India and globally.',
      status: 'Coming Soon',
      statusColor: 'bg-gray-500',
      demo: 'Learn More'
    },
    {
      icon: Zap,
      title: 'Smart Recommendations',
      description: 'AI-powered suggestions for pricing, seasonal trends, and customer preferences.',
      status: 'Beta',
      statusColor: 'bg-yellow-500',
      demo: 'See Insights'
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Tools
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Empowering Artisans with{' '}
            <span className="text-primary">Artificial Intelligence</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI tools help artisans showcase their crafts professionally, 
            reach wider audiences, and tell their stories in compelling ways.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden border-0 bg-card/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-white ${feature.statusColor}`}
                  >
                    {feature.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  {feature.description}
                </p>
                <Button 
                  variant={feature.status === 'Live' ? 'default' : 'outline'} 
                  size="sm" 
                  className="w-full"
                  disabled={feature.status === 'Coming Soon'}
                >
                  {feature.demo}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Workflow Demo */}
        <div className="bg-card/40 rounded-2xl p-8 border">
          <h3 className="text-2xl font-bold text-center mb-8">
            See AI in Action: From Photo to Sale
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">1. Upload Photo</h4>
              <p className="text-sm text-muted-foreground">
                Take a simple photo of your craft
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">2. AI Enhancement</h4>
              <p className="text-sm text-muted-foreground">
                AI improves lighting and background
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">3. Story Generation</h4>
              <p className="text-sm text-muted-foreground">
                AI creates compelling product description
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Palette className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">4. AR Ready</h4>
              <p className="text-sm text-muted-foreground">
                Product ready for AR visualization
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button size="lg">
              Start Your AI Journey
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}