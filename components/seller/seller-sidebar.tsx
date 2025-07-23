'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Home,
  Package,
  ShoppingBag,
  BarChart3,
  Settings,
  Store,
  Bell,
  Menu,
  X,
  FileText,
  CreditCard,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Plus,
  Eye
} from 'lucide-react'

const sidebarItems = [
  { icon: Home, label: 'Dashboard', href: '/seller' },
  { icon: Package, label: 'My Products', href: '/seller/products' },
  { icon: Plus, label: 'Add Product', href: '/seller/products/new' },
  { icon: ShoppingBag, label: 'Orders', href: '/seller/orders' },
  { icon: BarChart3, label: 'Analytics', href: '/seller/analytics' },
  { icon: CreditCard, label: 'Earnings', href: '/seller/earnings' },
  { icon: MessageSquare, label: 'Messages', href: '/seller/messages' },
  { icon: FileText, label: 'Reports', href: '/seller/reports' },
  { icon: Settings, label: 'Settings', href: '/seller/settings' },
]

interface SellerSidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
  isMobileOpen: boolean
  setIsMobileOpen: (open: boolean) => void
}

export default function SellerSidebar({ 
  isCollapsed, 
  setIsCollapsed, 
  isMobileOpen, 
  setIsMobileOpen 
}: SellerSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 bg-white shadow-xl border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? 'lg:w-16' : 'lg:w-64'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#09B1BA] to-[#078A91] rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Seller Panel</span>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 bg-gradient-to-br from-[#09B1BA] to-[#078A91] rounded-lg flex items-center justify-center mx-auto">
              <Store className="w-5 h-5 text-white" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-6 px-3 overflow-y-auto">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-[#09B1BA] to-[#078A91] text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-[#09B1BA]'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${
                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#09B1BA]'
                  }`} />
                  {!isCollapsed && (
                    <>
                      {item.label}
                      {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div className="mt-auto p-4 border-t border-gray-200">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-[#09B1BA] to-[#078A91] rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">SE</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Seller User</p>
                <p className="text-xs text-gray-500 truncate">seller@clothes.com</p>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-600">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex justify-center">
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-600">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#09B1BA] to-[#078A91] rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Seller Panel</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 mt-6 px-3 overflow-y-auto">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
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

        {/* Mobile User Profile */}
        <div className="mt-auto p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-[#09B1BA] to-[#078A91] rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">SE</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Seller User</p>
              <p className="text-xs text-gray-500 truncate">seller@clothes.com</p>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-600">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}
