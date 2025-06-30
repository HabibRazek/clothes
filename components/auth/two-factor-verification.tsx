'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { useTranslations } from 'next-intl'
import { Link } from '../../i18n/navigation'
import { ArrowLeft, Shield, Smartphone, Key, Loader2 } from 'lucide-react'
import { twoFactorLoginAction, type TwoFactorLoginFormData } from '@/lib/actions/auth'
import { toast } from 'sonner'

interface TwoFactorVerificationProps {
  email: string
  password: string
  onBack: () => void
}

export default function TwoFactorVerification({ email, password, onBack }: TwoFactorVerificationProps) {
  const t = useTranslations('Auth')
  const [isPending, startTransition] = useTransition()
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [useBackupCode, setUseBackupCode] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!twoFactorCode.trim()) {
      toast.error('Please enter your verification code')
      return
    }

    const formData: TwoFactorLoginFormData = {
      email,
      password,
      twoFactorCode: twoFactorCode.trim()
    }

    startTransition(async () => {
      try {
        const result = await twoFactorLoginAction(formData)

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
        console.error('2FA verification error:', error)
      }
    })
  }

  const handleCodeChange = (value: string) => {
    // Handle different input types
    let sanitized: string

    if (useBackupCode) {
      // Allow alphanumeric and hyphens for backup codes
      sanitized = value.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase()
    } else {
      // Allow only numbers for TOTP codes (OTP input handles this automatically)
      sanitized = value.replace(/\D/g, '')
    }

    setTwoFactorCode(sanitized)

    // Clear errors when user starts typing
    if (errors.twoFactorCode) {
      setErrors(prev => ({ ...prev, twoFactorCode: [] }))
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Shield className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Two-Factor Authentication</CardTitle>
        <CardDescription>
          Enter the verification code from your authenticator app
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Info */}
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Signing in as:</p>
          <p className="font-medium text-gray-900">{email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Code Input */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2 justify-center">
              {useBackupCode ? (
                <>
                  <Key className="h-4 w-4" />
                  Backup Code
                </>
              ) : (
                <>
                  <Smartphone className="h-4 w-4" />
                  Verification Code
                </>
              )}
            </Label>

            {useBackupCode ? (
              /* Backup Code Input */
              <div className="space-y-2">
                <Input
                  value={twoFactorCode}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  placeholder="XXXX-XXXX"
                  maxLength={9}
                  className="text-center text-lg font-mono tracking-wider"
                  autoComplete="one-time-code"
                  autoFocus
                />
                {errors.twoFactorCode && (
                  <p className="text-sm text-red-600 text-center">{errors.twoFactorCode[0]}</p>
                )}
              </div>
            ) : (
              /* TOTP Code Input with OTP component */
              <div className="space-y-2">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(value) => handleCodeChange(value)}
                    autoFocus
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                      <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                      <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                    </InputOTPGroup>
                    <div className="flex items-center justify-center w-4">
                      <div className="w-2 h-0.5 bg-gray-300 rounded-full"></div>
                    </div>
                    <InputOTPGroup>
                      <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                      <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                      <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {errors.twoFactorCode && (
                  <p className="text-sm text-red-600 text-center">{errors.twoFactorCode[0]}</p>
                )}
                <p className="text-xs text-gray-500 text-center">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-[#09B1BA] hover:bg-[#078A91]"
            disabled={isPending || !twoFactorCode.trim() || (useBackupCode ? twoFactorCode.length < 8 : twoFactorCode.length < 6)}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify & Sign In'
            )}
          </Button>
        </form>

        <Separator />

        {/* Backup Code Toggle */}
        <div className="text-center space-y-3">
          <button
            type="button"
            onClick={() => {
              setUseBackupCode(!useBackupCode)
              setTwoFactorCode('')
              setErrors({})
            }}
            className="text-sm text-[#09B1BA] hover:text-[#078A91] underline"
          >
            {useBackupCode
              ? 'Use authenticator app instead'
              : 'Use backup code instead'
            }
          </button>

          {useBackupCode && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                Backup codes are single-use. Each code can only be used once.
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Back Button */}
        <div className="text-center">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </button>
        </div>

        {/* Help Text */}
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500">
            Having trouble? Make sure your device's time is correct.
          </p>
          <Link
            href="/help/2fa"
            className="text-xs text-[#09B1BA] hover:text-[#078A91] underline"
          >
            Need help with 2FA?
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
