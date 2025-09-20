import { Button } from './ui/button'
import { Input } from './ui/input'
import { Separator } from './ui/separator'
import { Sparkles, Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail, Leaf } from 'lucide-react'

export default function Footer() {
  const footerSections = [
    {
      title: 'Marketplace',
      links: [
        'Explore Products',
        'Categories',
        'Featured Artisans',
        'New Arrivals',
        'Best Sellers'
      ]
    },
    {
      title: 'For Artisans',
      links: [
        'Join ShipkaarAI',
        'AI Tools',
        'Seller Dashboard',
        'Photo Enhancement',
        'Success Stories'
      ]
    },
    {
      title: 'Support',
      links: [
        'Help Center',
        'Contact Us',
        'Shipping Info',
        'Returns',
        'FAQs'
      ]
    },
    {
      title: 'Company',
      links: [
        'About Us',
        'Our Mission',
        'Careers',
        'Press',
        'Partners'
      ]
    }
  ]

  return (
    <footer className="bg-secondary/20 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-12 border-b">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Stay Connected with Artisan Stories
            </h3>
            <p className="text-muted-foreground mb-6">
              Get the latest updates on new artisans, exclusive collections, and AI features
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                placeholder="Enter your email" 
                type="email"
                className="flex-1 bg-input-background border-primary/20"
              />
              <Button className="shadow-sm">Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-sm">
                    <Leaf className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="h-3 w-3 text-accent-foreground/60" />
                  </div>
                </div>
                <span className="font-bold text-xl text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
                  ShipkaarAI
                </span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Empowering Indian artisans with AI-powered tools to showcase their crafts 
                and connect with customers worldwide.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Bangalore, Karnataka, India</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>+91 80 1234 5678</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>hello@shipkaarai.com</span>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a 
                        href="#" 
                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Bottom Footer */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © 2024 ShipkaarAI. All rights reserved. Built with ❤️ for Indian artisans.
          </div>
          
          {/* Social Links */}
          <div className="flex space-x-4">
            <Button variant="ghost" size="icon">
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Instagram className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Youtube className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Legal Links */}
        <div className="py-4 border-t">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary">
              Terms of Service
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary">
              Cookie Policy
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary">
              Artisan Agreement
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}