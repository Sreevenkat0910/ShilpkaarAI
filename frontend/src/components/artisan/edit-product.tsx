import { useState, useEffect } from 'react'
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
import { apiCall, ApiError } from '../../utils/api'

interface ProductImage {
  id: string
  file?: File
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

export default function EditProduct() {
  const { navigate, goBack, router } = useRouter()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [images, setImages] = useState<ProductImage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
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

  // Mock product data - in real app, this would come from API
  const mockProduct = {
    id: '1',
    name: 'Handwoven Banarasi Silk Saree',
    description: 'Traditional gold zari work on pure silk with intricate floral patterns',
    price: 12500,
    originalPrice: 15000,
    category: 'textiles',
    subcategory: 'Sarees',
    materials: 'Pure Silk, Zari Thread, Gold Thread',
    dimensions: '5.5m x 1.1m',
    weight: '800g',
    stock: 3,
    sku: 'SPK-SAR-001',
    tags: 'silk, handwoven, traditional, zari',
    customization: true,
    customizationDetails: 'Available in different colors and sizes',
    shippingWeight: '1kg',
    shippingDimensions: '30cm x 30cm x 5cm',
    craftStory: 'This saree is handwoven by skilled artisans in Varanasi using traditional techniques passed down through generations.',
    careInstructions: 'Dry clean only. Store in a cool, dry place.',
    images: [
      'https://images.unsplash.com/photo-1632726733402-4a059a476028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB0ZXh0aWxlcyUyMHdlYXZpbmclMjBhcnRpc2FufGVufDF8fHx8MTc1ODM2NjIwMnww&ixlib=rb-4.1.0&q=80&w=300'
    ]
  }

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

  // Load product data on component mount
  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true)
      try {
        const productId = router.params.id
        
        if (!productId) {
          throw new Error('Product ID is required')
        }
        
        // Fetch product data from API
        const response = await apiCall(`/products/one?id=${productId}`)
        const product = response.data.product
        
        // Set product data
        setProductData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          originalPrice: product.originalPrice?.toString() || '',
          category: product.category,
          subcategory: product.subcategory || '',
          materials: product.materials?.join(', ') || '',
          dimensions: product.dimensions || '',
          weight: product.weight?.toString() || '',
          stock: product.stock?.toString() || '0',
          sku: product.sku || '',
          tags: product.tags?.join(', ') || '',
          customization: product.customization || false,
          customizationDetails: product.customizationDetails || '',
          shippingWeight: product.shippingWeight || '',
          shippingDimensions: product.shippingDimensions || '',
          craftStory: product.craftStory || '',
          careInstructions: product.careInstructions || ''
        })

        // Set existing images
        const existingImages: ProductImage[] = product.images.map((url: string, index: number) => ({
          id: `existing-${index}`,
          preview: url,
          isEnhanced: false,
          enhancementStatus: 'completed' as const,
          enhancements: {
            backgroundRemoval: false,
            lightingImprovement: false,
            colorEnhancement: false,
            sharpening: false
          }
        }))
        setImages(existingImages)
        
      } catch (error) {
        console.error('Error loading product:', error)
        alert('Failed to load product data. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [router.params.id])

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
      }
    })
  }

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setProductData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsProcessing(true)
    try {
      const productId = router.params.id
      
      if (!productId) {
        throw new Error('Product ID is required')
      }

      // Prepare data for API
      const updateData = {
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : undefined,
        category: productData.category,
        subcategory: productData.subcategory,
        materials: productData.materials ? productData.materials.split(',').map(m => m.trim()) : [],
        dimensions: productData.dimensions,
        weight: productData.weight ? parseFloat(productData.weight) : undefined,
        stock: parseInt(productData.stock),
        sku: productData.sku,
        tags: productData.tags ? productData.tags.split(',').map(t => t.trim()) : [],
        customization: productData.customization,
        customizationDetails: productData.customizationDetails,
        shippingWeight: productData.shippingWeight,
        shippingDimensions: productData.shippingDimensions,
        craftStory: productData.craftStory,
        careInstructions: productData.careInstructions,
        // Keep existing images for now (in real app, you'd handle image uploads)
        images: images.map(img => img.preview)
      }

      await apiCall(`/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      })
      
      alert('Product updated successfully!')
      navigate('artisan-products')
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Failed to save product. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePublish = async () => {
    setIsProcessing(true)
    try {
      const productId = router.params.id
      
      if (!productId) {
        throw new Error('Product ID is required')
      }

      // Prepare data for API
      const updateData = {
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : undefined,
        category: productData.category,
        subcategory: productData.subcategory,
        materials: productData.materials ? productData.materials.split(',').map(m => m.trim()) : [],
        dimensions: productData.dimensions,
        weight: productData.weight ? parseFloat(productData.weight) : undefined,
        stock: parseInt(productData.stock),
        sku: productData.sku,
        tags: productData.tags ? productData.tags.split(',').map(t => t.trim()) : [],
        customization: productData.customization,
        customizationDetails: productData.customizationDetails,
        shippingWeight: productData.shippingWeight,
        shippingDimensions: productData.shippingDimensions,
        craftStory: productData.craftStory,
        careInstructions: productData.careInstructions,
        isActive: true, // Publish the product
        images: images.map(img => img.preview)
      }

      await apiCall(`/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      })
      
      alert('Product published successfully!')
      navigate('artisan-products')
    } catch (error) {
      console.error('Error publishing product:', error)
      alert('Failed to publish product. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 botanical-pattern">
        <NavigationHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading product data...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 botanical-pattern">
      <NavigationHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={goBack} className="bg-card/60 border-primary/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl" style={{ fontFamily: 'Playfair Display, serif' }}>
                Edit Product
              </h1>
              <p className="text-muted-foreground">
                Update your product information and images
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleSave}
              disabled={isProcessing}
              className="bg-card/60 border-primary/20"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button 
              onClick={handlePublish}
              disabled={isProcessing}
              className="shadow-sm"
            >
              {isProcessing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Update Product
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={currentStep.toString()} onValueChange={(value) => setCurrentStep(parseInt(value))}>
              <TabsList className="grid w-full grid-cols-4 bg-secondary/40 border border-primary/10">
                <TabsTrigger value="1" className="data-[state=active]:bg-card">Basic Info</TabsTrigger>
                <TabsTrigger value="2" className="data-[state=active]:bg-card">Images</TabsTrigger>
                <TabsTrigger value="3" className="data-[state=active]:bg-card">Details</TabsTrigger>
                <TabsTrigger value="4" className="data-[state=active]:bg-card">Shipping</TabsTrigger>
              </TabsList>

              {/* Step 1: Basic Information */}
              <TabsContent value="1" className="mt-6">
                <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Provide the essential details about your product
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Product Name *</Label>
                        <Input
                          id="name"
                          value={productData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter product name"
                          className="bg-input-background border-primary/20 focus:border-primary/40"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sku">SKU</Label>
                        <Input
                          id="sku"
                          value={productData.sku}
                          onChange={(e) => handleInputChange('sku', e.target.value)}
                          placeholder="Product SKU"
                          className="bg-input-background border-primary/20 focus:border-primary/40"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={productData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe your product in detail"
                        rows={4}
                        className="bg-input-background border-primary/20 focus:border-primary/40"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select value={productData.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger className="bg-input-background border-primary/20 focus:border-primary/40">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subcategory">Subcategory</Label>
                        <Select value={productData.subcategory} onValueChange={(value) => handleInputChange('subcategory', value)}>
                          <SelectTrigger className="bg-input-background border-primary/20 focus:border-primary/40">
                            <SelectValue placeholder="Select subcategory" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedCategory?.subcategories.map(sub => (
                              <SelectItem key={sub} value={sub}>
                                {sub}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (₹) *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={productData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          placeholder="0"
                          className="bg-input-background border-primary/20 focus:border-primary/40"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="originalPrice">Original Price (₹)</Label>
                        <Input
                          id="originalPrice"
                          type="number"
                          value={productData.originalPrice}
                          onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                          placeholder="0"
                          className="bg-input-background border-primary/20 focus:border-primary/40"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        id="tags"
                        value={productData.tags}
                        onChange={(e) => handleInputChange('tags', e.target.value)}
                        placeholder="Enter tags separated by commas"
                        className="bg-input-background border-primary/20 focus:border-primary/40"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Step 2: Images */}
              <TabsContent value="2" className="mt-6">
                <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                  <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                    <CardDescription>
                      Upload high-quality images of your product
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Upload Area */}
                      <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center">
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-semibold mb-2">Upload Product Images</h3>
                        <p className="text-muted-foreground mb-4">
                          Drag and drop images here, or click to browse
                        </p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e.target.files)}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button asChild>
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <Camera className="h-4 w-4 mr-2" />
                            Choose Images
                          </label>
                        </Button>
                      </div>

                      {/* Image Grid */}
                      {images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {images.map((image) => (
                            <div key={image.id} className="relative group">
                              <ImageWithFallback
                                src={image.preview}
                                alt="Product"
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(image.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Step 3: Additional Details */}
              <TabsContent value="3" className="mt-6">
                <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                  <CardHeader>
                    <CardTitle>Additional Details</CardTitle>
                    <CardDescription>
                      Provide more information about your product
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="materials">Materials Used</Label>
                        <Input
                          id="materials"
                          value={productData.materials}
                          onChange={(e) => handleInputChange('materials', e.target.value)}
                          placeholder="e.g., Pure Silk, Zari Thread"
                          className="bg-input-background border-primary/20 focus:border-primary/40"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dimensions">Dimensions</Label>
                        <Input
                          id="dimensions"
                          value={productData.dimensions}
                          onChange={(e) => handleInputChange('dimensions', e.target.value)}
                          placeholder="e.g., 5.5m x 1.1m"
                          className="bg-input-background border-primary/20 focus:border-primary/40"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight</Label>
                        <Input
                          id="weight"
                          value={productData.weight}
                          onChange={(e) => handleInputChange('weight', e.target.value)}
                          placeholder="e.g., 800g"
                          className="bg-input-background border-primary/20 focus:border-primary/40"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock">Stock Quantity</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={productData.stock}
                          onChange={(e) => handleInputChange('stock', e.target.value)}
                          placeholder="0"
                          className="bg-input-background border-primary/20 focus:border-primary/40"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="customization"
                          checked={productData.customization}
                          onCheckedChange={(checked) => handleInputChange('customization', checked)}
                        />
                        <Label htmlFor="customization">Allow Customization</Label>
                      </div>
                      
                      {productData.customization && (
                        <div className="space-y-2">
                          <Label htmlFor="customizationDetails">Customization Details</Label>
                          <Textarea
                            id="customizationDetails"
                            value={productData.customizationDetails}
                            onChange={(e) => handleInputChange('customizationDetails', e.target.value)}
                            placeholder="Describe what customizations are available"
                            rows={3}
                            className="bg-input-background border-primary/20 focus:border-primary/40"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="craftStory">Craft Story</Label>
                      <Textarea
                        id="craftStory"
                        value={productData.craftStory}
                        onChange={(e) => handleInputChange('craftStory', e.target.value)}
                        placeholder="Tell the story behind your craft"
                        rows={4}
                        className="bg-input-background border-primary/20 focus:border-primary/40"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="careInstructions">Care Instructions</Label>
                      <Textarea
                        id="careInstructions"
                        value={productData.careInstructions}
                        onChange={(e) => handleInputChange('careInstructions', e.target.value)}
                        placeholder="How should customers care for this product?"
                        rows={3}
                        className="bg-input-background border-primary/20 focus:border-primary/40"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Step 4: Shipping */}
              <TabsContent value="4" className="mt-6">
                <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                    <CardDescription>
                      Set up shipping details for your product
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="shippingWeight">Shipping Weight</Label>
                        <Input
                          id="shippingWeight"
                          value={productData.shippingWeight}
                          onChange={(e) => handleInputChange('shippingWeight', e.target.value)}
                          placeholder="e.g., 1kg"
                          className="bg-input-background border-primary/20 focus:border-primary/40"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shippingDimensions">Shipping Dimensions</Label>
                        <Input
                          id="shippingDimensions"
                          value={productData.shippingDimensions}
                          onChange={(e) => handleInputChange('shippingDimensions', e.target.value)}
                          placeholder="e.g., 30cm x 30cm x 5cm"
                          className="bg-input-background border-primary/20 focus:border-primary/40"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview Card */}
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {images.length > 0 && (
                    <ImageWithFallback
                      src={images[0].preview}
                      alt="Product preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{productData.name || 'Product Name'}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {productData.description || 'Product description'}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-lg font-semibold text-primary">
                        ₹{productData.price ? parseInt(productData.price).toLocaleString() : '0'}
                      </span>
                      {productData.originalPrice && parseInt(productData.originalPrice) > parseInt(productData.price) && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{parseInt(productData.originalPrice).toLocaleString()}
                        </span>
                      )}
                    </div>
                    {productData.category && (
                      <Badge variant="outline" className="mt-2 border-primary/20">
                        {categories.find(cat => cat.value === productData.category)?.label}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Enhancement */}
            <Card className="border-0 bg-gradient-to-r from-primary/5 to-accent/5 card-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">AI Enhancement</h3>
                    <p className="text-muted-foreground mb-4">
                      Enhance your product images with AI-powered tools
                    </p>
                    <Button variant="outline" size="sm" onClick={() => navigate('artisan-ai-tools')}>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Enhance Images
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
