import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Slider } from '../ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { 
  ArrowLeft,
  Bot,
  Camera,
  Wand2,
  Sparkles,
  Palette,
  Eye,
  Download,
  Upload,
  Mic,
  Volume2,
  RefreshCw,
  Settings,
  Zap,
  Image as ImageIcon,
  Type,
  Languages,
  FileText,
  Share2,
  Copy,
  Check,
  Star,
  Target,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react'
import { useRouter } from '../router'
import NavigationHeader from '../navigation-header'
import Footer from '../footer'
import { ImageWithFallback } from '../figma/ImageWithFallback'

export default function ArtisanAITools() {
  const { goBack } = useRouter()
  const [activeTab, setActiveTab] = useState('photo-enhance')
  
  // Photo Enhancement State
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [enhancementProgress, setEnhancementProgress] = useState(0)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [enhancementSettings, setEnhancementSettings] = useState({
    brightness: [50],
    contrast: [50],
    saturation: [50],
    sharpness: [50]
  })

  // Story Generation State
  const [storyInput, setStoryInput] = useState('')
  const [generatedStory, setGeneratedStory] = useState('')
  const [isGeneratingStory, setIsGeneratingStory] = useState(false)
  const [storyLanguage, setStoryLanguage] = useState('en')
  const [storyTone, setStoryTone] = useState('traditional')
  const [isListening, setIsListening] = useState(false)

  // Voice Tools State
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [voiceCommand, setVoiceCommand] = useState('')

  // SEO Optimization State
  const [productTitle, setProductTitle] = useState('')
  const [generatedKeywords, setGeneratedKeywords] = useState<string[]>([])
  const [seoScore, setSeoScore] = useState(0)

  // Translation State
  const [translationText, setTranslationText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [targetLanguage, setTargetLanguage] = useState('hi')

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const enhancePhoto = async () => {
    if (!selectedImage) return
    
    setIsEnhancing(true)
    setEnhancementProgress(0)
    
    // Simulate enhancement progress
    const interval = setInterval(() => {
      setEnhancementProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsEnhancing(false)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const generateStory = async () => {
    if (!storyInput.trim()) return
    
    setIsGeneratingStory(true)
    
    // Simulate AI story generation
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const stories = {
      traditional: `This exquisite ${storyInput.toLowerCase()} represents centuries of traditional Indian craftsmanship passed down through generations. Each piece is meticulously handcrafted using time-honored techniques that have been refined over decades.

The intricate details showcase the artisan's deep understanding of cultural motifs and patterns, creating a piece that is not just beautiful but carries the soul of Indian heritage. Every stitch, every pattern, every color has been chosen with care to ensure authenticity and quality.

This unique creation combines traditional artistry with contemporary appeal, making it perfect for those who appreciate the finer things in life. Whether for personal use or as a meaningful gift, this handcrafted masterpiece brings warmth, culture, and timeless elegance to any setting.

Created with love and dedication in the heartland of India, this piece stands as a testament to the enduring beauty of traditional crafts in our modern world.`,
      modern: `Discover the perfect blend of tradition and innovation with this stunning ${storyInput.toLowerCase()}. Crafted by skilled artisans who understand both heritage techniques and contemporary aesthetics, this piece represents the evolution of Indian craftsmanship.

Using sustainable materials and eco-friendly processes, each ${storyInput.toLowerCase()} is created with mindful attention to quality and environmental responsibility. The modern design elements seamlessly integrate with traditional patterns, creating a unique piece that speaks to today's conscious consumers.

Perfect for contemporary homes and modern lifestyles, this versatile piece adds character and cultural depth to any space. The thoughtful design ensures it complements both traditional and modern decor styles.

Invest in authentic craftsmanship that tells a story of cultural heritage meeting modern sensibilities. Each purchase supports local artisan communities and helps preserve traditional skills for future generations.`,
      premium: `Presenting an extraordinary ${storyInput.toLowerCase()} that exemplifies the pinnacle of Indian luxury craftsmanship. This exclusive piece is the result of months of dedicated work by master artisans, representing the highest standards of traditional excellence.

Crafted using the finest materials sourced from select regions known for their superior quality, every element of this ${storyInput.toLowerCase()} has been carefully chosen to ensure exceptional durability and beauty. The intricate work demonstrates techniques that have been perfected over centuries.

This limited edition piece features rare design elements and premium finishes that set it apart as a true collector's item. The attention to detail is extraordinary, with each component reflecting the artisan's mastery and artistic vision.

An investment in timeless beauty and cultural heritage, this ${storyInput.toLowerCase()} is perfect for discerning collectors who appreciate the finest examples of Indian craftsmanship. Certificate of authenticity and artisan provenance included.`
    }
    
    setGeneratedStory(stories[storyTone as keyof typeof stories] || stories.traditional)
    setIsGeneratingStory(false)
  }

  const startVoiceInput = () => {
    setIsListening(true)
    // Simulate voice recognition
    setTimeout(() => {
      setStoryInput('Handwoven Banarasi Silk Saree with gold zari work')
      setIsListening(false)
    }, 3000)
  }

  const generateKeywords = async () => {
    if (!productTitle.trim()) return
    
    // Simulate keyword generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const keywords = [
      'handmade', 'traditional', 'authentic', 'indian crafts', 'artisan made',
      'heritage', 'cultural', 'premium quality', 'handwoven', 'sustainable',
      'unique design', 'limited edition', 'handcrafted', 'ethnic wear',
      'traditional art', 'indigenous craft'
    ]
    
    setGeneratedKeywords(keywords.slice(0, 8))
    setSeoScore(85)
  }

  const translateText = async () => {
    if (!translationText.trim()) return
    
    // Simulate translation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const translations = {
      hi: 'यह एक अनूठा हस्तशिल्प उत्पाद है जो पारंपरिक भारतीय कला का प्रतिनिधित्व करता है।',
      ta: 'இது பாரம்பரிய இந்திய கலையை பிரதிநிதித்துவப்படுத்தும் ஒரு தனித்துவமான கைவினை தயாரிப்பு ஆகும்.',
      bn: 'এটি একটি অনন্য হস্তশিল্প পণ্য যা ঐতিহ্যবাহী ভারতীয় শিল্পের প্রতিনিধিত্ব করে।',
      te: 'ఇది సాంప్రదాయిక భారతీయ కళను సూచించే ఒక ప్రత్యేకమైన చేతిపని ఉత్పత్తి.',
      ml: 'പരമ്പരാഗത ഇന്ത്യൻ കലയെ പ്രതിനിധീകരിക്കുന്ന ഒരു സവിശേഷ കൈകരകൗശല ഉൽപ്പന്നമാണിത്.'
    }
    
    setTranslatedText(translations[targetLanguage as keyof typeof translations] || translationText)
  }

  const sampleImages = [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1583846112692-b38c13a6ac0b?w=300&h=300&fit=crop'
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
              AI-Powered Tools
            </h1>
            <p className="text-muted-foreground">
              Enhance your craft business with advanced AI assistance
            </p>
          </div>
        </div>

        {/* AI Tools Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-secondary/40 border border-primary/10">
            <TabsTrigger value="photo-enhance" className="data-[state=active]:bg-card text-xs md:text-sm">
              <Camera className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Photo Enhance</span>
            </TabsTrigger>
            <TabsTrigger value="story-gen" className="data-[state=active]:bg-card text-xs md:text-sm">
              <Bot className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Story Gen</span>
            </TabsTrigger>
            <TabsTrigger value="voice-tools" className="data-[state=active]:bg-card text-xs md:text-sm">
              <Volume2 className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Voice Tools</span>
            </TabsTrigger>
            <TabsTrigger value="seo-optimize" className="data-[state=active]:bg-card text-xs md:text-sm">
              <Target className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">SEO</span>
            </TabsTrigger>
            <TabsTrigger value="translate" className="data-[state=active]:bg-card text-xs md:text-sm">
              <Languages className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Translate</span>
            </TabsTrigger>
          </TabsList>

          {/* Photo Enhancement Tab */}
          <TabsContent value="photo-enhance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload and Preview */}
              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="h-5 w-5 mr-2 text-primary" />
                    Photo Enhancement
                  </CardTitle>
                  <CardDescription>
                    Upload your product photos and enhance them with AI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!selectedImage ? (
                    <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center">
                      <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                          <Upload className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Upload a photo to enhance</p>
                          <p className="text-sm text-muted-foreground">
                            Drag and drop or click to select
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button asChild>
                          <label htmlFor="image-upload" className="cursor-pointer">
                            Choose Image
                          </label>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <img
                          src={selectedImage}
                          alt="Selected product"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        {enhancementProgress > 0 && enhancementProgress < 100 && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                            <div className="text-center text-white">
                              <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin" />
                              <p className="font-medium">Enhancing...</p>
                              <div className="w-32 bg-white/20 rounded-full h-2 mt-2">
                                <div 
                                  className="bg-white h-2 rounded-full transition-all"
                                  style={{ width: `${enhancementProgress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          onClick={enhancePhoto}
                          disabled={isEnhancing}
                          className="flex-1"
                        >
                          <Wand2 className="h-4 w-4 mr-2" />
                          Enhance Photo
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setSelectedImage('')
                            setEnhancementProgress(0)
                          }}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Sample Images */}
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Try with sample images:</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {sampleImages.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Sample ${index + 1}`}
                          className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setSelectedImage(image)}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhancement Controls */}
              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-primary" />
                    Enhancement Settings
                  </CardTitle>
                  <CardDescription>
                    Fine-tune your photo enhancement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Brightness</label>
                      <Slider
                        value={enhancementSettings.brightness}
                        onValueChange={(value) => setEnhancementSettings(prev => ({ ...prev, brightness: value }))}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Contrast</label>
                      <Slider
                        value={enhancementSettings.contrast}
                        onValueChange={(value) => setEnhancementSettings(prev => ({ ...prev, contrast: value }))}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Saturation</label>
                      <Slider
                        value={enhancementSettings.saturation}
                        onValueChange={(value) => setEnhancementSettings(prev => ({ ...prev, saturation: value }))}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Sharpness</label>
                      <Slider
                        value={enhancementSettings.sharpness}
                        onValueChange={(value) => setEnhancementSettings(prev => ({ ...prev, sharpness: value }))}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Enhancement Features:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Auto lighting optimization</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Background noise reduction</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Color enhancement</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Detail sharpening</span>
                      </div>
                    </div>
                  </div>

                  {enhancementProgress === 100 && (
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Enhanced Image
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Story Generation Tab */}
          <TabsContent value="story-gen" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bot className="h-5 w-5 mr-2 text-primary" />
                      AI Story Generator
                    </CardTitle>
                    <CardDescription>
                      Create compelling product descriptions using advanced AI
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
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Language</label>
                          <Select value={storyLanguage} onValueChange={setStoryLanguage}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="hi">Hindi</SelectItem>
                              <SelectItem value="bn">Bengali</SelectItem>
                              <SelectItem value="ta">Tamil</SelectItem>
                              <SelectItem value="te">Telugu</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Story Tone</label>
                          <Select value={storyTone} onValueChange={setStoryTone}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="traditional">Traditional</SelectItem>
                              <SelectItem value="modern">Modern</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button 
                        onClick={generateStory}
                        disabled={!storyInput.trim() || isGeneratingStory}
                        className="w-full shadow-sm"
                      >
                        {isGeneratingStory ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Wand2 className="h-4 w-4 mr-2" />
                        )}
                        Generate Story
                      </Button>

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
                                <Copy className="h-4 w-4 mr-1" />
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
                          <div className="p-4 bg-secondary/20 rounded-lg border max-h-64 overflow-y-auto">
                            <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">
                              {generatedStory}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Story Templates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-secondary/20 rounded cursor-pointer hover:bg-secondary/30 transition-colors"
                         onClick={() => setStoryInput('Traditional handwoven textile')}>
                      <h4 className="font-medium text-sm">Traditional Craft</h4>
                      <p className="text-xs text-muted-foreground">Heritage and culture focus</p>
                    </div>
                    <div className="p-3 bg-secondary/20 rounded cursor-pointer hover:bg-secondary/30 transition-colors"
                         onClick={() => setStoryInput('Eco-friendly sustainable product')}>
                      <h4 className="font-medium text-sm">Eco-Friendly</h4>
                      <p className="text-xs text-muted-foreground">Sustainability angle</p>
                    </div>
                    <div className="p-3 bg-secondary/20 rounded cursor-pointer hover:bg-secondary/30 transition-colors"
                         onClick={() => setStoryInput('Premium handcrafted jewelry')}>
                      <h4 className="font-medium text-sm">Luxury Item</h4>
                      <p className="text-xs text-muted-foreground">Premium positioning</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Stories Generated</span>
                      <Badge variant="secondary">24</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg. Engagement</span>
                      <Badge variant="secondary">+127%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Languages</span>
                      <Badge variant="secondary">5</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Voice Tools Tab */}
          <TabsContent value="voice-tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Volume2 className="h-5 w-5 mr-2 text-primary" />
                    Voice Assistant
                  </CardTitle>
                  <CardDescription>
                    Control your dashboard with voice commands
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center transition-all ${
                      isVoiceActive ? 'bg-red-500 animate-pulse' : 'bg-primary'
                    }`}>
                      {isVoiceActive ? (
                        <Volume2 className="h-10 w-10 text-white" />
                      ) : (
                        <Mic className="h-10 w-10 text-primary-foreground" />
                      )}
                    </div>
                    <h3 className="font-semibold mb-2">
                      {isVoiceActive ? 'Listening...' : 'Voice Commands'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {isVoiceActive ? 'Say a command' : 'Click to start voice control'}
                    </p>
                    <Button 
                      className="w-full"
                      onClick={() => setIsVoiceActive(!isVoiceActive)}
                    >
                      {isVoiceActive ? 'Stop Listening' : 'Start Listening'}
                    </Button>
                  </div>

                  {voiceCommand && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">Command: "{voiceCommand}"</p>
                      <p className="text-xs text-blue-700 mt-1">Processing...</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardHeader>
                  <CardTitle>Available Commands</CardTitle>
                  <CardDescription>Try these voice commands</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-secondary/20 rounded">
                    <strong className="text-sm">"Add new product"</strong>
                    <p className="text-xs text-muted-foreground">Opens product creation</p>
                  </div>
                  <div className="p-3 bg-secondary/20 rounded">
                    <strong className="text-sm">"Check my sales"</strong>
                    <p className="text-xs text-muted-foreground">Shows analytics dashboard</p>
                  </div>
                  <div className="p-3 bg-secondary/20 rounded">
                    <strong className="text-sm">"Generate story"</strong>
                    <p className="text-xs text-muted-foreground">Opens AI story generator</p>
                  </div>
                  <div className="p-3 bg-secondary/20 rounded">
                    <strong className="text-sm">"Show my products"</strong>
                    <p className="text-xs text-muted-foreground">Lists all products</p>
                  </div>
                  <div className="p-3 bg-secondary/20 rounded">
                    <strong className="text-sm">"Enhance photos"</strong>
                    <p className="text-xs text-muted-foreground">Opens photo enhancement</p>
                  </div>
                  <div className="p-3 bg-secondary/20 rounded">
                    <strong className="text-sm">"Check messages"</strong>
                    <p className="text-xs text-muted-foreground">Opens message center</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* SEO Optimization Tab */}
          <TabsContent value="seo-optimize" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-primary" />
                    SEO Optimization
                  </CardTitle>
                  <CardDescription>
                    Optimize your product listings for better visibility
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Product Title</label>
                      <Input
                        placeholder="Enter your product title"
                        value={productTitle}
                        onChange={(e) => setProductTitle(e.target.value)}
                        className="bg-input-background border-primary/20 focus:border-primary/40"
                      />
                    </div>
                    
                    <Button 
                      onClick={generateKeywords}
                      disabled={!productTitle.trim()}
                      className="w-full"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Generate SEO Keywords
                    </Button>

                    {generatedKeywords.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium">Generated Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {generatedKeywords.map((keyword, index) => (
                            <Badge key={index} variant="outline" className="cursor-pointer">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {seoScore > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">SEO Score</h4>
                          <Badge variant={seoScore >= 80 ? 'default' : seoScore >= 60 ? 'secondary' : 'destructive'}>
                            {seoScore}/100
                          </Badge>
                        </div>
                        <Progress value={seoScore} className="h-2" />
                        <div className="text-sm text-muted-foreground">
                          {seoScore >= 80 ? 'Excellent SEO optimization!' : 
                           seoScore >= 60 ? 'Good, but can be improved' : 
                           'Needs improvement'}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardHeader>
                  <CardTitle>SEO Tips</CardTitle>
                  <CardDescription>Improve your product visibility</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Use descriptive titles</h4>
                        <p className="text-xs text-muted-foreground">Include material, technique, and origin</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Add relevant keywords</h4>
                        <p className="text-xs text-muted-foreground">Include craft type and style terms</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Use local terms</h4>
                        <p className="text-xs text-muted-foreground">Include regional craft names</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Add quality indicators</h4>
                        <p className="text-xs text-muted-foreground">Terms like "handmade", "authentic"</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Trending Keywords</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>sustainable crafts</span>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex justify-between">
                        <span>eco-friendly</span>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex justify-between">
                        <span>traditional art</span>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Translation Tab */}
          <TabsContent value="translate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Languages className="h-5 w-5 mr-2 text-primary" />
                    Multi-Language Translation
                  </CardTitle>
                  <CardDescription>
                    Translate your product descriptions to reach more customers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Text to Translate</label>
                      <Textarea
                        placeholder="Enter your product description in English..."
                        value={translationText}
                        onChange={(e) => setTranslationText(e.target.value)}
                        className="bg-input-background border-primary/20 focus:border-primary/40 min-h-24"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Target Language</label>
                      <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hi">Hindi (हिंदी)</SelectItem>
                          <SelectItem value="bn">Bengali (বাংলা)</SelectItem>
                          <SelectItem value="ta">Tamil (தமிழ்)</SelectItem>
                          <SelectItem value="te">Telugu (తెలుగు)</SelectItem>
                          <SelectItem value="ml">Malayalam (മലയാളം)</SelectItem>
                          <SelectItem value="gu">Gujarati (ગુજરાતી)</SelectItem>
                          <SelectItem value="mr">Marathi (मराठी)</SelectItem>
                          <SelectItem value="pa">Punjabi (ਪੰਜਾਬੀ)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={translateText}
                      disabled={!translationText.trim()}
                      className="w-full"
                    >
                      <Languages className="h-4 w-4 mr-2" />
                      Translate Text
                    </Button>

                    {translatedText && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Translation</h4>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(translatedText)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <div className="p-4 bg-secondary/20 rounded-lg border">
                          <p className="text-sm">{translatedText}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardHeader>
                  <CardTitle>Translation Stats</CardTitle>
                  <CardDescription>Your multilingual reach</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Languages Supported</span>
                      <Badge variant="secondary">8</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Products Translated</span>
                      <Badge variant="secondary">12</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Multi-lingual Views</span>
                      <Badge variant="secondary">+245%</Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Popular Language Pairs</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>English → Hindi</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={85} className="w-16 h-1" />
                          <span className="text-xs text-muted-foreground">85%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>English → Bengali</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={72} className="w-16 h-1" />
                          <span className="text-xs text-muted-foreground">72%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>English → Tamil</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={68} className="w-16 h-1" />
                          <span className="text-xs text-muted-foreground">68%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Quick Translate</h4>
                    <p className="text-xs text-muted-foreground mb-3">Common craft terms</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-secondary/20 rounded">
                        <div>Handmade</div>
                        <div className="text-muted-foreground">हस्तनिर्मित</div>
                      </div>
                      <div className="p-2 bg-secondary/20 rounded">
                        <div>Traditional</div>
                        <div className="text-muted-foreground">पारंपरिक</div>
                      </div>
                      <div className="p-2 bg-secondary/20 rounded">
                        <div>Authentic</div>
                        <div className="text-muted-foreground">प्रामाणिक</div>
                      </div>
                      <div className="p-2 bg-secondary/20 rounded">
                        <div>Artisan</div>
                        <div className="text-muted-foreground">शिल्पकार</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  )
}