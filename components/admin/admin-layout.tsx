'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Home,
  Users,
  Store,
  ShoppingBag,
  Package,
  BarChart3,
  Settings,
  Shield,
  Bell,
  Search,
  Menu,
  X,
  FileText,
  CreditCard,
  MessageSquare,
  HelpCircle,
  LogOut,
  ChevronRight,
  FolderTree
} from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { usePathname } from 'next/navigation'

const sidebarItems = [
  { icon: Home, label: 'Dashboard', href: '/admin' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: Store, label: 'Sellers', href: '/admin/sellers' },
  { icon: Package, label: 'Products', href: '/admin/products' },
  { icon: FolderTree, label: 'Categories', href: '/admin/categories' },
  { icon: ShoppingBag, label: 'Orders', href: '/admin/orders' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
  { icon: CreditCard, label: 'Payments', href: '/admin/payments' },
  { icon: MessageSquare, label: 'Support', href: '/admin/support' },
  { icon: FileText, label: 'Reports', href: '/admin/reports' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
]

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
  description: string
}

export default function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:relative lg:flex lg:flex-col`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#09B1BA] to-[#078A91] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Admin Panel</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="flex-1 mt-6 px-3 overflow-y-auto">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#09B1BA] to-[#078A91] text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-[#09B1BA]'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#09B1BA]'}`} />
                  {item.label}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="mt-auto p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/admin-avatar.jpg" />
              <AvatarFallback className="bg-gradient-to-br from-[#09B1BA] to-[#078A91] text-white">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@clothes.com</p>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-600">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between h-20 px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-gray-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 w-64 bg-gray-50 border-gray-200 focus:border-[#09B1BA] focus:ring-[#09B1BA]"
                />
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>

              {/* Help */}
              <Button variant="ghost" size="icon">
                <HelpCircle className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-50 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
