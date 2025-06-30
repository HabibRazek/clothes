'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Users,
  Store,
  ShoppingBag,
  Package,
  TrendingUp,
  UserCheck,
  BarChart3,
  Settings,
  Shield,
  Bell,
  Search,
  Menu,
  X,
  Home,
  FileText,
  CreditCard,
  MessageSquare,
  HelpCircle,
  LogOut,
  ChevronRight,
  Activity,
  DollarSign,
  Eye,
  Filter
} from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'

interface AdminStats {
  totalUsers: number
  totalSellers: number
  totalBuyers: number
  totalProducts: number
  totalOrders: number
  recentUsers: Array<{
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
    createdAt: string
  }>
  recentOrders: Array<{
    id: string
    total: number
    status: string
    user: {
      firstName: string
      lastName: string
    }
  }>
}

interface AdminDashboardLayoutProps {
  stats: AdminStats
}

const sidebarItems = [
  { icon: Home, label: 'Dashboard', href: '/admin', active: true },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: Store, label: 'Sellers', href: '/admin/sellers' },
  { icon: Package, label: 'Products', href: '/admin/products' },
  { icon: ShoppingBag, label: 'Orders', href: '/admin/orders' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
  { icon: CreditCard, label: 'Payments', href: '/admin/payments' },
  { icon: MessageSquare, label: 'Support', href: '/admin/support' },
  { icon: FileText, label: 'Reports', href: '/admin/reports' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
]

export default function AdminDashboardLayout({ stats }: AdminDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      change: '+12%',
      changeType: 'positive',
      color: 'from-[#09B1BA] to-[#078A91]'
    },
    {
      title: 'Active Sellers',
      value: stats.totalSellers,
      icon: Store,
      change: '+8%',
      changeType: 'positive',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Total Buyers',
      value: stats.totalBuyers,
      icon: UserCheck,
      change: '+15%',
      changeType: 'positive',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Products Listed',
      value: stats.totalProducts,
      icon: Package,
      change: '+23%',
      changeType: 'positive',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      change: '+18%',
      changeType: 'positive',
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Revenue',
      value: '€24,580',
      icon: DollarSign,
      change: '+25%',
      changeType: 'positive',
      color: 'from-green-500 to-green-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
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

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    item.active
                      ? 'bg-gradient-to-r from-[#09B1BA] to-[#078A91] text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-[#09B1BA]'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${item.active ? 'text-white' : 'text-gray-500 group-hover:text-[#09B1BA]'}`} />
                  {item.label}
                  {item.active && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
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
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, manage your marketplace</p>
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

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`}></div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.change}
                      </Badge>
                      <span className="text-xs text-gray-500">from last month</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <Link href="/admin/users">
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-[#09B1BA] to-[#078A91] rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#09B1BA] transition-colors">Manage Users</h3>
                      <p className="text-sm text-gray-600">View and manage all users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/sellers">
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Store className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">Manage Sellers</h3>
                      <p className="text-sm text-gray-600">Seller verification & management</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/products">
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Manage Products</h3>
                      <p className="text-sm text-gray-600">Product listings & moderation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/orders">
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <ShoppingBag className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">Manage Orders</h3>
                      <p className="text-sm text-gray-600">Order tracking & support</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">Recent Users</CardTitle>
                    <CardDescription>Latest user registrations</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[#09B1BA] hover:text-[#078A91]">
                    <Eye className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {stats.recentUsers.map((user, index) => (
                    <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-500 text-white text-sm">
                              {user.firstName[0]}{user.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            user.role === 'SELLER' ? 'default' :
                            user.role === 'ADMIN' ? 'destructive' : 'secondary'
                          } className={
                            user.role === 'SELLER' ? 'bg-green-100 text-green-700 border-green-200' :
                            user.role === 'ADMIN' ? 'bg-red-100 text-red-700 border-red-200' :
                            'bg-blue-100 text-blue-700 border-blue-200'
                          }>
                            {user.role}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">Recent Orders</CardTitle>
                    <CardDescription>Latest order activity</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[#09B1BA] hover:text-[#078A91]">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {stats.recentOrders.map((order, index) => (
                    <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#09B1BA] to-[#078A91] rounded-lg flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Order #{order.id.slice(-8)}</p>
                            <p className="text-sm text-gray-600">{order.user.firstName} {order.user.lastName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">€{order.total.toFixed(2)}</p>
                          <Badge variant={
                            order.status === 'DELIVERED' ? 'default' :
                            order.status === 'CANCELLED' ? 'destructive' : 'secondary'
                          } className={
                            order.status === 'DELIVERED' ? 'bg-green-100 text-green-700 border-green-200' :
                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-700 border-red-200' :
                            'bg-yellow-100 text-yellow-700 border-yellow-200'
                          }>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
