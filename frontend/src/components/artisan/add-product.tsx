import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'
import { Switch } from '../ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { 
  Upload, 
  ArrowLeft, 
  Camera, 
  Sparkles,
  Check,
  X,
  Eye,
  Save,
  Send,
  AlertCircle,
  Wand2,
  Image as ImageIcon,
  RefreshCw,
  Download,
  Zap,
  Palette,
  Sun,
  Crop
} from 'lucide-react'
import { useRouter } from '../router'
import { useAuth } from '../auth/auth-context'
import NavigationHeader from '../navigation-header'
import Footer from '../footer'
import { ImageWithFallback } from '../figma/ImageWithFallback'

interface ProductImage {
  id: string
  file: File
  preview: string
  isEnhanced: boolean
  originalPreview?: string
  enhancementStatus: 'pending' | 'processing' | 'completed' | 'failed'
  enhancements: {
    backgroundRemoval: boolean
    lightingImprovement: boolean
    colorEnhancement: boolean
    sharpening: boolean
  }
}

export default function AddProduct() {
  const { navigate, goBack } = useRouter()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [images, setImages] = useState<ProductImage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    subcategory: '',
    materials: '',
    dimensions: '',
    weight: '',
    stock: '',
    sku: '',
    tags: '',
    customization: false,
    customizationDetails: '',
    shippingWeight: '',
    shippingDimensions: '',
    craftStory: '',
    careInstructions: ''
  })

  const categories = [
    { value: 'textiles', label: 'Textiles & Fabrics', subcategories: ['Sarees', 'Scarves', 'Fabrics', 'Clothing'] },
    { value: 'jewelry', label: 'Jewelry & Accessories', subcategories: ['Necklaces', 'Earrings', 'Bracelets', 'Rings'] },
    { value: 'pottery', label: 'Pottery & Ceramics', subcategories: ['Vases', 'Bowls', 'Decorative Items', 'Kitchenware'] },
    { value: 'woodwork', label: 'Wood Crafts', subcategories: ['Furniture', 'Decorative Items', 'Toys', 'Kitchenware'] },
    { value: 'metalwork', label: 'Metal Crafts', subcategories: ['Brass Items', 'Copper Items', 'Iron Crafts', 'Silver Items'] },
    { value: 'paintings', label: 'Paintings & Art', subcategories: ['Canvas Paintings', 'Wall Art', 'Miniatures', 'Folk Art'] },
    { value: 'home-decor', label: 'Home Decor', subcategories: ['Cushions', 'Curtains', 'Lamps', 'Mirrors'] }
  ]

  const selectedCategory = categories.find(cat => cat.value === productData.category)

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const preview = URL.createObjectURL(file)
        const newImage: ProductImage = {
          id: Date.now().toString() + Math.random(),
          file,
          preview,
          isEnhanced: false,
          enhancementStatus: 'pending',
          enhancements: {
            backgroundRemoval: false,
            lightingImprovement: false,
            colorEnhancement: false,
            sharpening: false
          }
        }
        
        setImages(prev => [...prev, newImage])
        
        // Auto-enhance after upload
        setTimeout(() => enhanceImage(newImage.id), 1000)
      }
    })
  }

  const enhanceImage = async (imageId: string) => {
    setImages(prev => prev.map(img => 
      img.id === imageId 
        ? { ...img, enhancementStatus: 'processing' }
        : img
    ))

    // Simulate AI enhancement process
    await new Promise(resolve => setTimeout(resolve, 3000))

    setImages(prev => prev.map(img => {
      if (img.id === imageId) {
        // In a real app, this would be the enhanced image URL from the AI service
        const enhancedPreview = img.preview // For demo, using same image
        
        return {
          ...img,
          isEnhanced: true,
          originalPreview: img.preview,
          preview: enhancedPreview,
          enhancementStatus: 'completed',
          enhancements: {
            backgroundRemoval: true,
            lightingImprovement: true,
            colorEnhancement: true,
            sharpening: true
          }
        }
      }
      return img
    }))
  }

  const toggleEnhancement = (imageId: string, enhancement: keyof ProductImage['enhancements']) => {
    setImages(prev => prev.map(img => 
      img.id === imageId 
        ? { 
            ...img, 
            enhancements: { 
              ...img.enhancements, 
              [enhancement]: !img.enhancements[enhancement] 
            }
          }
        : img
    ))
  }

  const removeImage = (imageId: string) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== imageId)
      // Clean up URL objects
      const imageToRemove = prev.find(img => img.id === imageId)
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview)
        if (imageToRemove.originalPreview) {
          URL.revokeObjectURL(imageToRemove.originalPreview)
        }
      }
      return updated
    })
  }

  const handleSaveProduct = async (status: 'draft' | 'active') => {
    setIsProcessing(true)
    
    // Simulate save process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsProcessing(false)
    navigate('artisan-products')
  }

  const generateAIDescription = async () => {
    if (!productData.name || !productData.category) return

    setIsProcessing(true)
    
    // Simulate AI description generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const aiDescription = `This exquisite ${productData.name.toLowerCase()} represents the finest traditions of Indian craftsmanship. Handcrafted with meticulous attention to detail, each piece tells a story of heritage and artistry passed down through generations. The intricate work showcases the skilled techniques that make this a truly unique and authentic piece.

Perfect for those who appreciate traditional artistry with contemporary appeal, this ${productData.category} piece combines cultural significance with modern aesthetics. Each item is carefully created using time-honored methods, ensuring both beauty and durability.

Whether as a personal treasure or a meaningful gift, this handcrafted piece brings the warmth and richness of Indian culture into your life.`

    setProductData(prev => ({ ...prev, description: aiDescription }))
    setIsProcessing(false)
  }

  const steps = [
    { id: 1, title: 'Basic Info', icon: AlertCircle },
    { id: 2, title: 'Photos & AI Enhancement', icon: Camera },
    { id: 3, title: 'Details & Pricing', icon: Save },
    { id: 4, title: 'Review & Publish', icon: Eye }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 botanical-pattern">
      <NavigationHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="icon" onClick={goBack} className="hover:bg-card/60">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl" style={{ fontFamily: 'Playfair Display, serif' }}>
              Add New Product
            </h1>
            <p className="text-muted-foreground">
              Create a new product listing with AI-enhanced photos
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Progress</h3>
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of {steps.length}
              </span>
            </div>
            
            <div className="flex justify-between">
              {steps.map((step) => {
                const Icon = step.icon
                const isCompleted = currentStep > step.id
                const isCurrent = currentStep === step.id
                
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isCompleted 
                        ? 'bg-green-100 text-green-600' 
                        : isCurrent 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-muted-foreground'
                    }`}>
                      {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <p className="text-xs text-center font-medium max-w-20">
                      {step.title}
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="max-w-4xl mx-auto">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Playfair Display, serif' }}>
                  Basic Product Information
                </CardTitle>
                <CardDescription>
                  Start with the essential details about your product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Handwoven Banarasi Silk Saree"
                    value={productData.name}
                    onChange={(e) => setProductData({...productData, name: e.target.value})}
                    className="bg-input-background border-primary/20 focus:border-primary/40"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={productData.category} onValueChange={(value) => setProductData({...productData, category: value, subcategory: ''})}>
                      <SelectTrigger className="bg-input-background border-primary/20 focus:border-primary/40">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedCategory && (
                    <div className="space-y-2">
                      <Label htmlFor="subcategory">Subcategory</Label>
                      <Select value={productData.subcategory} onValueChange={(value) => setProductData({...productData, subcategory: value})}>
                        <SelectTrigger className="bg-input-background border-primary/20 focus:border-primary/40">
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedCategory.subcategories.map((sub) => (
                            <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="description">Product Description</Label>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={generateAIDescription}
                      disabled={!productData.name || !productData.category || isProcessing}
                      className="bg-card/60 border-primary/20"
                    >
                      {isProcessing ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      AI Generate
                    </Button>
                  </div>
                  <Textarea
                    id="description"
                    placeholder="Describe your product in detail..."
                    value={productData.description}
                    onChange={(e) => setProductData({...productData, description: e.target.value})}
                    className="bg-input-background border-primary/20 focus:border-primary/40 min-h-32"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="craftStory">Craft Story (Optional)</Label>
                  <Textarea
                    id="craftStory"
                    placeholder="Tell the story behind your craft, techniques used, inspiration..."
                    value={productData.craftStory}
                    onChange={(e) => setProductData({...productData, craftStory: e.target.value})}
                    className="bg-input-background border-primary/20 focus:border-primary/40"
                  />
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => setCurrentStep(2)}
                    disabled={!productData.name || !productData.category}
                  >
                    Next: Add Photos
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Photos & AI Enhancement */}
          {currentStep === 2 && (
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center" style={{ fontFamily: 'Playfair Display, serif' }}>
                  <Camera className="h-5 w-5 mr-2" />
                  Product Photos & AI Enhancement
                </CardTitle>
                <CardDescription>
                  Upload photos and let our AI automatically enhance them for better sales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-primary/20 rounded-xl p-8 text-center hover:border-primary/40 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Upload Product Photos</h3>
                    <p className="text-muted-foreground mb-4">
                      Drag and drop your images here, or click to browse
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                        Auto Enhancement
                      </div>
                      <div className="flex items-center">
                        <Palette className="h-4 w-4 mr-1 text-blue-500" />
                        Background Removal
                      </div>
                      <div className="flex items-center">
                        <Sun className="h-4 w-4 mr-1 text-orange-500" />
                        Lighting Fix
                      </div>
                    </div>
                  </label>
                </div>

                {/* Image Grid */}
                {images.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {images.map((image) => (
                      <Card key={image.id} className="border-0 bg-card/40 backdrop-blur-sm card-shadow">
                        <CardContent className="p-4">
                          <div className="relative mb-4">
                            <ImageWithFallback
                              src={image.preview}
                              alt="Product"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            
                            {/* Enhancement Status */}
                            <div className="absolute top-3 left-3">
                              {image.enhancementStatus === 'processing' && (
                                <Badge className="bg-yellow-100 text-yellow-700 border-0">
                                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                  Enhancing...
                                </Badge>
                              )}
                              {image.enhancementStatus === 'completed' && (
                                <Badge className="bg-green-100 text-green-700 border-0">
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  Enhanced
                                </Badge>
                              )}
                            </div>

                            {/* Remove Button */}
                            <div className="absolute top-3 right-3">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => removeImage(image.id)}
                                className="bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Enhancement Controls */}
                          {image.enhancementStatus === 'completed' && (
                            <div className="space-y-3">
                              <h4 className="font-medium">AI Enhancements Applied</h4>
                              
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center justify-between p-2 bg-secondary/20 rounded-lg">
                                  <div className="flex items-center">
                                    <Crop className="h-4 w-4 mr-2 text-primary" />
                                    <span className="text-sm">Background</span>
                                  </div>
                                  <Switch
                                    checked={image.enhancements.backgroundRemoval}
                                    onCheckedChange={() => toggleEnhancement(image.id, 'backgroundRemoval')}
                                  />
                                </div>
                                
                                <div className="flex items-center justify-between p-2 bg-secondary/20 rounded-lg">
                                  <div className="flex items-center">
                                    <Sun className="h-4 w-4 mr-2 text-primary" />
                                    <span className="text-sm">Lighting</span>
                                  </div>
                                  <Switch
                                    checked={image.enhancements.lightingImprovement}
                                    onCheckedChange={() => toggleEnhancement(image.id, 'lightingImprovement')}
                                  />
                                </div>
                                
                                <div className="flex items-center justify-between p-2 bg-secondary/20 rounded-lg">
                                  <div className="flex items-center">
                                    <Palette className="h-4 w-4 mr-2 text-primary" />
                                    <span className="text-sm">Colors</span>
                                  </div>
                                  <Switch
                                    checked={image.enhancements.colorEnhancement}
                                    onCheckedChange={() => toggleEnhancement(image.id, 'colorEnhancement')}
                                  />
                                </div>
                                
                                <div className="flex items-center justify-between p-2 bg-secondary/20 rounded-lg">
                                  <div className="flex items-center">
                                    <Wand2 className="h-4 w-4 mr-2 text-primary" />
                                    <span className="text-sm">Sharpness</span>
                                  </div>
                                  <Switch
                                    checked={image.enhancements.sharpening}
                                    onCheckedChange={() => toggleEnhancement(image.id, 'sharpening')}
                                  />
                                </div>
                              </div>

                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 bg-card/60 border-primary/20"
                                  onClick={() => enhanceImage(image.id)}
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Re-enhance
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-card/60 border-primary/20"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Previous
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(3)}
                    disabled={images.length === 0}
                  >
                    Next: Add Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Details & Pricing */}
          {currentStep === 3 && (
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Playfair Display, serif' }}>
                  Product Details & Pricing
                </CardTitle>
                <CardDescription>
                  Add pricing, inventory, and product specifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="2500"
                      value={productData.price}
                      onChange={(e) => setProductData({...productData, price: e.target.value})}
                      className="bg-input-background border-primary/20 focus:border-primary/40"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price (₹)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      placeholder="3000"
                      value={productData.originalPrice}
                      onChange={(e) => setProductData({...productData, originalPrice: e.target.value})}
                      className="bg-input-background border-primary/20 focus:border-primary/40"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="5"
                      value={productData.stock}
                      onChange={(e) => setProductData({...productData, stock: e.target.value})}
                      className="bg-input-background border-primary/20 focus:border-primary/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="materials">Materials Used</Label>
                    <Input
                      id="materials"
                      placeholder="Pure silk, gold zari, cotton"
                      value={productData.materials}
                      onChange={(e) => setProductData({...productData, materials: e.target.value})}
                      className="bg-input-background border-primary/20 focus:border-primary/40"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensions</Label>
                    <Input
                      id="dimensions"
                      placeholder="Length x Width x Height"
                      value={productData.dimensions}
                      onChange={(e) => setProductData({...productData, dimensions: e.target.value})}
                      className="bg-input-background border-primary/20 focus:border-primary/40"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    placeholder="handwoven, traditional, silk, banarasi"
                    value={productData.tags}
                    onChange={(e) => setProductData({...productData, tags: e.target.value})}
                    className="bg-input-background border-primary/20 focus:border-primary/40"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="customization"
                      checked={productData.customization}
                      onCheckedChange={(checked) => setProductData({...productData, customization: checked})}
                    />
                    <Label htmlFor="customization">Accept custom orders</Label>
                  </div>
                  
                  {productData.customization && (
                    <div className="space-y-2">
                      <Label htmlFor="customizationDetails">Customization Details</Label>
                      <Textarea
                        id="customizationDetails"
                        placeholder="Describe what can be customized (colors, sizes, designs, etc.)"
                        value={productData.customizationDetails}
                        onChange={(e) => setProductData({...productData, customizationDetails: e.target.value})}
                        className="bg-input-background border-primary/20 focus:border-primary/40"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="careInstructions">Care Instructions</Label>
                  <Textarea
                    id="careInstructions"
                    placeholder="How to care for and maintain this product..."
                    value={productData.careInstructions}
                    onChange={(e) => setProductData({...productData, careInstructions: e.target.value})}
                    className="bg-input-background border-primary/20 focus:border-primary/40"
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    Previous
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(4)}
                    disabled={!productData.price || !productData.stock}
                  >
                    Review Product
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Review & Publish */}
          {currentStep === 4 && (
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Playfair Display, serif' }}>
                  Review & Publish
                </CardTitle>
                <CardDescription>
                  Review your product details before publishing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Product Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Product Images</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {images.slice(0, 4).map((image) => (
                        <ImageWithFallback
                          key={image.id}
                          src={image.preview}
                          alt="Product"
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{productData.name}</h3>
                      <p className="text-muted-foreground">{productData.category}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-primary">₹{productData.price}</span>
                      {productData.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          ₹{productData.originalPrice}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {productData.description}
                    </p>
                    
                    <div className="text-sm">
                      <p><strong>Stock:</strong> {productData.stock} units</p>
                      <p><strong>Materials:</strong> {productData.materials || 'Not specified'}</p>
                      <p><strong>Customization:</strong> {productData.customization ? 'Available' : 'Not available'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(3)}>
                    Previous
                  </Button>
                  <div className="flex space-x-3">
                    <Button 
                      variant="outline"
                      onClick={() => handleSaveProduct('draft')}
                      disabled={isProcessing}
                      className="bg-card/60 border-primary/20"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save as Draft
                    </Button>
                    <Button 
                      onClick={() => handleSaveProduct('active')}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Publish Product
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}