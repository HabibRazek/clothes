import { Prisma } from '@prisma/client'

// User with seller relation for admin dashboard
export type UserWithSeller = Prisma.UserGetPayload<{
  include: {
    seller: true
  }
}>

// Order with relations for admin dashboard
export type OrderWithUserAndItems = Prisma.OrderGetPayload<{
  include: {
    user: true
    items: {
      include: {
        product: true
      }
    }
  }
}>

// Formatted types for dashboard components
export interface DashboardUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  createdAt: string
}

export interface DashboardOrder {
  id: string
  total: number
  status: string
  user: {
    name: string
    email: string
  }
  createdAt: string
}

export interface AdminStats {
  totalUsers: number
  totalSellers: number
  totalBuyers: number
  totalProducts: number
  totalOrders: number
  recentUsers: DashboardUser[]
  recentOrders: DashboardOrder[]
}
