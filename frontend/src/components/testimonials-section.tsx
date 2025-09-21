import { Card, CardContent } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Star, Quote } from 'lucide-react'
import { motion } from 'motion/react'

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'Textile Artisan',
      location: 'Rajasthan',
      rating: 5,
      text: 'Kalasangam\'s AI tools helped me write beautiful stories about my block prints. My sales increased by 300% in just 2 months!',
      craft: 'Block Printing',
      avatar: 'PS',
      verified: true
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      role: 'Potter',
      location: 'Uttar Pradesh',
      rating: 5,
      text: 'The photo enhancement feature made my pottery look so professional. Customers can now see the fine details of my work.',
      craft: 'Pottery',
      avatar: 'RK',
      verified: true
    },
    {
      id: 3,
      name: 'Meera Patel',
      role: 'Jewelry Maker',
      location: 'Gujarat',
      rating: 5,
      text: 'Being able to show my jewelry in AR has revolutionized my business. Customers love seeing how pieces look before buying.',
      craft: 'Silver Jewelry',
      avatar: 'MP',
      verified: true
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      role: 'Customer',
      location: 'California, USA',
      rating: 5,
      text: 'I love the authentic stories behind each product. Kalasangam connects me directly with the artists and their beautiful traditions.',
      craft: 'Art Collector',
      avatar: 'SJ',
      verified: false
    },
    {
      id: 5,
      name: 'Arjun Singh',
      role: 'Wood Carver',
      location: 'Kerala',
      rating: 5,
      text: 'The voice interface helps me manage my store even when my hands are busy carving. Technology that truly understands artisans!',
      craft: 'Wood Carving',
      avatar: 'AS',
      verified: true
    },
    {
      id: 6,
      name: 'Maria Rodriguez',
      role: 'Interior Designer',
      location: 'Madrid, Spain',
      rating: 5,
      text: 'The quality and authenticity of products on Kalasangam is unmatched. Perfect for my clients who appreciate handcrafted art.',
      craft: 'Design Professional',
      avatar: 'MR',
      verified: false
    }
  ]

  return (
    <section className="py-16 bg-secondary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stories from Our Community
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hear from artisans and customers who are part of the Kalasangam family
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 bg-card/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <Quote className="h-8 w-8 text-primary/30 mb-4" />
                  
                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-muted-foreground mb-6 italic">
                    "{testimonial.text}"
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{testimonial.name}</p>
                          {testimonial.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified Artisan
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role} • {testimonial.location}
                        </p>
                        <p className="text-xs text-primary">
                          {testimonial.craft}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Community Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">4.9/5</div>
            <p className="text-muted-foreground">Average Rating</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">2,500+</div>
            <p className="text-muted-foreground">Happy Customers</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">98%</div>
            <p className="text-muted-foreground">Satisfaction Rate</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">500+</div>
            <p className="text-muted-foreground">Verified Artisans</p>
          </div>
        </div>
      </div>
    </section>
  )
}