import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { 
  TrendingUp, 
  Package, 
  Users, 
  Star, 
  Plus, 
  ArrowLeft, 
  Bot, 
  BarChart3,
  Bell,
  Sparkles,
  Mic,
  ArrowUpRight,
  Eye,
  ShoppingCart,
  Heart,
  MessageCircle,
  Type,
  RefreshCw,
  Wand2,
  Volume2,
  Camera
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useRouter } from '../router'
import NavigationHeader from '../navigation-header'
import Footer from '../footer'

export default function ArtisanDashboard() {
  const { navigate, goBack } = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [storyInput, setStoryInput] = useState('')
  const [generatedStory, setGeneratedStory] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isListening, setIsListening] = useState(false)

  const generateStory = async () => {
    if (!storyInput.trim()) return
    
    setIsGenerating(true)
    
    // Simulate AI story generation
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const aiStory = `This exquisite ${storyInput.toLowerCase()} represents centuries of traditional Indian craftsmanship passed down through generations. Each piece is meticulously handcrafted using time-honored techniques that have been refined over decades.

The intricate details showcase the artisan's deep understanding of cultural motifs and patterns, creating a piece that is not just beautiful but carries the soul of Indian heritage. Every stitch, every pattern, every color has been chosen with care to ensure authenticity and quality.

This unique creation combines traditional artistry with contemporary appeal, making it perfect for those who appreciate the finer things in life. Whether for personal use or as a meaningful gift, this handcrafted masterpiece brings warmth, culture, and timeless elegance to any setting.

Created with love and dedication in the heartland of India, this piece stands as a testament to the enduring beauty of traditional crafts in our modern world.`

    setGeneratedStory(aiStory)
    setIsGenerating(false)
  }

  const startVoiceInput = () => {
    setIsListening(true)
    // Simulate voice recognition
    setTimeout(() => {
      setStoryInput('Handwoven Banarasi Silk Saree with gold zari work')
      setIsListening(false)
    }, 3000)
  }

  const salesData = [
    { month: 'Jan', sales: 1200, orders: 8 },
    { month: 'Feb', sales: 1800, orders: 12 },
    { month: 'Mar', sales: 2400, orders: 16 },
    { month: 'Apr', sales: 3200, orders: 22 },
    { month: 'May', sales: 2800, orders: 19 },
    { month: 'Jun', sales: 3600, orders: 25 },
  ]

  const categoryData = [
    { name: 'Textiles', value: 45, color: '#4a5d23' },
    { name: 'Pottery', value: 30, color: '#6b7c3f' },
    { name: 'Jewelry', value: 25, color: '#8ba05c' },
  ]

  const notifications = [
    { id: 1, type: 'order', message: 'New order for Banarasi Saree', time: '2 min ago', isNew: true },
    { id: 2, type: 'ai', message: 'AI description ready for Blue Pottery Set', time: '1 hour ago', isNew: true },
    { id: 3, type: 'review', message: 'New 5-star review from customer', time: '3 hours ago', isNew: false },
    { id: 4, type: 'system', message: 'Photo enhancement completed', time: '1 day ago', isNew: false },
  ]

  const quickActions = [
    { 
      icon: Plus, 
      label: 'Add Product', 
      description: 'Upload new craft with AI assistance',
      action: () => navigate('add-product'),
      color: 'bg-primary'
    },
    { 
      icon: Camera, 
      label: 'Enhance Photos', 
      description: 'AI-powered photo enhancement',
      action: () => navigate('artisan-ai-tools'),
      color: 'bg-purple-500'
    },
    { 
      icon: Bot, 
      label: 'Generate Story', 
      description: 'Create product descriptions with AI',
      action: () => setActiveTab('ai-story'),
      color: 'bg-blue-500'
    },
    { 
      icon: BarChart3, 
      label: 'View Analytics', 
      description: 'Detailed sales insights',
      action: () => navigate('artisan-analytics'),
      color: 'bg-green-500'
    },
  ]

  const recentProducts = [
    { id: 1, name: 'Handwoven Silk Saree', status: 'Live', views: 234, likes: 45, orders: 3 },
    { id: 2, name: 'Blue Pottery Vase', status: 'Draft', views: 0, likes: 0, orders: 0 },
    { id: 3, name: 'Silver Earrings', status: 'Live', views: 189, likes: 32, orders: 5 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 botanical-pattern">
      <NavigationHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="icon" onClick={goBack} className="hover:bg-card/60">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl" style={{ fontFamily: 'Playfair Display, serif' }}>
              Artisan Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, Priya! Manage your craft business with AI-powered tools.
            </p>
          </div>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-secondary/40 border border-primary/10">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-card">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="ai-story" className="data-[state=active]:bg-card">
              AI Story Generator
            </TabsTrigger>
            <TabsTrigger value="voice-tools" className="data-[state=active]:bg-card">
              Voice Tools
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">₹3,600</p>
                      <p className="text-xs text-muted-foreground">This Month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Package className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">25</p>
                      <p className="text-xs text-muted-foreground">Orders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">1.2K</p>
                      <p className="text-xs text-muted-foreground">Views</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <Star className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">4.8</p>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Actions */}
                <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-primary" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription>Powered by AI to help you grow your craft business</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {quickActions.map((action, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg border bg-card/40 hover:bg-card/60 cursor-pointer transition-all group min-h-[100px]"
                          onClick={action.action}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform flex-shrink-0`}>
                              <action.icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium group-hover:text-primary transition-colors text-sm md:text-base">
                                {action.label}
                              </h4>
                              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                                {action.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Sales Chart */}
                <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                  <CardHeader>
                    <CardTitle>Sales Overview</CardTitle>
                    <CardDescription>Your sales performance over the last 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(49, 79, 54, 0.1)" />
                          <XAxis dataKey="month" stroke="#65796e" />
                          <YAxis stroke="#65796e" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#f4f8ef', 
                              border: '1px solid rgba(49, 79, 54, 0.15)',
                              borderRadius: '8px'
                            }}
                            formatter={(value, name) => [
                              name === 'sales' ? `₹${value}` : value,
                              name === 'sales' ? 'Sales' : 'Orders'
                            ]}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="sales" 
                            stroke="#314f36" 
                            fill="rgba(49, 79, 54, 0.1)"
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Products */}
                <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Recent Products</CardTitle>
                        <CardDescription>Your latest product listings</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate('artisan-products')}>
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentProducts.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/40">
                          <div>
                            <h4 className="font-medium">{product.name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <Badge variant={product.status === 'Live' ? 'default' : 'secondary'}>
                                {product.status}
                              </Badge>
                              <div className="flex items-center space-x-1">
                                <Eye className="h-3 w-3" />
                                <span>{product.views}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Heart className="h-3 w-3" />
                                <span>{product.likes}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <ShoppingCart className="h-3 w-3" />
                                <span>{product.orders}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Category Performance */}
                <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                  <CardHeader>
                    <CardTitle>Category Performance</CardTitle>
                    <CardDescription>Sales by product category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2 mt-4">
                      {categoryData.map((category, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: category.color }}
                            />
                            <span>{category.name}</span>
                          </div>
                          <span className="font-medium">{category.value}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Notifications */}
                <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-3 rounded-lg border ${
                            notification.isNew ? 'bg-primary/5 border-primary/20' : 'bg-card/40'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-1.5 rounded-full ${
                              notification.type === 'order' ? 'bg-green-500/20 text-green-600' :
                              notification.type === 'ai' ? 'bg-purple-500/20 text-purple-600' :
                              notification.type === 'review' ? 'bg-yellow-500/20 text-yellow-600' :
                              'bg-blue-500/20 text-blue-600'
                            }`}>
                              {notification.type === 'order' && <Package className="h-3 w-3" />}
                              {notification.type === 'ai' && <Bot className="h-3 w-3" />}
                              {notification.type === 'review' && <Star className="h-3 w-3" />}
                              {notification.type === 'system' && <Wand2 className="h-3 w-3" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{notification.message}</p>
                              <p className="text-xs text-muted-foreground">{notification.time}</p>
                            </div>
                            {notification.isNew && (
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* AI Story Generator Tab */}
          <TabsContent value="ai-story" className="space-y-6">
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="h-5 w-5 mr-2 text-primary" />
                  AI Story Generator
                </CardTitle>
                <CardDescription>
                  Create compelling product descriptions using AI. Type your product details or use voice input.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <Input
                        placeholder="e.g., Handwoven Banarasi Silk Saree with gold zari work"
                        value={storyInput}
                        onChange={(e) => setStoryInput(e.target.value)}
                        className="bg-input-background border-primary/20 focus:border-primary/40"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={startVoiceInput}
                      disabled={isListening}
                      className={`bg-card/60 border-primary/20 ${isListening ? 'animate-pulse' : ''}`}
                    >
                      {isListening ? (
                        <Volume2 className="h-4 w-4 text-red-500" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </Button>
                    <Button 
                      onClick={generateStory}
                      disabled={!storyInput.trim() || isGenerating}
                      className="shadow-sm"
                    >
                      {isGenerating ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Wand2 className="h-4 w-4 mr-2" />
                      )}
                      Generate Story
                    </Button>
                  </div>

                  {isListening && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Volume2 className="h-4 w-4 text-blue-600 animate-pulse" />
                        <p className="text-sm text-blue-700">Listening... Please describe your product</p>
                      </div>
                    </div>
                  )}

                  {generatedStory && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Generated Story</h4>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(generatedStory)}
                          >
                            Copy
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setGeneratedStory('')}
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 bg-secondary/20 rounded-lg border">
                        <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">
                          {generatedStory}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Type className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-sm">Type Description</h4>
                    <p className="text-xs text-muted-foreground mt-1">Enter product details manually</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-green-100 rounded-lg flex items-center justify-center">
                      <Mic className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-medium text-sm">Voice Input</h4>
                    <p className="text-xs text-muted-foreground mt-1">Speak your product description</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Bot className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-sm">AI Generation</h4>
                    <p className="text-xs text-muted-foreground mt-1">Get compelling stories instantly</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Voice Tools Tab */}
          <TabsContent value="voice-tools" className="space-y-6">
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Volume2 className="h-5 w-5 mr-2 text-primary" />
                  Voice Assistant Tools
                </CardTitle>
                <CardDescription>
                  Use voice commands to manage your craft business hands-free
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                      <Mic className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">Voice Commands</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Control your dashboard with simple voice commands
                    </p>
                    <Button className="w-full">
                      Start Listening
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Available Commands:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="p-2 bg-secondary/20 rounded">
                        <strong>"Add new product"</strong> - Opens product creation
                      </div>
                      <div className="p-2 bg-secondary/20 rounded">
                        <strong>"Check my sales"</strong> - Shows analytics
                      </div>
                      <div className="p-2 bg-secondary/20 rounded">
                        <strong>"Generate story"</strong> - Opens AI story tool
                      </div>
                      <div className="p-2 bg-secondary/20 rounded">
                        <strong>"Show my products"</strong> - Opens product list
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}