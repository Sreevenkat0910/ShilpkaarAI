import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Separator } from '../ui/separator'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { 
  Star,
  ThumbsUp,
  Package,
  Calendar,
  MessageCircle,
  Send,
  Edit,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { reviewApi, ApiError } from '../../utils/api'
import { useAuth } from '../auth/auth-context'

interface Review {
  _id: string
  product: string
  user: {
    _id: string
    name: string
    avatar?: string
  }
  userName: string
  rating: number
  comment: string
  isVerified: boolean
  helpful: number
  helpfulUsers: string[]
  images?: string[]
  createdAt: string
  updatedAt: string
}

interface ReviewSummary {
  averageRating: number
  totalReviews: number
  distribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

interface ReviewsSectionProps {
  productId: string
  productName: string
}

export default function ReviewsSection({ productId, productName }: ReviewsSectionProps) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [summary, setSummary] = useState<ReviewSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [editingReview, setEditingReview] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState('newest')
  
  // Review form state
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [hoveredStar, setHoveredStar] = useState(0)

  useEffect(() => {
    loadReviews()
    loadSummary()
  }, [productId, currentPage, sortBy])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const response = await reviewApi.getProductReviews(productId, currentPage, 10, sortBy)
      setReviews(response.data.reviews)
      setTotalPages(response.data.pagination.pages)
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSummary = async () => {
    try {
      const response = await reviewApi.getReviewSummary(productId)
      setSummary(response.data)
    } catch (error) {
      console.error('Error loading review summary:', error)
    }
  }

  const handleSubmitReview = async () => {
    if (!user) {
      alert('Please login to submit a review')
      return
    }

    if (rating === 0) {
      alert('Please select a rating')
      return
    }

    if (comment.trim().length < 10) {
      alert('Please write a comment (at least 10 characters)')
      return
    }

    try {
      setSubmitting(true)
      
      if (editingReview) {
        await reviewApi.updateReview(editingReview, rating, comment)
      } else {
        await reviewApi.createReview(productId, rating, comment)
      }
      
      // Reset form
      setRating(0)
      setComment('')
      setShowReviewForm(false)
      setEditingReview(null)
      
      // Reload data
      loadReviews()
      loadSummary()
    } catch (error) {
      if (error instanceof ApiError) {
        alert(error.message)
      } else {
        alert('Error submitting review')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return

    try {
      await reviewApi.deleteReview(reviewId)
      loadReviews()
      loadSummary()
    } catch (error) {
      if (error instanceof ApiError) {
        alert(error.message)
      } else {
        alert('Error deleting review')
      }
    }
  }

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      await reviewApi.markHelpful(reviewId)
      loadReviews()
    } catch (error) {
      if (error instanceof ApiError) {
        alert(error.message)
      } else {
        alert('Error marking review as helpful')
      }
    }
  }

  const handleEditReview = (review: Review) => {
    setRating(review.rating)
    setComment(review.comment)
    setEditingReview(review._id)
    setShowReviewForm(true)
  }

  const renderStars = (rating: number, interactive: boolean = false, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5'
    }

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= (interactive ? hoveredStar || rating : rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer' : ''}`}
            onClick={interactive ? () => setRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoveredStar(star) : undefined}
            onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
          />
        ))}
      </div>
    )
  }

  const getPercentage = (count: number, total: number) => {
    return total > 0 ? (count / total) * 100 : 0
  }

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      {summary && (
        <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{summary.averageRating.toFixed(1)}</div>
                {renderStars(Math.round(summary.averageRating), false, 'lg')}
                <div className="text-sm text-muted-foreground">{summary.totalReviews} reviews</div>
              </div>
              <Separator orientation="vertical" className="h-16" />
              <div className="flex-1">
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(stars => (
                    <div key={stars} className="flex items-center space-x-2">
                      <span className="text-sm w-8">{stars}★</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-400 transition-all duration-300"
                          style={{ width: `${getPercentage(summary.distribution[stars as keyof typeof summary.distribution], summary.totalReviews)}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">
                        {summary.distribution[stars as keyof typeof summary.distribution]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Form */}
      {user && !showReviewForm && (
        <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
          <CardContent className="p-4">
            <Button 
              onClick={() => setShowReviewForm(true)}
              className="w-full"
              variant="outline"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Write a Review
            </Button>
          </CardContent>
        </Card>
      )}

      {showReviewForm && (
        <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
          <CardHeader>
            <CardTitle>
              {editingReview ? 'Edit Review' : 'Write a Review'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Rating</label>
              {renderStars(rating, true, 'lg')}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Comment</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                className="min-h-[100px]"
                maxLength={1000}
              />
              <div className="text-xs text-muted-foreground mt-1">
                {comment.length}/1000 characters
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleSubmitReview}
                disabled={submitting || rating === 0 || comment.trim().length < 10}
                className="flex-1"
              >
                <Send className="h-4 w-4 mr-2" />
                {submitting ? 'Submitting...' : editingReview ? 'Update Review' : 'Submit Review'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowReviewForm(false)
                  setEditingReview(null)
                  setRating(0)
                  setComment('')
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Customer Reviews</CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="highest">Highest Rated</SelectItem>
                  <SelectItem value="lowest">Lowest Rated</SelectItem>
                  <SelectItem value="helpful">Most Helpful</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="p-4 bg-secondary/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.user.avatar} alt={review.userName} />
                      <AvatarFallback>{review.userName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium">{review.userName}</span>
                        {review.isVerified && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                            <Package className="h-3 w-3 mr-1" />
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        {renderStars(review.rating, false, 'sm')}
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                      <div className="flex items-center space-x-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => handleMarkHelpful(review._id)}
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          Helpful ({review.helpful})
                        </Button>
                        {user && user._id === review.user._id && (
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs"
                              onClick={() => handleEditReview(review)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteReview(review._id)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
