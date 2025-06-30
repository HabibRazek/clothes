"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useTranslations } from 'next-intl'
import { Link, useRouter } from "../../i18n/navigation"
import { Eye, EyeOff, Store, Package, TrendingUp, Shield, MapPin, Phone, User, Mail, Lock, CheckCircle, Loader2 } from "lucide-react"
import { sellerRegistrationAction, type SellerRegistrationFormData } from "@/lib/actions/auth"
import { toast } from "sonner"

export default function SellPage() {
  const t = useTranslations('SellPage')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [formData, setFormData] = useState<SellerRegistrationFormData>({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',

    // Address Information
    address: '',
    city: '',
    postalCode: '',
    country: 'France',

    // Seller Information
    storeName: '',
    storeDescription: '',
    sellerType: 'INDIVIDUAL',
    businessNumber: '',

    // Preferences
    agreeToTerms: false,
    agreeToMarketing: false,
    agreeToSellerTerms: false
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev: SellerRegistrationFormData) => ({ ...prev, [field]: value }))
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: [] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      // Final submission - create seller account
      startTransition(async () => {
        try {
          const result = await sellerRegistrationAction(formData)

          if (result.success) {
            toast.success(result.message)
            if (result.redirectTo) {
              router.push(result.redirectTo)
            }
          } else {
            toast.error(result.message)
            if (result.errors) {
              setErrors(result.errors)
              // Go back to first step if there are validation errors
              setCurrentStep(1)
            }
          }
        } catch (error) {
          toast.error('An unexpected error occurred')
          console.error('Seller registration error:', error)
        }
      })
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
            step === currentStep
              ? 'bg-[#09B1BA] text-white'
              : step < currentStep
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600'
          }`}>
            {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
          </div>
          {step < 3 && (
            <div className={`w-16 h-1 mx-2 ${
              step < currentStep ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-[#09B1BA] to-[#078A91] rounded-full flex items-center justify-center mx-auto mb-4">
          <Store className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('becomeSellerTitle')}</h2>
        <p className="text-gray-600">{t('becomeSellerSubtitle')}</p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <TrendingUp className="w-8 h-8 text-[#09B1BA] mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900 mb-1">{t('benefit1Title')}</h3>
          <p className="text-sm text-gray-600">{t('benefit1Description')}</p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900 mb-1">{t('benefit2Title')}</h3>
          <p className="text-sm text-gray-600">{t('benefit2Description')}</p>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <Package className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900 mb-1">{t('benefit3Title')}</h3>
          <p className="text-sm text-gray-600">{t('benefit3Description')}</p>
        </div>
      </div>

      {/* Personal Information Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              <User className="w-4 h-4 inline mr-2" />
              {t('firstName')}
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder={t('firstNamePlaceholder')}
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={errors.firstName ? 'border-red-500' : ''}
              required
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">{t('lastName')}</Label>
            <Input
              id="lastName"
              type="text"
              placeholder={t('lastNamePlaceholder')}
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            <Mail className="w-4 h-4 inline mr-2" />
            {t('email')}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={t('emailPlaceholder')}
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={errors.email ? 'border-red-500' : ''}
            required
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            <Phone className="w-4 h-4 inline mr-2" />
            {t('phone')}
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder={t('phonePlaceholder')}
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">
              <Lock className="w-4 h-4 inline mr-2" />
              {t('password')}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t('passwordPlaceholder')}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t('confirmPasswordPlaceholder')}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#09B1BA] hover:bg-[#078A91] text-white h-12 mt-6"
        >
          {t('continueToStep2')}
        </Button>
      </form>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-[#09B1BA] to-[#078A91] rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('addressInfoTitle')}</h2>
        <p className="text-gray-600">{t('addressInfoSubtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">{t('address')}</Label>
          <Input
            id="address"
            type="text"
            placeholder={t('addressPlaceholder')}
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">{t('city')}</Label>
            <Input
              id="city"
              type="text"
              placeholder={t('cityPlaceholder')}
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode">{t('postalCode')}</Label>
            <Input
              id="postalCode"
              type="text"
              placeholder={t('postalCodePlaceholder')}
              value={formData.postalCode}
              onChange={(e) => handleInputChange('postalCode', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">{t('country')}</Label>
          <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('selectCountry')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="France">France</SelectItem>
              <SelectItem value="Belgium">Belgique</SelectItem>
              <SelectItem value="Switzerland">Suisse</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            className="flex-1"
          >
            {t('previous')}
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-[#09B1BA] hover:bg-[#078A91] text-white"
          >
            {t('continueToStep3')}
          </Button>
        </div>
      </form>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-[#09B1BA] to-[#078A91] rounded-full flex items-center justify-center mx-auto mb-4">
          <Store className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('storeInfoTitle')}</h2>
        <p className="text-gray-600">{t('storeInfoSubtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="storeName">{t('storeName')}</Label>
          <Input
            id="storeName"
            type="text"
            placeholder={t('storeNamePlaceholder')}
            value={formData.storeName}
            onChange={(e) => handleInputChange('storeName', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="storeDescription">{t('storeDescription')}</Label>
          <Textarea
            id="storeDescription"
            placeholder={t('storeDescriptionPlaceholder')}
            value={formData.storeDescription}
            onChange={(e) => handleInputChange('storeDescription', e.target.value)}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sellerType">{t('sellerType')}</Label>
          <Select value={formData.sellerType} onValueChange={(value) => handleInputChange('sellerType', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('selectSellerType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INDIVIDUAL">{t('individual')}</SelectItem>
              <SelectItem value="BUSINESS">{t('business')}</SelectItem>
              <SelectItem value="PROFESSIONAL">{t('professional')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.sellerType === 'BUSINESS' && (
          <div className="space-y-2">
            <Label htmlFor="businessNumber">{t('businessNumber')}</Label>
            <Input
              id="businessNumber"
              type="text"
              placeholder={t('businessNumberPlaceholder')}
              value={formData.businessNumber}
              onChange={(e) => handleInputChange('businessNumber', e.target.value)}
            />
          </div>
        )}

        {/* Terms and Conditions */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
              required
            />
            <Label htmlFor="agreeToTerms" className="text-sm text-gray-600 leading-relaxed">
              {t('agreeToTerms')} <Link href="/terms" className="text-[#09B1BA] hover:underline">{t('termsAndConditions')}</Link>
            </Label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="agreeToSellerTerms"
              checked={formData.agreeToSellerTerms}
              onCheckedChange={(checked) => handleInputChange('agreeToSellerTerms', checked as boolean)}
              required
            />
            <Label htmlFor="agreeToSellerTerms" className="text-sm text-gray-600 leading-relaxed">
              {t('agreeToSellerTerms')} <Link href="/seller-terms" className="text-[#09B1BA] hover:underline">{t('sellerTermsAndConditions')}</Link>
            </Label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="agreeToMarketing"
              checked={formData.agreeToMarketing}
              onCheckedChange={(checked) => handleInputChange('agreeToMarketing', checked as boolean)}
            />
            <Label htmlFor="agreeToMarketing" className="text-sm text-gray-600 leading-relaxed">
              {t('agreeToMarketing')}
            </Label>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            className="flex-1"
          >
            {t('previous')}
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-[#09B1BA] hover:bg-[#078A91] text-white"
            disabled={!formData.agreeToTerms || !formData.agreeToSellerTerms || isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              t('createSellerAccount')
            )}
          </Button>
        </div>
      </form>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              {t('title')}
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              {t('subtitle')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {renderStepIndicator()}

            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Already have account link */}
            <div className="text-center pt-6 border-t border-gray-100 mt-8">
              <p className="text-sm text-gray-600">
                {t('alreadyHaveAccount')} <Link href="/login" className="text-[#09B1BA] hover:underline font-medium">{t('signIn')}</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
