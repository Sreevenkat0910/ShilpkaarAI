import { useState } from 'react'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Menu, Search, User, Leaf, Sparkles, MessageCircle, Settings, LogOut } from 'lucide-react'
import { useRouter } from './router'
import { useAuth } from './auth/auth-context'
import CartTrigger from './cart/cart-trigger'

export default function NavigationHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const { navigate } = useRouter()
  const { user, isAuthenticated, logout } = useAuth()

  // Role-based navigation items
  const getNavItems = () => {
    if (!isAuthenticated || !user) {
      return [
        { label: 'Explore', action: () => navigate('explore') },
        { label: 'Categories', action: () => navigate('categories') },
        { label: 'Artisans', action: () => navigate('artisans') },
        { label: 'Stories', action: () => navigate('home') },
      ]
    }

    if (user.role === 'customer') {
      return [
        { label: 'Explore', action: () => navigate('explore') },
        { label: 'Categories', action: () => navigate('categories') },
        { label: 'Artisans', action: () => navigate('artisans') },
        { label: 'Dashboard', action: () => navigate('customer-dashboard') },
        { label: 'My Orders', action: () => navigate('orders') },
      ]
    }

    if (user.role === 'artisan') {
      return [
        { label: 'Dashboard', action: () => navigate('artisan-dashboard') },
        { label: 'Products', action: () => navigate('artisan-products') },
        { label: 'Analytics', action: () => navigate('artisan-analytics') },
        { label: 'AI Tools', action: () => navigate('artisan-ai-tools') },
      ]
    }

    return []
  }

  const navItems = getNavItems()

  const handleAuthAction = () => {
    if (isAuthenticated && user) {
      const dashboardRoute = user.role === 'customer' ? 'customer-dashboard' : 'artisan-dashboard'
      navigate(dashboardRoute)
    } else {
      navigate('customer-auth')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('home')
    setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => navigate('home')}
          >
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm group-hover:shadow-md transition-all">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-4 w-4 text-accent-foreground/60" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-primary tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                ShipkaarAI
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">Artisan Marketplace</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="text-sm font-medium text-foreground/80 transition-all hover:text-primary hover:scale-105 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {(!isAuthenticated || user?.role === 'customer') && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden sm:flex hover:bg-secondary/60 hover:scale-105 transition-all"
                onClick={() => navigate('product-catalog')}
              >
                <Search className="h-5 w-5" />
              </Button>
            )}

            {(!isAuthenticated || user?.role === 'customer') && <CartTrigger />}

            {isAuthenticated && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-secondary/60 hover:scale-105 transition-all"
                onClick={() => navigate('messages')}
              >
                <MessageCircle className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-red-500 border-0 shadow-sm">
                  2
                </Badge>
              </Button>
            )}

            {/* User Profile or Auth Button */}
            {isAuthenticated && user ? (
              <div className="hidden sm:flex items-center space-x-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center space-x-3 cursor-pointer hover:bg-secondary/40 p-2 rounded-xl transition-all">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${user.role === 'artisan' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}
                      >
                        {user.role === 'artisan' ? 'Artisan' : 'Customer'}
                      </Badge>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-card border-border/60">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleAuthAction}
                      className="cursor-pointer"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate('messages')}
                      className="cursor-pointer"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      <span>Messages</span>
                    </DropdownMenuItem>
                    {user.role === 'artisan' && !user.isVerified && (
                      <DropdownMenuItem 
                        onClick={() => navigate('artisan-verification')}
                        className="cursor-pointer text-orange-600"
                      >
                        <Badge className="mr-2 h-4 w-4 bg-orange-100 text-orange-600" />
                        <span>Complete Verification</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-secondary/60 hover:scale-105 transition-all"
                onClick={handleAuthAction}
              >
                <User className="h-5 w-5" />
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:bg-secondary/60">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-card border-border/60">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                    <Leaf className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
                      ShipkaarAI
                    </h2>
                    <p className="text-xs text-muted-foreground">Artisan Marketplace</p>
                  </div>
                </div>

                {/* User Info */}
                {isAuthenticated && user && (
                  <div className="flex items-center space-x-3 p-4 bg-secondary/20 rounded-lg mb-6">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{user.name}</h3>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${user.role === 'artisan' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}
                      >
                        {user.role === 'artisan' ? 'Artisan' : 'Customer'}
                      </Badge>
                    </div>
                  </div>
                )}
                
                <nav className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.action()
                        setIsOpen(false)
                      }}
                      className="block py-3 px-4 text-left text-lg font-medium transition-all hover:text-primary hover:bg-secondary/40 rounded-lg"
                    >
                      {item.label}
                    </button>
                  ))}

                  {isAuthenticated && (
                    <>
                      <button
                        onClick={() => {
                          navigate('messages')
                          setIsOpen(false)
                        }}
                        className="block py-3 px-4 text-left text-lg font-medium transition-all hover:text-primary hover:bg-secondary/40 rounded-lg"
                      >
                        Messages
                      </button>
                      <button
                        onClick={() => {
                          navigate('settings')
                          setIsOpen(false)
                        }}
                        className="block py-3 px-4 text-left text-lg font-medium transition-all hover:text-primary hover:bg-secondary/40 rounded-lg"
                      >
                        Settings
                      </button>
                    </>
                  )}

                  <div className="border-t border-border/60 pt-6 mt-8 space-y-3">
                    {isAuthenticated ? (
                      <>
                        <Button 
                          className="w-full shadow-sm"
                          onClick={() => {
                            handleAuthAction()
                            setIsOpen(false)
                          }}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Dashboard
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full border-primary/20 hover:bg-primary/5"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          className="w-full shadow-sm"
                          onClick={() => {
                            navigate('customer-auth')
                            setIsOpen(false)
                          }}
                        >
                          Sign In as Customer
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full border-primary/20 hover:bg-primary/5"
                          onClick={() => {
                            navigate('artisan-auth')
                            setIsOpen(false)
                          }}
                        >
                          Join as Artisan
                        </Button>
                      </>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}