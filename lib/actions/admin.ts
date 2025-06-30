'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

// Check if user is admin
export async function requireAdmin() {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (user?.role !== 'ADMIN' && user?.email !== process.env.ADMIN_EMAIL) {
    redirect('/')
  }

  return user
}

// Get all users with pagination
export async function getUsers(page = 1, limit = 10, search = '') {
  await requireAdmin()

  const skip = (page - 1) * limit
  
  const where = search ? {
    OR: [
      { email: { contains: search, mode: 'insensitive' as const } },
      { firstName: { contains: search, mode: 'insensitive' as const } },
      { lastName: { contains: search, mode: 'insensitive' as const } },
    ]
  } : {}

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        seller: true,
        addresses: true,
        _count: {
          select: {
            orders: true,
            reviews: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count({ where })
  ])

  return {
    users,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page
  }
}

// Get dashboard stats
export async function getAdminStats() {
  await requireAdmin()

  const [
    totalUsers,
    totalSellers,
    totalBuyers,
    totalProducts,
    totalOrders,
    recentUsers,
    recentOrders
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'SELLER' } }),
    prisma.user.count({ where: { role: 'BUYER' } }),
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { seller: true }
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })
  ])

  return {
    totalUsers,
    totalSellers,
    totalBuyers,
    totalProducts,
    totalOrders,
    recentUsers,
    recentOrders
  }
}

// Update user role
export async function updateUserRole(userId: string, role: 'BUYER' | 'SELLER' | 'ADMIN') {
  await requireAdmin()

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
    include: { seller: true }
  })

  return user
}

// Delete user
export async function deleteUser(userId: string) {
  await requireAdmin()

  await prisma.user.delete({
    where: { id: userId }
  })

  return { success: true }
}

// Verify seller
export async function verifySeller(sellerId: string, verified: boolean) {
  await requireAdmin()

  const seller = await prisma.seller.update({
    where: { id: sellerId },
    data: { isVerified: verified },
    include: { user: true }
  })

  return seller
}

// Get all sellers for admin management
export async function getSellers(page = 1, limit = 10, search = '') {
  await requireAdmin()

  const skip = (page - 1) * limit
  
  const where = search ? {
    OR: [
      { storeName: { contains: search, mode: 'insensitive' as const } },
      { user: {
        OR: [
          { email: { contains: search, mode: 'insensitive' as const } },
          { firstName: { contains: search, mode: 'insensitive' as const } },
          { lastName: { contains: search, mode: 'insensitive' as const } },
        ]
      }}
    ]
  } : {}

  const [sellers, total] = await Promise.all([
    prisma.seller.findMany({
      where,
      include: {
        user: true,
        _count: {
          select: {
            products: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.seller.count({ where })
  ])

  return {
    sellers,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page
  }
}
