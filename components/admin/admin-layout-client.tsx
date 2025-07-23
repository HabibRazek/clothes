'use client'

import React, { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Menu, Search, Bell, HelpCircle } from 'lucide-react'

interface AdminLayoutClientProps {
  children: React.ReactNode
}

export default function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed')
    if (saved) {
      setIsCollapsed(JSON.parse(saved))
    }
  }, [])

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('admin-sidebar-collapsed', JSON.stringify(isCollapsed))
  }, [isCollapsed])

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        isCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        {/* Top Header Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-gray-100"
                onClick={() => setIsMobileOpen(true)}
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 w-64 h-10 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#09B1BA] focus:ring-1 focus:ring-[#09B1BA] outline-none"
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
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
