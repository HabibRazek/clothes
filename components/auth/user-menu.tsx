'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogoutButton } from './logout-button'
import { User, Settings, Shield, Store, ChevronDown } from 'lucide-react'
import Link from 'next/link'

export function UserMenu() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="flex items-center space-x-2">
        <Link href="/login">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </Link>
        <Link href="/signup">
          <Button size="sm" className="bg-[#09B1BA] hover:bg-[#078A91]">
            Sign Up
          </Button>
        </Link>
      </div>
    )
  }

  const user = session.user
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-3 h-auto p-2 hover:bg-gray-50 rounded-full">
          <div className="relative">
            <Avatar className="h-10 w-10 ring-2 ring-[#09B1BA] ring-offset-2">
              <AvatarImage
                src={user.image || undefined}
                alt={user.name || 'User'}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-[#09B1BA] to-[#078A91] text-white text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            {user.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </span>
            <span className="text-xs text-gray-500 capitalize">
              {user.role?.toLowerCase()}
            </span>
          </div>
          <ChevronDown className="hidden md:block h-4 w-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72 p-2">
        <DropdownMenuLabel className="p-0">
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-[#09B1BA]/10 to-[#078A91]/10 rounded-lg">
            <Avatar className="h-12 w-12 ring-2 ring-[#09B1BA]/20">
              <AvatarImage
                src={user.image || undefined}
                alt={user.name || 'User'}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-[#09B1BA] to-[#078A91] text-white font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'ADMIN'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : user.role === 'SELLER'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                }`}>
                  {user.role}
                </span>
                {user.isVerified && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-2" />

        <div className="space-y-1">
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center px-3 py-2 rounded-md hover:bg-[#09B1BA]/10 transition-colors">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 mr-3">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Edit Profile</p>
                <p className="text-xs text-gray-500">Update your personal information</p>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center px-3 py-2 rounded-md hover:bg-[#09B1BA]/10 transition-colors">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 mr-3">
                <Settings className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Settings</p>
                <p className="text-xs text-gray-500">Preferences and privacy</p>
              </div>
            </Link>
          </DropdownMenuItem>

          {user.role === 'SELLER' && (
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="flex items-center px-3 py-2 rounded-md hover:bg-[#09B1BA]/10 transition-colors">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 mr-3">
                  <Store className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Seller Dashboard</p>
                  <p className="text-xs text-gray-500">Manage your store</p>
                </div>
              </Link>
            </DropdownMenuItem>
          )}

          {user.role === 'ADMIN' && (
            <DropdownMenuItem asChild>
              <Link href="/admin" className="flex items-center px-3 py-2 rounded-md hover:bg-[#09B1BA]/10 transition-colors">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 mr-3">
                  <Shield className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Admin Dashboard</p>
                  <p className="text-xs text-gray-500">System administration</p>
                </div>
              </Link>
            </DropdownMenuItem>
          )}
        </div>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem asChild>
          <div className="px-3 py-2">
            <LogoutButton variant="ghost" size="sm" className="w-full justify-start p-0 h-auto">
              <div className="flex items-center w-full">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 mr-3">
                  <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900">Sign Out</p>
                  <p className="text-xs text-gray-500">Log out of your account</p>
                </div>
              </div>
            </LogoutButton>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
