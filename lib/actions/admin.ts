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

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Update user role
      const user = await tx.user.update({
        where: { id: userId },
        data: { role },
        include: { seller: true }
      })

      // If changing to SELLER and no seller profile exists, create one
      if (role === 'SELLER' && !user.seller) {
        await tx.seller.create({
          data: {
            userId: user.id,
            storeName: `${user.firstName} ${user.lastName}'s Store`,
            storeDescription: 'Welcome to my store!',
            sellerType: 'INDIVIDUAL'
          }
        })

        // Fetch updated user with seller profile
        return await tx.user.findUnique({
          where: { id: userId },
          include: { seller: true }
        })
      }

      return user
    })

    return result
  } catch (error) {
    console.error('Error updating user role:', error)
    throw new Error('Failed to update user role')
  }
}

// Delete user
export async function deleteUser(userId: string) {
  await requireAdmin()

  await prisma.user.delete({
    where: { id: userId }
  })

  return { success: true }
}

// Create missing seller profiles for users with SELLER role
export async function createMissingSellerProfiles() {
  await requireAdmin()

  try {
    // Find users with SELLER role but no seller profile
    const sellersWithoutProfile = await prisma.user.findMany({
      where: {
        role: 'SELLER',
        seller: null
      }
    })

    const results = []
    for (const user of sellersWithoutProfile) {
      const seller = await prisma.seller.create({
        data: {
          userId: user.id,
          storeName: `${user.firstName} ${user.lastName}'s Store`,
          storeDescription: 'Welcome to my store!',
          sellerType: 'INDIVIDUAL'
        }
      })
      results.push(seller)
    }

    return {
      success: true,
      created: results.length,
      sellers: results
    }
  } catch (error) {
    console.error('Error creating missing seller profiles:', error)
    return {
      success: false,
      error: 'Failed to create missing seller profiles'
    }
  }
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

// Get all orders for admin
export async function getAllOrders() {
  await requireAdmin()

  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              include: {
                seller: {
                  include: {
                    user: {
                      select: {
                        name: true
                      }
                    }
                  }
                },
                images: {
                  take: 1,
                  orderBy: { order: 'asc' }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { success: true, orders }
  } catch (error) {
    console.error('Error fetching all orders:', error)
    return { success: false, error: 'Failed to fetch orders' }
  }
}
