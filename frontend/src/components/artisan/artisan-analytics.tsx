import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { 
  ArrowLeft,
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  Calendar,
  Eye,
  Heart,
  Star,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Clock,
  Filter,
  Download,
  Bell,
  Lightbulb,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Loader2
} from 'lucide-react'
import { useRouter } from '../router'
import { useAuth } from '../auth/auth-context'
import NavigationHeader from '../navigation-header'
import Footer from '../footer'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { analyticsApi, ApiError } from '../../utils/api'

export default function ArtisanAnalytics() {
  const { navigate, goBack } = useRouter()
  const { user } = useAuth()
  const [timeFrame, setTimeFrame] = useState('30days')
  
  // State for analytics data
  const [overview, setOverview] = useState(null)
  const [salesData, setSalesData] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [categoryPerformance, setCategoryPerformance] = useState([])
  const [customerInsights, setCustomerInsights] = useState(null)
  const [seasonalTrends, setSeasonalTrends] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [alerts, setAlerts] = useState([])
  const [inventoryInsights, setInventoryInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all analytics data in parallel using the API utility
      const [
        overviewRes,
        salesTrendRes,
        topProductsRes,
        categoryPerformanceRes,
        customerInsightsRes,
        seasonalTrendsRes,
        recommendationsRes,
        alertsRes,
        inventoryInsightsRes
      ] = await Promise.all([
        analyticsApi.getOverview(timeFrame),
        analyticsApi.getSalesTrend(timeFrame),
        analyticsApi.getTopProducts(timeFrame),
        analyticsApi.getCategoryPerformance(timeFrame),
        analyticsApi.getCustomerInsights(timeFrame),
        analyticsApi.getSeasonalTrends(),
        analyticsApi.getRecommendations(),
        analyticsApi.getAlerts(),
        analyticsApi.getInventoryInsights()
      ])

      // Set state with the data from API responses
      setOverview(overviewRes.data)
      setSalesData(salesTrendRes.data)
      setTopProducts(topProductsRes.data)
      setCategoryPerformance(categoryPerformanceRes.data)
      setCustomerInsights(customerInsightsRes.data)
      setSeasonalTrends(seasonalTrendsRes.data)
      setRecommendations(recommendationsRes.data)
      setAlerts(alertsRes.data)
      setInventoryInsights(inventoryInsightsRes.data)

    } catch (error) {
      console.error('Error fetching analytics data:', error)
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setError('Authentication failed. Please log in again.')
        } else if (error.status === 403) {
          setError('Access denied. Only artisans can view analytics.')
        } else {
          setError(`Failed to load analytics data: ${error.message}`)
        }
      } else {
        setError('Failed to load analytics data. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Fetch data when component mounts or timeFrame changes
  useEffect(() => {
    if (user && user.role === 'artisan') {
      fetchAnalyticsData()
    } else if (user && user.role !== 'artisan') {
      setError('Access denied. Only artisans can view analytics.')
      setLoading(false)
    } else if (!user) {
      setError('Please log in to view analytics.')
      setLoading(false)
    }
  }, [timeFrame, user])

  // Handle timeFrame change
  const handleTimeFrameChange = (newTimeFrame: string) => {
    setTimeFrame(newTimeFrame)
  }

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowUpRight className="h-4 w-4 text-green-600" />
    if (growth < 0) return <ArrowDownRight className="h-4 w-4 text-red-600" />
    return <Activity className="h-4 w-4 text-gray-600" />
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'medium': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 botanical-pattern">
        <NavigationHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading analytics data...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 botanical-pattern">
        <NavigationHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchAnalyticsData} variant="outline">
                Try Again
              </Button>
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
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="icon" onClick={goBack} className="hover:bg-card/60">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl" style={{ fontFamily: 'Playfair Display, serif' }}>
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Insights to grow your craft business
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={timeFrame} onValueChange={handleTimeFrameChange}>
              <SelectTrigger className="w-40 bg-card/60 border-primary/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="bg-card/60 border-primary/20">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-primary">
                    ₹{overview?.totalRevenue ? (overview.totalRevenue / 1000).toFixed(1) + 'K' : '0'}
                  </p>
                  <div className={`flex items-center text-sm ${overview?.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {overview?.revenueGrowth >= 0 ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                    <span>{overview?.revenueGrowth ? overview.revenueGrowth.toFixed(1) : '0'}%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold text-primary">{overview?.totalOrders || 0}</p>
                  <div className={`flex items-center text-sm ${overview?.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {overview?.ordersGrowth >= 0 ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                    <span>{overview?.ordersGrowth ? overview.ordersGrowth.toFixed(1) : '0'}%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Order Value</p>
                  <p className="text-2xl font-bold text-primary">₹{overview?.avgOrderValue || 0}</p>
                  <div className={`flex items-center text-sm ${overview?.avgOrderValueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {overview?.avgOrderValueGrowth >= 0 ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                    <span>{overview?.avgOrderValueGrowth ? overview.avgOrderValueGrowth.toFixed(1) : '0'}%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Customer Rating</p>
                  <p className="text-2xl font-bold text-primary">{overview?.customerRating || 0}</p>
                  <div className="flex items-center text-sm text-green-600">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    <span>{overview?.totalReviews || 0} reviews</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-secondary/40 border border-primary/10">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
            <TabsTrigger value="recommendations">AI Insights</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trend */}
              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
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
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#314f36" 
                        fill="rgba(49, 79, 54, 0.1)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Performance */}
              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                  <CardDescription>Revenue distribution across product categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={categoryPerformance}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {categoryPerformance.map((category, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm">{category.name}</span>
                        <span className="text-sm text-muted-foreground">{category.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Performing Products */}
              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Top Performing Products
                  </CardTitle>
                  <CardDescription>Your best-selling products this month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topProducts.map((product) => (
                    <div key={product.id} className="flex items-center space-x-4 p-3 bg-secondary/20 rounded-lg">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span>₹{product.sales.toLocaleString()}</span>
                          <span>{product.orders} orders</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getGrowthIcon(product.growth)}
                        <span className={`text-sm ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.abs(product.growth)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Inventory Recommendations */}
              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Inventory Insights
                  </CardTitle>
                  <CardDescription>Stock levels and reorder recommendations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {inventoryInsights.slice(0, 3).map((item, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{item.name}</span>
                        <Badge className={
                          item.status === 'low' ? 'bg-red-100 text-red-700' :
                          item.status === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }>
                          {item.status === 'low' ? 'Low Stock' :
                           item.status === 'medium' ? 'Medium Stock' : 'Good Stock'}
                        </Badge>
                      </div>
                      <Progress value={item.stockPercentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {item.currentStock} units left • {item.recommendation}
                      </p>
                    </div>
                  ))}

                  {inventoryInsights.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No inventory data available</p>
                    </div>
                  )}

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-1">AI Recommendation</h4>
                    <p className="text-sm text-blue-700">
                      Based on sales velocity, monitor stock levels closely and restock low inventory items.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Demographics */}
              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Customer Demographics
                  </CardTitle>
                  <CardDescription>Age distribution of your customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customerInsights?.demographics?.ageGroups?.map((group, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{group.range} years</span>
                          <span>{group.percentage}%</span>
                        </div>
                        <Progress value={group.percentage} className="h-2" />
                      </div>
                    )) || (
                      <div className="text-center py-4 text-muted-foreground">
                        <Users className="h-6 w-6 mx-auto mb-2 opacity-50" />
                        <p>No demographic data available</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">{customerInsights?.avgRating || 0}</div>
                      <p className="text-xs text-muted-foreground">Avg Rating</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{customerInsights?.totalReviews || 0}</div>
                      <p className="text-xs text-muted-foreground">Total Reviews</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{customerInsights?.repeatCustomers || 0}%</div>
                      <p className="text-xs text-muted-foreground">Repeat Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Geographic Distribution */}
              <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Top Customer Locations
                  </CardTitle>
                  <CardDescription>Where your customers are located</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customerInsights?.topLocations?.map((location, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                        <div>
                          <h4 className="font-medium">{location.city}</h4>
                          <p className="text-sm text-muted-foreground">{location.orders} orders</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">{location.percentage}%</div>
                          <Progress value={location.percentage} className="w-20 h-1 mt-1" />
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-muted-foreground">
                        <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No location data available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Seasonal Tab */}
          <TabsContent value="seasonal" className="space-y-6">
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Seasonal Trends & Festival Impact
                </CardTitle>
                <CardDescription>How festivals and seasons affect your sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {seasonalTrends?.map((trend, index) => (
                    <div key={index} className="p-4 bg-secondary/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{trend.festival}</h4>
                        <Badge className="bg-green-100 text-green-700">{trend.impact}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Peak Season:</strong> {trend.peak}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Best Products:</strong> {trend.products}
                      </p>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-muted-foreground col-span-2">
                      <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No seasonal data available</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg">
                  <h4 className="font-medium mb-2">Upcoming Opportunities</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Durga Puja is approaching in 2 weeks. Historical data shows 28% increase in traditional textile sales.
                  </p>
                  <Button size="sm">
                    <Target className="h-4 w-4 mr-2" />
                    Prepare Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  AI-Powered Recommendations
                </CardTitle>
                <CardDescription>Smart insights to boost your sales and efficiency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {recommendations?.map((rec, index) => (
                    <div key={index} className="p-4 bg-secondary/20 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium">{rec.title}</h4>
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {rec.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-600">
                          {rec.impact}
                        </span>
                        <Button size="sm" variant="outline">
                          {rec.action}
                        </Button>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-muted-foreground col-span-2">
                      <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No recommendations available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications & Alerts
                </CardTitle>
                <CardDescription>Important updates about your business</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts?.map((alert, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-secondary/20 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        alert.type === 'success' ? 'bg-green-500' :
                        alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <h4 className="font-medium">{alert.title}</h4>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No alerts at this time</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Smart Alerts Enabled</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Get notified about inventory levels, sales spikes, and seasonal opportunities.
                  </p>
                  <Button size="sm" variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Customize Alerts
                  </Button>
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