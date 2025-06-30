'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Palette, 
  Download,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Crown,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import PasswordChangeForm from './password-change-form'
import TwoFactorAuth from '../profile/two-factor-auth'
import Link from 'next/link'

interface SettingsFormProps {
  user: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    name: string | null
    image: string | null
    role: string
    isVerified: boolean
    phone: string | null
    twoFactorEnabled?: boolean
    createdAt: Date
    updatedAt: Date
  }
}

export default function SettingsForm({ user }: SettingsFormProps) {
  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'preferences' | 'privacy'>('account')

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Badge variant="destructive" className="bg-red-500"><Crown className="h-3 w-3 mr-1" />Admin</Badge>
      case 'SELLER':
        return <Badge variant="secondary" className="bg-blue-500 text-white"><User className="h-3 w-3 mr-1" />Seller</Badge>
      default:
        return <Badge variant="outline"><User className="h-3 w-3 mr-1" />Buyer</Badge>
    }
  }

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'privacy', label: 'Privacy', icon: Globe }
  ] as const

  return (
    <div className="space-y-6">
      {/* Account Overview Card */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#09B1BA]/5 to-[#078A91]/5">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Settings className="h-5 w-5" />
            Account Overview
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Your account information and current status
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
                <AvatarFallback className="bg-[#09B1BA] text-white text-lg font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left space-y-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name || 'User'}
                </h3>
                <p className="text-gray-600">{user.email}</p>
              </div>

              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {getRoleBadge(user.role)}
                {user.isVerified ? (
                  <Badge variant="outline" className="border-green-500 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-orange-500 text-orange-700">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Unverified
                  </Badge>
                )}
                {user.twoFactorEnabled && (
                  <Badge variant="outline" className="border-blue-500 text-blue-700">
                    <Shield className="h-3 w-3 mr-1" />
                    2FA Enabled
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Updated {new Date(user.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                <Link href="/profile">
                  <User className="h-4 w-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Navigation */}
      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Sidebar Navigation */}
            <div className="w-full sm:w-64 border-b sm:border-b-0 sm:border-r bg-gray-50">
              <nav className="p-4 space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-[#09B1BA] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-4 sm:p-6">
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Account Information</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Manage your basic account information and profile settings.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Personal Information</h4>
                      <p className="text-sm text-gray-600 mb-3">Update your name, email, and contact details</p>
                      <Button asChild variant="outline" size="sm">
                        <Link href="/profile">
                          <User className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Link>
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Account Status</h4>
                      <p className="text-sm text-gray-600 mb-3">View your verification status and account type</p>
                      <div className="flex gap-2">
                        {getRoleBadge(user.role)}
                        {user.isVerified ? (
                          <Badge variant="outline" className="border-green-500 text-green-700">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-orange-500 text-orange-700">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Unverified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Security Settings</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Manage your password, two-factor authentication, and other security features.
                    </p>
                  </div>

                  {/* Password Change Form */}
                  <PasswordChangeForm />

                  {/* Two-Factor Authentication */}
                  <TwoFactorAuth user={user} />
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Preferences</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Customize your experience with language, theme, and notification settings.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Globe className="h-5 w-5 text-blue-600" />
                        <h4 className="font-medium">Language & Region</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Choose your preferred language and region</p>
                      <Button variant="outline" size="sm" disabled>
                        <Globe className="h-4 w-4 mr-2" />
                        Coming Soon
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Palette className="h-5 w-5 text-purple-600" />
                        <h4 className="font-medium">Theme</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Switch between light and dark themes</p>
                      <Button variant="outline" size="sm" disabled>
                        <Palette className="h-4 w-4 mr-2" />
                        Coming Soon
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Bell className="h-5 w-5 text-green-600" />
                        <h4 className="font-medium">Notifications</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Manage your notification preferences</p>
                      <Button variant="outline" size="sm" disabled>
                        <Bell className="h-4 w-4 mr-2" />
                        Coming Soon
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Download className="h-5 w-5 text-orange-600" />
                        <h4 className="font-medium">Data Export</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Download your account data</p>
                      <Button variant="outline" size="sm" disabled>
                        <Download className="h-4 w-4 mr-2" />
                        Coming Soon
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Privacy Settings</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Control your privacy settings and data sharing preferences.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Profile Visibility</h4>
                      <p className="text-sm text-gray-600 mb-3">Control who can see your profile information</p>
                      <Button variant="outline" size="sm" disabled>
                        Coming Soon
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Data Sharing</h4>
                      <p className="text-sm text-gray-600 mb-3">Manage how your data is shared with third parties</p>
                      <Button variant="outline" size="sm" disabled>
                        Coming Soon
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Account Deletion</h4>
                      <p className="text-sm text-gray-600 mb-3">Permanently delete your account and all associated data</p>
                      <Button variant="destructive" size="sm" disabled>
                        Coming Soon
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
