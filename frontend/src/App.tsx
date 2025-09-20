import { Router, useRouter } from './components/router'
import { AuthProvider } from './components/auth/auth-context'
import { CartProvider } from './components/cart/cart-context'
import { FavoritesProvider } from './components/favorites/favorites-context'
import { ChatProvider } from './components/messaging/chat-context'
import { Toaster } from 'react-hot-toast'
import RoleGuard from './components/auth/role-guard'
import NavigationHeader from './components/navigation-header'
import HeroSection from './components/hero-section'
import CategoriesSection from './components/categories-section'
import AIFeaturesSection from './components/ai-features-section'
import TestimonialsSection from './components/testimonials-section'
import Footer from './components/footer'
import AuthPage from './components/auth/auth-page'
import CustomerAuth from './components/auth/customer-auth'
import ArtisanAuth from './components/artisan/artisan-auth'
import ArtisanVerification from './components/artisan/artisan-verification'
import ArtisanProducts from './components/artisan/artisan-products'
import ArtisanAnalytics from './components/artisan/artisan-analytics'
import ArtisanAITools from './components/artisan/artisan-ai-tools'
import AddProduct from './components/artisan/add-product'
import EditProduct from './components/artisan/edit-product'
import OrdersPage from './components/customer/orders-page'
import FavoritesPage from './components/customer/favorites-page'
import OrderTracking from './components/customer/order-tracking'
import ProductCatalog from './components/marketplace/product-catalog'
import CategoriesPage from './components/marketplace/categories-page'
import ExplorePage from './components/marketplace/explore-page'
import ArtisansPage from './components/marketplace/artisans-page'
import ProductDetail from './components/marketplace/product-detail'
import SettingsPage from './components/settings/settings-page'
import SupportPage from './components/support/support-page'
import CartPage from './components/cart/cart-page'
import CheckoutPage from './components/cart/checkout-page'
import OrderConfirmation from './components/cart/order-confirmation'
import CartSidebar from './components/cart/cart-sidebar'
import CustomerDashboard from './components/customer/customer-dashboard'
import ArtisanDashboard from './components/artisan/artisan-dashboard'
import MessagesPage from './components/messaging/messages-page'

function HomePage() {
  return (
    <>
      <NavigationHeader />
      <main>
        <HeroSection />
        <CategoriesSection />
        <AIFeaturesSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  )
}

function AppContent() {
  const { router } = useRouter()

  const renderPage = () => {
    switch (router.currentPage) {
      case 'home':
        return <HomePage />
      case 'categories':
        return <CategoriesPage />
      case 'explore':
        return <ExplorePage />
      case 'artisans':
        return <ArtisansPage />
      case 'auth':
        return <AuthPage />
      case 'customer-auth':
        return <CustomerAuth />
      case 'artisan-auth':
        return <ArtisanAuth />
      case 'product-catalog':
        return <ProductCatalog />
      case 'cart':
        return (
          <RoleGuard allowedRoles={['customer']}>
            <CartPage />
          </RoleGuard>
        )
      case 'checkout':
        return (
          <RoleGuard allowedRoles={['customer']}>
            <CheckoutPage />
          </RoleGuard>
        )
      case 'order-confirmation':
        return (
          <RoleGuard allowedRoles={['customer']}>
            <OrderConfirmation />
          </RoleGuard>
        )
      case 'customer-dashboard':
        return (
          <RoleGuard allowedRoles={['customer']}>
            <CustomerDashboard />
          </RoleGuard>
        )
      case 'artisan-dashboard':
        return (
          <RoleGuard allowedRoles={['artisan']}>
            <ArtisanDashboard />
          </RoleGuard>
        )
      case 'artisan-verification':
        return (
          <RoleGuard allowedRoles={['artisan']}>
            <ArtisanVerification />
          </RoleGuard>
        )
      case 'messages':
        return (
          <RoleGuard allowedRoles={['customer', 'artisan']}>
            <MessagesPage />
          </RoleGuard>
        )
      case 'orders':
        return (
          <RoleGuard allowedRoles={['customer']}>
            <OrdersPage />
          </RoleGuard>
        )
      case 'favorites':
        return (
          <RoleGuard allowedRoles={['customer']}>
            <FavoritesPage />
          </RoleGuard>
        )
      case 'order-tracking':
        return (
          <RoleGuard allowedRoles={['customer']}>
            <OrderTracking />
          </RoleGuard>
        )
      case 'product-detail':
        return <ProductDetail />
      case 'settings':
        return (
          <RoleGuard allowedRoles={['customer', 'artisan']}>
            <SettingsPage />
          </RoleGuard>
        )
      case 'support':
        return <SupportPage />
      case 'artisan-products':
        return (
          <RoleGuard allowedRoles={['artisan']}>
            <ArtisanProducts />
          </RoleGuard>
        )
      case 'add-product':
        return (
          <RoleGuard allowedRoles={['artisan']}>
            <AddProduct />
          </RoleGuard>
        )
      case 'edit-product':
        return (
          <RoleGuard allowedRoles={['artisan']}>
            <EditProduct />
          </RoleGuard>
        )
      case 'artisan-analytics':
        return (
          <RoleGuard allowedRoles={['artisan']}>
            <ArtisanAnalytics />
          </RoleGuard>
        )
      case 'artisan-ai-tools':
        return (
          <RoleGuard allowedRoles={['artisan']}>
            <ArtisanAITools />
          </RoleGuard>
        )
      default:
        return <HomePage />
    }
  }

  return (
    <div className="min-h-screen">
      {renderPage()}
      <CartSidebar />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <ChatProvider>
            <Router>
              <AppContent />
            </Router>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </ChatProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  )
}