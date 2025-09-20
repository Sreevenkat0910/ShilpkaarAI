import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { Phone, Mail, ArrowLeft, Leaf, Sparkles } from 'lucide-react'
import { useRouter } from '../router'
import { useAuth } from './auth-context'
import { toast } from 'react-hot-toast'

export default function AuthPage() {
  const { navigate, goBack } = useRouter()
  const { login, register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    mobile: '',
    password: '',
    name: '',
    email: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.mobile || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }
    
    if (formData.mobile.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number')
      return
    }

    setIsLoading(true)
    try {
      await login(formData.mobile, formData.password)
      toast.success('Login successful!')
      navigate('customer-dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.mobile || !formData.password) {
      toast.error('Please fill in all required fields')
      return
    }
    
    if (formData.mobile.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number')
      return
    }

    setIsLoading(true)
    try {
      await register({
        name: formData.name,
        mobile: formData.mobile,
        password: formData.password,
        role: 'customer',
        email: formData.email || undefined
      })
      toast.success('Registration successful!')
      navigate('customer-dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialAuth = (provider: string) => {
    toast.info(`${provider} authentication coming soon!`)
  }

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
                ShipkaarAI
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">Artisan Marketplace</p>
            </div>
          </div>
        </div>

        <Card className="border-0 bg-card/80 backdrop-blur-md card-shadow-lg">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-2xl" style={{ fontFamily: 'Playfair Display, serif' }}>
              Welcome to ShipkaarAI
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Discover authentic handcrafted treasures from skilled Indian artisans, 
              enhanced by AI storytelling and modern technology
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary/40 border border-primary/10">
                <TabsTrigger value="signin" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-6 mt-8">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Input 
                      type="tel"
                      name="mobile"
                      placeholder="Mobile number (10 digits)" 
                      value={formData.mobile}
                      onChange={handleInputChange}
                      required 
                      className="bg-input-background border-primary/20 focus:border-primary/40 h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input 
                      type="password" 
                      name="password"
                      placeholder="Password" 
                      value={formData.password}
                      onChange={handleInputChange}
                      required 
                      className="bg-input-background border-primary/20 focus:border-primary/40 h-12 rounded-xl"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 rounded-xl shadow-sm hover:shadow-md transition-all" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                <div className="text-center">
                  <Button variant="link" className="text-sm text-muted-foreground hover:text-primary">
                    Forgot password?
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-6 mt-8">
                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="space-y-2">
                    <Input 
                      name="name"
                      placeholder="Full name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required 
                      className="bg-input-background border-primary/20 focus:border-primary/40 h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input 
                      type="tel"
                      name="mobile"
                      placeholder="Mobile number (10 digits)" 
                      value={formData.mobile}
                      onChange={handleInputChange}
                      required 
                      className="bg-input-background border-primary/20 focus:border-primary/40 h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input 
                      type="email" 
                      name="email"
                      placeholder="Email address (optional)" 
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-input-background border-primary/20 focus:border-primary/40 h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input 
                      type="password" 
                      name="password"
                      placeholder="Create password" 
                      value={formData.password}
                      onChange={handleInputChange}
                      required 
                      className="bg-input-background border-primary/20 focus:border-primary/40 h-12 rounded-xl"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 rounded-xl shadow-sm hover:shadow-md transition-all" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
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

            <div className="text-center">
              <Badge variant="secondary" className="px-4 py-2 bg-secondary/60 border border-primary/10 shadow-sm">
                <Sparkles className="mr-2 h-3 w-3" />
                Voice-friendly interface available
              </Badge>
            </div>

            <div className="text-center pt-4 border-t border-primary/10">
              <p className="text-sm text-muted-foreground">
                Are you an artisan?{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary hover:text-primary/80 font-medium"
                  onClick={() => navigate('artisan-auth')}
                >
                  Join ShipkaarAI
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}