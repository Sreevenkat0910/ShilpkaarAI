import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { 
  Upload, 
  ArrowLeft, 
  FileText, 
  Camera, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Award,
  Shield,
  User,
  Palette
} from 'lucide-react'
import { useRouter } from '../router'
import { useAuth } from '../auth/auth-context'
import NavigationHeader from '../navigation-header'
import Footer from '../footer'

export default function ArtisanVerification() {
  const { navigate, goBack } = useRouter()
  const { user, updateProfile } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [verificationData, setVerificationData] = useState({
    idType: '',
    idNumber: '',
    craftDescription: '',
    experienceDescription: '',
    workshopDescription: '',
    idDocument: null as File | null,
    craftSamples: [] as File[],
    workshopPhotos: [] as File[]
  })

  const steps = [
    { id: 1, title: 'Identity Verification', icon: User },
    { id: 2, title: 'Craft Documentation', icon: Palette },
    { id: 3, title: 'Workshop Photos', icon: Camera },
    { id: 4, title: 'Review & Submit', icon: CheckCircle }
  ]

  const handleFileUpload = (type: 'id' | 'craft' | 'workshop', files: FileList | null) => {
    if (!files) return

    if (type === 'id') {
      setVerificationData({ ...verificationData, idDocument: files[0] })
    } else if (type === 'craft') {
      setVerificationData({ 
        ...verificationData, 
        craftSamples: [...verificationData.craftSamples, ...Array.from(files)]
      })
    } else if (type === 'workshop') {
      setVerificationData({ 
        ...verificationData, 
        workshopPhotos: [...verificationData.workshopPhotos, ...Array.from(files)]
      })
    }
  }

  const handleSubmit = () => {
    // Update user verification status
    updateProfile({ isVerified: false }) // Set to false initially, will be reviewed
    navigate('artisan-dashboard')
  }

  const progress = (currentStep / steps.length) * 100

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
              Artisan Verification
            </h1>
            <p className="text-muted-foreground">
              Complete your verification to start selling authentic handcrafted products
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Verification Progress</h3>
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of {steps.length}
              </span>
            </div>
            <Progress value={progress} className="mb-4" />
            
            <div className="flex justify-between">
              {steps.map((step) => {
                const Icon = step.icon
                const isCompleted = currentStep > step.id
                const isCurrent = currentStep === step.id
                
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isCompleted 
                        ? 'bg-green-100 text-green-600' 
                        : isCurrent 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-muted-foreground'
                    }`}>
                      {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <p className="text-xs text-center font-medium max-w-20">
                      {step.title}
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="max-w-2xl mx-auto">
          {/* Step 1: Identity Verification */}
          {currentStep === 1 && (
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center" style={{ fontFamily: 'Playfair Display, serif' }}>
                  <User className="h-5 w-5 mr-2" />
                  Identity Verification
                </CardTitle>
                <CardDescription>
                  Please provide valid government identification to verify your identity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="idType">ID Document Type</Label>
                  <select 
                    id="idType"
                    value={verificationData.idType}
                    onChange={(e) => setVerificationData({...verificationData, idType: e.target.value})}
                    className="w-full p-3 bg-input-background border border-primary/20 rounded-xl focus:border-primary/40 outline-none"
                  >
                    <option value="">Select ID Type</option>
                    <option value="aadhaar">Aadhaar Card</option>
                    <option value="pan">PAN Card</option>
                    <option value="driving">Driving License</option>
                    <option value="passport">Passport</option>
                    <option value="voter">Voter ID</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idNumber">ID Number</Label>
                  <Input
                    id="idNumber"
                    placeholder="Enter your ID number"
                    value={verificationData.idNumber}
                    onChange={(e) => setVerificationData({...verificationData, idNumber: e.target.value})}
                    className="bg-input-background border-primary/20 focus:border-primary/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upload ID Document</Label>
                  <div className="border-2 border-dashed border-primary/20 rounded-xl p-6 text-center hover:border-primary/40 transition-colors">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload('id', e.target.files)}
                      className="hidden"
                      id="id-upload"
                    />
                    <label htmlFor="id-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG or PDF (max. 5MB)
                      </p>
                    </label>
                  </div>
                  {verificationData.idDocument && (
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <FileText className="h-4 w-4" />
                      <span>{verificationData.idDocument.name}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => setCurrentStep(2)}
                    disabled={!verificationData.idType || !verificationData.idNumber || !verificationData.idDocument}
                  >
                    Next Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Craft Documentation */}
          {currentStep === 2 && (
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center" style={{ fontFamily: 'Playfair Display, serif' }}>
                  <Palette className="h-5 w-5 mr-2" />
                  Craft Documentation
                </CardTitle>
                <CardDescription>
                  Tell us about your craft and showcase your work samples
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="craftDescription">Describe Your Craft</Label>
                  <Textarea
                    id="craftDescription"
                    placeholder="Tell us about your craft specialization, techniques you use, and what makes your work unique..."
                    value={verificationData.craftDescription}
                    onChange={(e) => setVerificationData({...verificationData, craftDescription: e.target.value})}
                    className="bg-input-background border-primary/20 focus:border-primary/40 min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienceDescription">Your Experience & Training</Label>
                  <Textarea
                    id="experienceDescription"
                    placeholder="Describe your experience, training, family tradition, or how you learned your craft..."
                    value={verificationData.experienceDescription}
                    onChange={(e) => setVerificationData({...verificationData, experienceDescription: e.target.value})}
                    className="bg-input-background border-primary/20 focus:border-primary/40 min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upload Craft Samples</Label>
                  <div className="border-2 border-dashed border-primary/20 rounded-xl p-6 text-center hover:border-primary/40 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileUpload('craft', e.target.files)}
                      className="hidden"
                      id="craft-upload"
                    />
                    <label htmlFor="craft-upload" className="cursor-pointer">
                      <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Upload photos of your craft work
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG (max. 5MB each, up to 10 images)
                      </p>
                    </label>
                  </div>
                  {verificationData.craftSamples.length > 0 && (
                    <div className="text-sm text-green-600">
                      <span>{verificationData.craftSamples.length} images uploaded</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Previous
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(3)}
                    disabled={!verificationData.craftDescription || verificationData.craftSamples.length === 0}
                  >
                    Next Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Workshop Photos */}
          {currentStep === 3 && (
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center" style={{ fontFamily: 'Playfair Display, serif' }}>
                  <Camera className="h-5 w-5 mr-2" />
                  Workshop Documentation
                </CardTitle>
                <CardDescription>
                  Show us your workspace and tools to verify authenticity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="workshopDescription">Describe Your Workshop</Label>
                  <Textarea
                    id="workshopDescription"
                    placeholder="Tell us about your workspace, tools you use, and your working environment..."
                    value={verificationData.workshopDescription}
                    onChange={(e) => setVerificationData({...verificationData, workshopDescription: e.target.value})}
                    className="bg-input-background border-primary/20 focus:border-primary/40 min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upload Workshop Photos</Label>
                  <div className="border-2 border-dashed border-primary/20 rounded-xl p-6 text-center hover:border-primary/40 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileUpload('workshop', e.target.files)}
                      className="hidden"
                      id="workshop-upload"
                    />
                    <label htmlFor="workshop-upload" className="cursor-pointer">
                      <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Upload photos of your workshop and tools
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG (max. 5MB each, up to 8 images)
                      </p>
                    </label>
                  </div>
                  {verificationData.workshopPhotos.length > 0 && (
                    <div className="text-sm text-green-600">
                      <span>{verificationData.workshopPhotos.length} images uploaded</span>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">What to include:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Your workspace or workshop area</li>
                    <li>• Tools and equipment you use</li>
                    <li>• Raw materials or work in progress</li>
                    <li>• Any traditional equipment specific to your craft</li>
                  </ul>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    Previous
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(4)}
                    disabled={!verificationData.workshopDescription || verificationData.workshopPhotos.length === 0}
                  >
                    Next Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center" style={{ fontFamily: 'Playfair Display, serif' }}>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Review & Submit
                </CardTitle>
                <CardDescription>
                  Please review your verification information before submitting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Identity Verification</h4>
                    <div className="bg-secondary/20 p-3 rounded-lg text-sm">
                      <p><strong>ID Type:</strong> {verificationData.idType}</p>
                      <p><strong>ID Number:</strong> {verificationData.idNumber}</p>
                      <p><strong>Document:</strong> {verificationData.idDocument?.name}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Craft Information</h4>
                    <div className="bg-secondary/20 p-3 rounded-lg text-sm">
                      <p><strong>Craft Samples:</strong> {verificationData.craftSamples.length} images</p>
                      <p><strong>Description:</strong> {verificationData.craftDescription.substring(0, 100)}...</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Workshop Documentation</h4>
                    <div className="bg-secondary/20 p-3 rounded-lg text-sm">
                      <p><strong>Workshop Photos:</strong> {verificationData.workshopPhotos.length} images</p>
                      <p><strong>Description:</strong> {verificationData.workshopDescription.substring(0, 100)}...</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800 mb-1">Verification Process</h4>
                      <p className="text-sm text-yellow-700">
                        Our team will review your submission within 2-3 business days. 
                        You'll receive an email notification once the review is complete.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(3)}>
                    Previous
                  </Button>
                  <Button onClick={handleSubmit} className="shadow-sm">
                    <Shield className="w-4 h-4 mr-2" />
                    Submit for Verification
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Verification Benefits */}
        <Card className="border-0 bg-gradient-to-r from-primary/5 to-accent/5 card-shadow mt-8">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-primary" />
              Benefits of Verification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start space-x-2">
                <Shield className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Trust Badge</p>
                  <p className="text-muted-foreground">Show customers you're verified</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">Higher Visibility</p>
                  <p className="text-muted-foreground">Appear higher in search results</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Award className="h-4 w-4 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-medium">Premium Features</p>
                  <p className="text-muted-foreground">Access to AI tools and analytics</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}