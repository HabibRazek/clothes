"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { useTranslations } from 'next-intl'
import { Link, useRouter } from "../../i18n/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { signupAction, type SignupFormData } from "@/lib/actions/auth"
import { signIn } from "next-auth/react"
import { toast } from "sonner"

export default function SignupForm() {
  const t = useTranslations('Auth')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  const handleInputChange = (field: keyof SignupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: [] }))
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      // Use Auth.js signIn directly for Google with proper callback
      await signIn('google', {
        callbackUrl: '/en',
        redirect: true
      })
    } catch (error) {
      toast.error('Google sign-in failed')
      console.error('Google sign-in error:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    startTransition(async () => {
      try {
        const result = await signupAction(formData)

        if (result.success) {
          toast.success(result.message)
          // Force session refresh and redirect
          window.location.href = result.redirectTo || '/en'
        } else {
          toast.error(result.message)
          if (result.errors) {
            setErrors(result.errors)
          }
        }
      } catch (error) {
        toast.error('An unexpected error occurred')
        console.error('Signup error:', error)
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {t('signupTitle')}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {t('signupSubtitle')}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isPending}
                className="w-full h-12 border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-3"
              >
                {/* Google Icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {t('continueWithGoogle')}
              </Button>


            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  {t('orContinueWith')}
                </span>
              </div>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('firstName')}</Label>
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
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
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
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
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
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>



              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#09B1BA] hover:bg-[#078A91] text-white h-12"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  t('createAccount')
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-100">
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
