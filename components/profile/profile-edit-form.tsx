'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Camera, Save, Loader2, User, Mail, Phone, MapPin, Calendar, AlertTriangle, Shield, Key } from 'lucide-react'
import TwoFactorAuth from './two-factor-auth'

interface ProfileEditFormProps {
  user: {
    id: string
    email: string
    firstName?: string
    lastName?: string
    name?: string
    image?: string
    role: string
    isVerified?: boolean
    phone?: string
    twoFactorEnabled?: boolean
  }
}

export default function ProfileEditForm({ user }: ProfileEditFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    bio: '',
    location: '',
    website: ''
  })

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      try {
        // Here you would call your update profile API
        // const result = await updateProfileAction(formData)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        toast.success('Profile updated successfully!')
        router.refresh()
      } catch (error) {
        toast.error('Failed to update profile')
        console.error('Profile update error:', error)
      }
    })
  }

  const handleImageUpload = () => {
    // Handle image upload logic
    toast.info('Image upload feature coming soon!')
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#09B1BA]/5 to-[#078A91]/5">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Update your personal information and profile picture
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-4 flex-shrink-0">
              <div className="relative">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 ring-4 ring-[#09B1BA]/20">
                  <AvatarImage
                    src={user.image || undefined}
                    alt={user.name || 'User'}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-[#09B1BA] to-[#078A91] text-white text-lg sm:text-xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={handleImageUpload}
                  className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-[#09B1BA] hover:bg-[#078A91] text-white rounded-full p-2 shadow-lg transition-colors"
                >
                  <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
              <div className="text-center">
                <p className="text-sm sm:text-base font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 break-all">{user.email}</p>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                  <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'default'} className="text-xs">
                    {user.role}
                  </Badge>
                  {user.isVerified && (
                    <Badge variant="default" className="bg-green-100 text-green-700 text-xs">
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="flex-1 w-full space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter your first name"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter your last name"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Changing your email will require verification
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="w-full resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, Country"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm font-medium">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-[#09B1BA] hover:bg-[#078A91] w-full sm:w-auto order-1 sm:order-2"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <TwoFactorAuth user={user} />

      {/* Account Security */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Shield className="h-5 w-5" />
            Account Security
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Manage your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-white gap-3">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100">
                <Key className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Password</h3>
                <p className="text-sm text-gray-500">Last changed 3 months ago</p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
              <a href="/settings">
                Change Password
              </a>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-white gap-3">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Login Sessions</h3>
                <p className="text-sm text-gray-500">Manage your active sessions</p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
              <a href="/settings">
                Manage Settings
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="overflow-hidden border-red-200">
        <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50">
          <CardTitle className="text-red-600 flex items-center gap-2 text-lg sm:text-xl">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Irreversible actions for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50 gap-3">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900">Delete Account</h3>
                <p className="text-sm text-red-700">Permanently delete your account and all data</p>
              </div>
            </div>
            <Button variant="destructive" size="sm" className="w-full sm:w-auto">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
