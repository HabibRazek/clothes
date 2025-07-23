'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Users,
  Store,
  Package,
  ShoppingBag,
  TrendingUp,
  Eye,
  Filter,
  Wrench,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import { createMissingSellerProfiles } from '@/lib/actions/admin'
import { AdminStats } from '@/lib/types/admin'

interface DashboardContentProps {
  stats: AdminStats
}

export default function DashboardContent({ stats }: DashboardContentProps) {
  const handleFixSellerProfiles = async () => {
    if (!confirm('This will create seller profiles for users with SELLER role who don\'t have one. Continue?')) {
      return
    }

    try {
      const result = await createMissingSellerProfiles()
      if (result.success) {
        alert(`Successfully created ${result.created} seller profiles!`)
      } else {
        alert(result.error || 'Failed to create seller profiles')
      }
    } catch (error) {
      alert('Failed to create seller profiles')
    }
  }
  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+12%',
      color: 'from-[#09B1BA] to-[#078A91]',
      icon: Users,
    },
    {
      title: 'Active Sellers',
      value: stats.totalSellers.toLocaleString(),
      change: '+8%',
      color: 'from-emerald-500 to-emerald-600',
      icon: Store,
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      change: '+23%',
      color: 'from-purple-500 to-purple-600',
      icon: Package,
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      change: '+15%',
      color: 'from-orange-500 to-orange-600',
      icon: ShoppingBag,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#09B1BA] to-[#078A91] rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome to Admin Dashboard</h2>
            <p className="text-blue-100 text-lg">Manage your marketplace with powerful tools and insights</p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <BarChart3 className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`}></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 px-2 py-1">
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
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Link href="/admin/users">
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md bg-white hover:bg-gray-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-gradient-to-br from-[#09B1BA] to-[#078A91] rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-[#09B1BA] transition-colors text-lg">Manage Users</h3>
                    <p className="text-sm text-gray-600">View and manage all users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/sellers">
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md bg-white hover:bg-gray-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Store className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors text-lg">Manage Sellers</h3>
                    <p className="text-sm text-gray-600">Seller verification & management</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/products">
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md bg-white hover:bg-gray-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors text-lg">Manage Products</h3>
                    <p className="text-sm text-gray-600">Product listings & moderation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/orders">
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md bg-white hover:bg-gray-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors text-lg">Manage Orders</h3>
                    <p className="text-sm text-gray-600">Order tracking & support</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">Recent Users</CardTitle>
                  <CardDescription>Latest user registrations</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-[#09B1BA] hover:text-[#078A91] hover:bg-white">
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

          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">Recent Orders</CardTitle>
                  <CardDescription>Latest order activity</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-[#09B1BA] hover:text-[#078A91] hover:bg-white">
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
      </div>

      {/* Maintenance Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">System Maintenance</h3>
        <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Wrench className="h-5 w-5" />
              Administrative Tools
            </CardTitle>
            <CardDescription className="text-orange-700">
              System maintenance and data integrity tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handleFixSellerProfiles}
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-100 hover:border-orange-400 transition-all duration-200"
              >
                <Wrench className="h-4 w-4 mr-2" />
                Fix Seller Profiles
              </Button>
            </div>
            <p className="text-sm text-orange-600 mt-3 bg-orange-100 p-3 rounded-lg">
              <strong>Note:</strong> Creates seller profiles for users with SELLER role who don't have one
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
