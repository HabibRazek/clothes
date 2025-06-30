'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Eye, EyeOff, Key, Loader2, Shield, CheckCircle, AlertTriangle } from 'lucide-react'
import { changePasswordAction, type ChangePasswordFormData } from '@/lib/actions/auth'

export default function PasswordChangeForm() {
  const [isPending, startTransition] = useTransition()
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const handleInputChange = (field: keyof ChangePasswordFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: [] }))
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    startTransition(async () => {
      try {
        const result = await changePasswordAction(formData)

        if (result.success) {
          toast.success(result.message)
          // Reset form
          setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          })
        } else {
          if (result.errors) {
            setErrors(result.errors)
          }
          toast.error(result.message)
        }
      } catch (error) {
        toast.error('An unexpected error occurred')
        console.error('Password change error:', error)
      }
    })
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' }
    if (password.length < 6) return { strength: 1, label: 'Too short', color: 'text-red-500' }
    if (password.length < 8) return { strength: 2, label: 'Weak', color: 'text-orange-500' }
    if (password.length < 12) return { strength: 3, label: 'Good', color: 'text-yellow-500' }
    return { strength: 4, label: 'Strong', color: 'text-green-500' }
  }

  const passwordStrength = getPasswordStrength(formData.newPassword)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Key className="h-5 w-5" />
          Change Password
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-sm font-medium">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                placeholder="Enter your current password"
                className={`pr-10 ${errors.currentPassword?.length ? 'border-red-500' : ''}`}
                disabled={isPending}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isPending}
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {errors.currentPassword[0]}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                placeholder="Enter your new password"
                className={`pr-10 ${errors.newPassword?.length ? 'border-red-500' : ''}`}
                disabled={isPending}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isPending}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.strength === 1 ? 'bg-red-500 w-1/4' :
                        passwordStrength.strength === 2 ? 'bg-orange-500 w-2/4' :
                        passwordStrength.strength === 3 ? 'bg-yellow-500 w-3/4' :
                        passwordStrength.strength === 4 ? 'bg-green-500 w-full' : 'w-0'
                      }`}
                    />
                  </div>
                  <span className={`text-xs font-medium ${passwordStrength.color}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Password should be at least 8 characters long with a mix of letters, numbers, and symbols
                </p>
              </div>
            )}
            {errors.newPassword && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {errors.newPassword[0]}
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm your new password"
                className={`pr-10 ${errors.confirmPassword?.length ? 'border-red-500' : ''}`}
                disabled={isPending}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isPending}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {/* Password Match Indicator */}
            {formData.confirmPassword && (
              <div className="flex items-center gap-1 text-xs">
                {formData.newPassword === formData.confirmPassword ? (
                  <>
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">Passwords match</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                    <span className="text-red-500">Passwords don't match</span>
                  </>
                )}
              </div>
            )}
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {errors.confirmPassword[0]}
              </p>
            )}
          </div>

          {/* Security Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-2">Password Security Tips</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Use at least 8 characters</li>
                  <li>• Include uppercase and lowercase letters</li>
                  <li>• Add numbers and special characters</li>
                  <li>• Avoid common words or personal information</li>
                  <li>• Don't reuse passwords from other accounts</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              type="submit"
              disabled={isPending || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
              className="bg-[#09B1BA] hover:bg-[#078A91] min-w-[140px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing...
                </>
              ) : (
                <>
                  <Key className="mr-2 h-4 w-4" />
                  Change Password
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
