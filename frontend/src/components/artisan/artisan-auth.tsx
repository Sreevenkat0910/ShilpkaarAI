import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { 
  Phone, 
  Mail, 
  ArrowLeft, 
  Leaf, 
  Sparkles,
  Palette,
  Award,
  TrendingUp,
  Upload
} from 'lucide-react'
import { useRouter } from '../router'
import { useAuth } from '../auth/auth-context'
import { toast } from 'react-hot-toast'

export default function ArtisanAuth() {
  const { navigate, goBack } = useRouter()
  const { login, register, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('signin')
  const [formData, setFormData] = useState({
    mobile: '',
    password: '',
    name: '',
    email: '',
    location: '',
    craft: '',
    experience: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (activeTab === 'signin') {
        if (!formData.mobile || !formData.password) {
          toast.error('Please fill in all fields')
          return
        }
        
        if (formData.mobile.length !== 10) {
          toast.error('Please enter a valid 10-digit mobile number')
          return
        }

        await login(formData.mobile, formData.password)
        toast.success('Login successful!')
        navigate('artisan-dashboard')
      } else {
        if (!formData.name || !formData.mobile || !formData.password || !formData.craft) {
          toast.error('Please fill in all required fields')
          return
        }
        
        if (formData.mobile.length !== 10) {
          toast.error('Please enter a valid 10-digit mobile number')
          return
        }

        await register({
          name: formData.name,
          mobile: formData.mobile,
          password: formData.password,
          role: 'artisan',
          email: formData.email || undefined,
          location: formData.location || undefined,
          craft: formData.craft,
          experience: formData.experience ? parseInt(formData.experience) : undefined
        })
        toast.success('Registration successful!')
        navigate('artisan-verification')
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed')
    }
  }

  const handleSocialAuth = async (provider: string) => {
    toast.info(`${provider} authentication coming soon!`)
  }

  const crafts = [
    'Textile Weaving',
    'Pottery & Ceramics',
    'Jewelry Making',
    'Wood Carving',
    'Metalwork',
    'Paintings & Art',
    'Leather Crafts',
    'Stone Carving',
    'Glass Work',
    'Other'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 botanical-pattern">
      <div className="container mx-auto max-w-md pt-8 px-4">
        {/* Header */}
        <div className="flex items-center mb-12">
          <Button variant="ghost" size="icon" onClick={goBack} className="mr-4 hover:bg-card/60">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-4 w-4 text-accent-foreground/60" />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-primary tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                ShilpkaarAI
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">Artisan Portal</p>
            </div>
          </div>
        </div>

        <Card className="border-0 bg-card/80 backdrop-blur-md card-shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Palette className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle className="text-2xl" style={{ fontFamily: 'Playfair Display, serif' }}>
              Welcome Artisan
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Share your craft with the world and grow your business with AI-powered tools
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary/40 border border-primary/10">
                <TabsTrigger value="signin" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  Join Platform
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-6 mt-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Input 
                      type="tel"
                      placeholder="Mobile number (10 digits)" 
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      required 
                      className="bg-input-background border-primary/20 focus:border-primary/40 h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input 
                      type="password" 
                      placeholder="Password" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required 
                      className="bg-input-background border-primary/20 focus:border-primary/40 h-12 rounded-xl"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 rounded-xl shadow-sm hover:shadow-md transition-all" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Access Dashboard'}
                  </Button>
                </form>

                <div className="text-center">
                  <Button variant="link" className="text-sm text-muted-foreground hover:text-primary">
                    Forgot password?
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-6 mt-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input 
                    placeholder="Full name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required 
                    className="bg-input-background border-primary/20 focus:border-primary/40 h-12 rounded-xl"
                  />
                  <Input 
                    type="tel"
                    placeholder="Mobile number (10 digits)" 
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    required
                    className="bg-input-background border-primary/20 focus:border-primary/40 h-12 rounded-xl"
                  />
                  <Input 
                    type="email" 
                    placeholder="Email address (optional)" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-input-background border-primary/20 focus:border-primary/40 h-12 rounded-xl"
                  />
                  <Input 
                    placeholder="Location (City, State)" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="bg-input-background border-primary/20 focus:border-primary/40 h-12 rounded-xl"
                  />
                  <Select value={formData.craft} onValueChange={(value) => setFormData({...formData, craft: value})}>
                    <SelectTrigger className="bg-input-background border-primary/20 focus:border-primary/40 h-12 rounded-xl">
                      <SelectValue placeholder="Select your craft" />
                    </SelectTrigger>
                    <SelectContent>
                      {crafts.map((craft) => (
                        <SelectItem key={craft} value={craft}>{craft}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input 
                    type="number" 
                    placeholder="Years of experience" 
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="bg-input-background border-primary/20 focus:border-primary/40 h-12 rounded-xl"
                  />
                  <Input 
                    type="password" 
                    placeholder="Create password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required 
                    className="bg-input-background border-primary/20 focus:border-primary/40 h-12 rounded-xl"
                  />
                  <Button 
                    type="submit" 
                    className="w-full h-12 rounded-xl shadow-sm hover:shadow-md transition-all" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Start Your Journey'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="space-y-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="bg-primary/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-4 text-muted-foreground font-medium">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleSocialAuth('google')}
                  disabled={isLoading}
                  className="h-12 bg-card/60 border-primary/20 hover:bg-primary/5 hover:border-primary/30 rounded-xl transition-all"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleSocialAuth('phone')}
                  disabled={isLoading}
                  className="h-12 bg-card/60 border-primary/20 hover:bg-primary/5 hover:border-primary/30 rounded-xl transition-all"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Phone OTP
                </Button>
              </div>
            </div>

            {/* Artisan Features */}
            <div className="grid grid-cols-3 gap-3 py-4 border-t border-primary/10">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-2 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-xs text-muted-foreground">AI Tools</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-2 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-xs text-muted-foreground">Analytics</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-2 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Award className="h-5 w-5 text-yellow-600" />
                </div>
                <p className="text-xs text-muted-foreground">Verification</p>
              </div>
            </div>

            {activeTab === 'signup' && (
              <div className="p-4 bg-secondary/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Upload className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm mb-1">Next: Verification</h4>
                    <p className="text-xs text-muted-foreground">
                      After signup, you'll upload ID proof and craft samples for verification to ensure authenticity.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center pt-4 border-t border-primary/10">
              <p className="text-sm text-muted-foreground">
                Looking to buy crafts?{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary hover:text-primary/80 font-medium"
                  onClick={() => navigate('customer-auth')}
                >
                  Shop as Customer
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}