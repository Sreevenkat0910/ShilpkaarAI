import { ReactNode } from 'react'
import { useAuth, UserRole } from './auth-context'
import { useRouter } from '../router'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react'

interface RoleGuardProps {
  allowedRoles: UserRole[]
  children: ReactNode
  redirectTo?: string
  fallback?: ReactNode
}

export default function RoleGuard({ 
  allowedRoles, 
  children, 
  redirectTo, 
  fallback 
}: RoleGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { navigate } = useRouter()

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 botanical-pattern flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // User not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 botanical-pattern flex items-center justify-center">
        <Card className="max-w-md mx-4 border-0 bg-card/80 backdrop-blur-md card-shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle style={{ fontFamily: 'Playfair Display, serif' }}>
              Authentication Required
            </CardTitle>
            <CardDescription>
              Please sign in to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('customer-auth')}
                className="w-full"
              >
                Sign In as Customer
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('artisan-auth')}
                className="w-full bg-card/60 border-primary/20"
              >
                Sign In as Artisan
              </Button>
            </div>
            <Button 
              variant="ghost"
              onClick={() => navigate('home')}
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // User doesn't have required role
  if (!allowedRoles.includes(user.role)) {
    const correctDashboard = user.role === 'customer' ? 'customer-dashboard' : 'artisan-dashboard'
    const correctAuth = user.role === 'customer' ? 'customer-auth' : 'artisan-auth'
    
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 botanical-pattern flex items-center justify-center">
        <Card className="max-w-md mx-4 border-0 bg-card/80 backdrop-blur-md card-shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle style={{ fontFamily: 'Playfair Display, serif' }}>
              Access Denied
            </CardTitle>
            <CardDescription>
              You don't have permission to access this page as a {user.role}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              This page is only accessible to {allowedRoles.join(' and ')} users.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate(correctDashboard)}
                className="w-full"
              >
                Go to Your Dashboard
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('home')}
                className="w-full bg-card/60 border-primary/20"
              >
                <Home className="h-4 w-4 mr-2" />
                Go to Home
              </Button>
            </div>
            <div className="text-xs text-muted-foreground pt-4 border-t border-primary/10">
              Need to switch roles?{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary hover:text-primary/80"
                onClick={() => navigate(user.role === 'customer' ? 'artisan-auth' : 'customer-auth')}
              >
                Sign in as {user.role === 'customer' ? 'Artisan' : 'Customer'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}