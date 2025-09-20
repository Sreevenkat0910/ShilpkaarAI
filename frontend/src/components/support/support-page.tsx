import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Badge } from '../ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { 
  ArrowLeft,
  MessageCircle,
  Phone,
  Mail,
  Search,
  HelpCircle,
  Book,
  Shield,
  Truck,
  CreditCard,
  Users,
  Star,
  Clock,
  CheckCircle,
  Send,
  FileText
} from 'lucide-react'
import { useRouter } from '../router'
import NavigationHeader from '../navigation-header'
import Footer from '../footer'

export default function SupportPage() {
  const { goBack } = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: '',
    description: ''
  })

  const faqCategories = [
    {
      id: 'orders',
      title: 'Orders & Shipping',
      icon: Truck,
      count: 12,
      faqs: [
        {
          question: 'How long does shipping take?',
          answer: 'Shipping typically takes 5-10 business days depending on your location and the artisan\'s location. Express shipping is available for select items.'
        },
        {
          question: 'Can I track my order?',
          answer: 'Yes! Once your order is shipped, you\'ll receive a tracking number via email and SMS. You can also track your order in the "My Orders" section of your account.'
        },
        {
          question: 'What if my order is damaged?',
          answer: 'We take great care in packaging, but if your item arrives damaged, please contact us within 48 hours with photos. We\'ll arrange a replacement or full refund.'
        },
        {
          question: 'Can I change my delivery address?',
          answer: 'You can change your delivery address before the item is shipped. Once shipped, address changes may not be possible depending on the courier service.'
        }
      ]
    },
    {
      id: 'payments',
      title: 'Payments & Refunds',
      icon: CreditCard,
      count: 8,
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit/debit cards, UPI, net banking, and digital wallets like Paytm, PhonePe, and Google Pay.'
        },
        {
          question: 'When will I be charged?',
          answer: 'Your payment is processed immediately when you place an order. For custom orders, we may charge 50% upfront and the remaining upon completion.'
        },
        {
          question: 'What is your refund policy?',
          answer: 'We offer a 15-day return policy for most items. Refunds are processed within 5-7 business days after we receive the returned item.'
        },
        {
          question: 'Are there any hidden charges?',
          answer: 'No, the price you see is the final price. Shipping is free for orders above ₹500. Below that, standard shipping charges apply.'
        }
      ]
    },
    {
      id: 'products',
      title: 'Products & Quality',
      icon: Star,
      count: 10,
      faqs: [
        {
          question: 'Are all products handmade?',
          answer: 'Yes, all products on ShilpkaarAI are handcrafted by verified artisans. Each item comes with an authenticity certificate.'
        },
        {
          question: 'Can I request customization?',
          answer: 'Many artisans offer customization services. Look for the "Customizable" tag on product pages or message the artisan directly.'
        },
        {
          question: 'How do you ensure quality?',
          answer: 'Every artisan goes through our verification process, and all products are quality-checked before shipping. We also have a rating system based on customer feedback.'
        },
        {
          question: 'What if I don\'t like the product?',
          answer: 'We offer a 15-day return policy if you\'re not satisfied with your purchase, provided the item is in original condition.'
        }
      ]
    },
    {
      id: 'account',
      title: 'Account & Profile',
      icon: Users,
      count: 6,
      faqs: [
        {
          question: 'How do I create an account?',
          answer: 'Click on "Sign Up" and choose whether you\'re a customer or artisan. Fill in your details and verify your email to get started.'
        },
        {
          question: 'I forgot my password. What should I do?',
          answer: 'Click on "Forgot Password" on the login page. Enter your email address and we\'ll send you a password reset link.'
        },
        {
          question: 'Can I change my email address?',
          answer: 'Yes, you can update your email address in the Settings section of your account. You\'ll need to verify the new email address.'
        },
        {
          question: 'How do I delete my account?',
          answer: 'You can request account deletion by contacting our support team. Please note that this action is irreversible.'
        }
      ]
    }
  ]

  const supportChannels = [
    {
      title: 'Live Chat',
      description: 'Chat with our support team',
      available: 'Available 24/7',
      icon: MessageCircle,
      action: 'Start Chat',
      color: 'bg-blue-500'
    },
    {
      title: 'Phone Support',
      description: 'Call our support hotline',
      available: '9 AM - 9 PM, Mon-Sat',
      icon: Phone,
      action: 'Call Now',
      color: 'bg-green-500'
    },
    {
      title: 'Email Support',
      description: 'Send us an email',
      available: 'Response within 24 hours',
      icon: Mail,
      action: 'Send Email',
      color: 'bg-purple-500'
    }
  ]

  const tickets = [
    {
      id: 'TKT-001',
      subject: 'Order delivery delay',
      status: 'Open',
      priority: 'High',
      created: '2024-01-15',
      lastUpdate: '2024-01-16'
    },
    {
      id: 'TKT-002',
      subject: 'Product quality inquiry',
      status: 'Resolved',
      priority: 'Medium',
      created: '2024-01-10',
      lastUpdate: '2024-01-12'
    }
  ]

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0 || searchQuery === '')

  const handleSubmitTicket = () => {
    console.log('Submitting ticket:', ticketForm)
    // Reset form
    setTicketForm({ subject: '', category: '', priority: '', description: '' })
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
              Help & Support
            </h1>
            <p className="text-muted-foreground">
              Get help with your ShilpkaarAI experience
            </p>
          </div>
        </div>

        {/* Support Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {supportChannels.map((channel, index) => (
            <Card key={index} className="border-0 bg-card/60 backdrop-blur-sm card-shadow hover:shadow-lg transition-all cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${channel.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <channel.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{channel.title}</h3>
                <p className="text-sm text-muted-foreground mb-1">{channel.description}</p>
                <p className="text-xs text-muted-foreground mb-4">{channel.available}</p>
                <Button className="w-full">
                  {channel.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="faq" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-secondary/40 border border-primary/10">
                <TabsTrigger value="faq" className="data-[state=active]:bg-card">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  FAQ
                </TabsTrigger>
                <TabsTrigger value="guides" className="data-[state=active]:bg-card">
                  <Book className="h-4 w-4 mr-2" />
                  Guides
                </TabsTrigger>
                <TabsTrigger value="contact" className="data-[state=active]:bg-card">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact
                </TabsTrigger>
              </TabsList>

              {/* FAQ Tab */}
              <TabsContent value="faq" className="space-y-6">
                {/* FAQ Search */}
                <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                  <CardContent className="p-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search frequently asked questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-input-background border-primary/20"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* FAQ Categories */}
                <div className="space-y-6">
                  {filteredFAQs.map((category) => (
                    <Card key={category.id} className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <category.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <span>{category.title}</span>
                            <Badge variant="secondary" className="ml-2">
                              {category.count} articles
                            </Badge>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                          {category.faqs.map((faq, faqIndex) => (
                            <AccordionItem key={faqIndex} value={`${category.id}-${faqIndex}`}>
                              <AccordionTrigger className="text-left">
                                {faq.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-muted-foreground">
                                {faq.answer}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Guides Tab */}
              <TabsContent value="guides" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-primary" />
                        <span>Getting Started</span>
                      </CardTitle>
                      <CardDescription>
                        Complete guide for new users
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Learn how to create an account, browse products, and make your first purchase.
                      </p>
                      <Button variant="outline" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Read Guide
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Truck className="h-5 w-5 text-primary" />
                        <span>Order Management</span>
                      </CardTitle>
                      <CardDescription>
                        Track and manage your orders
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Learn how to track orders, request returns, and manage delivery addresses.
                      </p>
                      <Button variant="outline" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Read Guide
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-primary" />
                        <span>Quality Assurance</span>
                      </CardTitle>
                      <CardDescription>
                        Understanding our quality standards
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Learn about our artisan verification process and quality guarantees.
                      </p>
                      <Button variant="outline" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Read Guide
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <span>Security & Privacy</span>
                      </CardTitle>
                      <CardDescription>
                        Keeping your data safe
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Learn about our security measures and privacy policies.
                      </p>
                      <Button variant="outline" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Read Guide
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Contact Tab */}
              <TabsContent value="contact" className="space-y-6">
                <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
                  <CardHeader>
                    <CardTitle>Submit a Support Ticket</CardTitle>
                    <CardDescription>
                      Can't find what you're looking for? Send us a message and we'll get back to you.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="Brief description of your issue"
                          value={ticketForm.subject}
                          onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                          className="bg-input-background border-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <select
                          id="category"
                          value={ticketForm.category}
                          onChange={(e) => setTicketForm(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full p-2 rounded-md border border-primary/20 bg-input-background"
                        >
                          <option value="">Select a category</option>
                          <option value="orders">Orders & Shipping</option>
                          <option value="payments">Payments & Refunds</option>
                          <option value="products">Products & Quality</option>
                          <option value="account">Account & Profile</option>
                          <option value="technical">Technical Issues</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <select
                        id="priority"
                        value={ticketForm.priority}
                        onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full p-2 rounded-md border border-primary/20 bg-input-background"
                      >
                        <option value="">Select priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Please provide detailed information about your issue..."
                        value={ticketForm.description}
                        onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                        className="bg-input-background border-primary/20 min-h-32"
                      />
                    </div>

                    <Button onClick={handleSubmitTicket} className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Submit Ticket
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Support Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Response Time</span>
                  <Badge variant="secondary">2 hours</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Resolution Rate</span>
                  <Badge className="bg-green-100 text-green-700">95%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Satisfaction Score</span>
                  <Badge className="bg-blue-100 text-blue-700">4.8/5</Badge>
                </div>
              </CardContent>
            </Card>

            {/* My Tickets */}
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle className="text-lg">My Tickets</CardTitle>
                <CardDescription>Your recent support requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="p-3 bg-secondary/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{ticket.id}</span>
                      <Badge 
                        variant={ticket.status === 'Open' ? 'default' : 'secondary'}
                        className={ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' : ''}
                      >
                        {ticket.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{ticket.subject}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Updated {ticket.lastUpdate}</span>
                    </div>
                  </div>
                ))}
                {tickets.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No support tickets yet
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">+91 1800-123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">support@shilpkaarai.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">9 AM - 9 PM, Mon-Sat</span>
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