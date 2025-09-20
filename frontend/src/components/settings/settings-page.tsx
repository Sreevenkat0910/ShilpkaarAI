import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { Textarea } from '../ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { 
  ArrowLeft,
  User,
  Bell,
  Shield,
  MapPin,
  CreditCard,
  Truck,
  Moon,
  Sun,
  Globe,
  Phone,
  Mail,
  Edit,
  Camera,
  Save,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react'
import { useRouter } from '../router'
import { useAuth } from '../auth/auth-context'
import NavigationHeader from '../navigation-header'
import Footer from '../footer'

export default function SettingsPage() {
  const { goBack } = useRouter()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Form states
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 98765 43210',
    bio: 'Passionate about supporting traditional Indian crafts and artisans.',
    location: 'Bangalore, Karnataka',
    website: '',
    dateOfBirth: '1990-05-15'
  })

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    newProducts: true,
    promotions: false,
    artisanMessages: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true
  })

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    dataSharing: false,
    analytics: true
  })

  const addresses = [
    {
      id: '1',
      type: 'Home',
      name: 'Anita Sharma',
      address: '123, MG Road, Bangalore, Karnataka - 560001',
      phone: '+91 98765 43210',
      isDefault: true
    },
    {
      id: '2',
      type: 'Office',
      name: 'Anita Sharma',
      address: '456, Tech Park, Electronic City, Bangalore, Karnataka - 560100',
      phone: '+91 98765 43210',
      isDefault: false
    }
  ]

  const paymentMethods = [
    {
      id: '1',
      type: 'Credit Card',
      details: '**** **** **** 1234',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: '2',
      type: 'UPI',
      details: 'anita@paytm',
      isDefault: false
    }
  ]

  const handleProfileSave = () => {
    // In real app, this would make an API call
    console.log('Saving profile data:', profileData)
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
  }

  const handlePrivacyChange = (key: string, value: boolean | string) => {
    setPrivacy(prev => ({ ...prev, [key]: value }))
  }

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
              Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account preferences and settings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                      activeTab === 'profile' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary/40'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                      activeTab === 'notifications' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary/40'
                    }`}
                  >
                    <Bell className="h-4 w-4" />
                    <span>Notifications</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('privacy')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                      activeTab === 'privacy' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary/40'
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    <span>Privacy</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                      activeTab === 'addresses' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary/40'
                    }`}
                  >
                    <MapPin className="h-4 w-4" />
                    <span>Addresses</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('payments')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                      activeTab === 'payments' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary/40'
                    }`}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Payments</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('preferences')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                      activeTab === 'preferences' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary/40'
                    }`}
                  >
                    <Globe className="h-4 w-4" />
                    <span>Preferences</span>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information and profile details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="text-lg">
                        {user?.name?.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Change Photo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG or PNG. Max size 2MB.
                      </p>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-input-background border-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-input-background border-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        className="bg-input-background border-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                        className="bg-input-background border-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={profileData.website}
                        onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="https://example.com"
                        className="bg-input-background border-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        className="bg-input-background border-primary/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                      className="bg-input-background border-primary/20"
                      rows={3}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button onClick={handleProfileSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose what notifications you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Order Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about order status changes
                        </p>
                      </div>
                      <Switch
                        checked={notifications.orderUpdates}
                        onCheckedChange={(checked) => handleNotificationChange('orderUpdates', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>New Products</Label>
                        <p className="text-sm text-muted-foreground">
                          Notifications about new products from favorite artisans
                        </p>
                      </div>
                      <Switch
                        checked={notifications.newProducts}
                        onCheckedChange={(checked) => handleNotificationChange('newProducts', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Promotions & Deals</Label>
                        <p className="text-sm text-muted-foreground">
                          Special offers and promotional content
                        </p>
                      </div>
                      <Switch
                        checked={notifications.promotions}
                        onCheckedChange={(checked) => handleNotificationChange('promotions', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Artisan Messages</Label>
                        <p className="text-sm text-muted-foreground">
                          Direct messages from artisans
                        </p>
                      </div>
                      <Switch
                        checked={notifications.artisanMessages}
                        onCheckedChange={(checked) => handleNotificationChange('artisanMessages', checked)}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-4">Delivery Methods</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <Label>Email Notifications</Label>
                        </div>
                        <Switch
                          checked={notifications.emailNotifications}
                          onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <Label>SMS Notifications</Label>
                        </div>
                        <Switch
                          checked={notifications.smsNotifications}
                          onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Bell className="h-4 w-4 text-muted-foreground" />
                          <Label>Push Notifications</Label>
                        </div>
                        <Switch
                          checked={notifications.pushNotifications}
                          onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardHeader>
                  <CardTitle>Privacy & Security</CardTitle>
                  <CardDescription>Control your privacy settings and data sharing preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Profile Visibility</Label>
                      <Select 
                        value={privacy.profileVisibility} 
                        onValueChange={(value) => handlePrivacyChange('profileVisibility', value)}
                      >
                        <SelectTrigger className="bg-input-background border-primary/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="friends">Friends Only</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Email in Profile</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow others to see your email address
                        </p>
                      </div>
                      <Switch
                        checked={privacy.showEmail}
                        onCheckedChange={(checked) => handlePrivacyChange('showEmail', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Phone in Profile</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow others to see your phone number
                        </p>
                      </div>
                      <Switch
                        checked={privacy.showPhone}
                        onCheckedChange={(checked) => handlePrivacyChange('showPhone', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Data Sharing with Partners</Label>
                        <p className="text-sm text-muted-foreground">
                          Share anonymized data to improve services
                        </p>
                      </div>
                      <Switch
                        checked={privacy.dataSharing}
                        onCheckedChange={(checked) => handlePrivacyChange('dataSharing', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Analytics & Performance</Label>
                        <p className="text-sm text-muted-foreground">
                          Help us improve by sharing usage analytics
                        </p>
                      </div>
                      <Switch
                        checked={privacy.analytics}
                        onCheckedChange={(checked) => handlePrivacyChange('analytics', checked)}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-4">Password & Security</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Current Password</Label>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter current password"
                            className="bg-input-background border-primary/20 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>New Password</Label>
                        <Input
                          type="password"
                          placeholder="Enter new password"
                          className="bg-input-background border-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Confirm New Password</Label>
                        <Input
                          type="password"
                          placeholder="Confirm new password"
                          className="bg-input-background border-primary/20"
                        />
                      </div>
                      <Button variant="outline">
                        Update Password
                      </Button>
                    </div>
                  </div>

                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Privacy Settings
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Address Settings */}
            {activeTab === 'addresses' && (
              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Delivery Addresses</CardTitle>
                      <CardDescription>Manage your shipping addresses</CardDescription>
                    </div>
                    <Button>
                      Add New Address
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="p-4 border rounded-lg bg-secondary/20">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant={address.isDefault ? 'default' : 'secondary'}>
                              {address.type}
                            </Badge>
                            {address.isDefault && (
                              <Badge variant="outline" className="text-green-700 bg-green-50">
                                Default
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-medium">{address.name}</h4>
                          <p className="text-sm text-muted-foreground">{address.address}</p>
                          <p className="text-sm text-muted-foreground">{address.phone}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Payment Settings */}
            {activeTab === 'payments' && (
              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Payment Methods</CardTitle>
                      <CardDescription>Manage your payment options</CardDescription>
                    </div>
                    <Button>
                      Add Payment Method
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="p-4 border rounded-lg bg-secondary/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{method.type}</h4>
                              {method.isDefault && (
                                <Badge variant="outline" className="text-green-700 bg-green-50">
                                  Default
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {method.details}
                              {method.expiry && ` • Expires ${method.expiry}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Preferences Settings */}
            {activeTab === 'preferences' && (
              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardHeader>
                  <CardTitle>App Preferences</CardTitle>
                  <CardDescription>Customize your app experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                        </div>
                        <div>
                          <Label>Dark Mode</Label>
                          <p className="text-sm text-muted-foreground">
                            Switch to dark theme
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={isDarkMode}
                        onCheckedChange={setIsDarkMode}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger className="bg-input-background border-primary/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                          <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                          <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                          <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select defaultValue="inr">
                        <SelectTrigger className="bg-input-background border-primary/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inr">INR (₹)</SelectItem>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Time Zone</Label>
                      <Select defaultValue="ist">
                        <SelectTrigger className="bg-input-background border-primary/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                          <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                          <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}