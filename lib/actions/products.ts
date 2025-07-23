'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getCurrentUser } from './auth'

// Helper function to require seller access
async function requireSeller() {
  const user = await getCurrentUser()
  if (!user || (user.role !== 'SELLER' && user.role !== 'ADMIN')) {
    throw new Error('Seller access required')
  }
  return user
}

// Get seller's products
export async function getSellerProducts(page = 1, limit = 10, search = '') {
  const user = await requireSeller()
  
  try {
    // Get seller profile
    const seller = await prisma.seller.findUnique({
      where: { userId: user.id }
    })

    if (!seller) {
      throw new Error('Seller profile not found')
    }

    const skip = (page - 1) * limit
    
    const where = {
      sellerId: seller.id,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
          { brand: { contains: search, mode: 'insensitive' as const } }
        ]
      })
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: {
            orderBy: { order: 'asc' }
          },
          _count: {
            select: {
              reviews: true,
              favorites: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    const pages = Math.ceil(total / limit)

    return {
      products,
      total,
      pages,
      currentPage: page
    }
  } catch (error) {
    console.error('Error fetching seller products:', error)
    throw new Error('Failed to fetch products')
  }
}

// Get product by ID (for seller)
export async function getSellerProductById(id: string) {
  const user = await requireSeller()
  
  try {
    const seller = await prisma.seller.findUnique({
      where: { userId: user.id }
    })

    if (!seller) {
      throw new Error('Seller profile not found')
    }

    const product = await prisma.product.findFirst({
      where: {
        id,
        sellerId: seller.id
      },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' }
        },
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                image: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            reviews: true,
            favorites: true
          }
        }
      }
    })

    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    throw new Error('Failed to fetch product')
  }
}

// Create product
export async function createProduct(formData: FormData) {
  const user = await requireSeller()

  try {
    const seller = await prisma.seller.findUnique({
      where: { userId: user.id }
    })

    if (!seller) {
      throw new Error('Seller profile not found')
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const originalPrice = formData.get('originalPrice') ? parseFloat(formData.get('originalPrice') as string) : null
    const categoryId = formData.get('categoryId') as string
    const condition = formData.get('condition') as any
    const size = formData.get('size') as string || null
    const brand = formData.get('brand') as string || null
    const color = formData.get('color') as string || null
    const material = formData.get('material') as string || null
    const gender = formData.get('gender') as any || null
    const season = formData.get('season') as any || null
    const style = formData.get('style') as string || null
    const location = formData.get('location') as string || null
    const shippingCost = formData.get('shippingCost') ? parseFloat(formData.get('shippingCost') as string) : null
    const canDeliver = formData.get('canDeliver') === 'true'
    const canPickup = formData.get('canPickup') === 'true'
    const tags = formData.get('tags') ? (formData.get('tags') as string).split(',').map(tag => tag.trim()) : []

    const product = await prisma.product.create({
      data: {
        sellerId: seller.id,
        categoryId,
        title,
        description,
        price,
        originalPrice,
        condition,
        size,
        brand,
        color,
        material,
        gender,
        season,
        style,
        location,
        shippingCost,
        canDeliver,
        canPickup,
        tags,
        status: 'PENDING_APPROVAL'
      }
    })

    revalidatePath('/dashboard/products')
    return { success: true, product }
  } catch (error) {
    console.error('Error creating product:', error)
    return { success: false, error: 'Failed to create product' }
  }
}

// Update product
export async function updateProduct(id: string, formData: FormData) {
  const user = await requireSeller()

  try {
    const seller = await prisma.seller.findUnique({
      where: { userId: user.id }
    })

    if (!seller) {
      throw new Error('Seller profile not found')
    }

    // Verify product belongs to seller
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        sellerId: seller.id
      }
    })

    if (!existingProduct) {
      throw new Error('Product not found or access denied')
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const originalPrice = formData.get('originalPrice') ? parseFloat(formData.get('originalPrice') as string) : null
    const categoryId = formData.get('categoryId') as string
    const condition = formData.get('condition') as any
    const size = formData.get('size') as string || null
    const brand = formData.get('brand') as string || null
    const color = formData.get('color') as string || null
    const material = formData.get('material') as string || null
    const gender = formData.get('gender') as any || null
    const season = formData.get('season') as any || null
    const style = formData.get('style') as string || null
    const location = formData.get('location') as string || null
    const shippingCost = formData.get('shippingCost') ? parseFloat(formData.get('shippingCost') as string) : null
    const canDeliver = formData.get('canDeliver') === 'true'
    const canPickup = formData.get('canPickup') === 'true'
    const tags = formData.get('tags') ? (formData.get('tags') as string).split(',').map(tag => tag.trim()) : []

    const product = await prisma.product.update({
      where: { id },
      data: {
        categoryId,
        title,
        description,
        price,
        originalPrice,
        condition,
        size,
        brand,
        color,
        material,
        gender,
        season,
        style,
        location,
        shippingCost,
        canDeliver,
        canPickup,
        tags
      }
    })

    revalidatePath('/dashboard/products')
    return { success: true, product }
  } catch (error) {
    console.error('Error updating product:', error)
    return { success: false, error: 'Failed to update product' }
  }
}

// Delete product
export async function deleteProduct(id: string) {
  const user = await requireSeller()

  try {
    const seller = await prisma.seller.findUnique({
      where: { userId: user.id }
    })

    if (!seller) {
      throw new Error('Seller profile not found')
    }

    // Verify product belongs to seller
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        sellerId: seller.id
      },
      include: {
        _count: {
          select: {
            orderItems: true
          }
        }
      }
    })

    if (!existingProduct) {
      throw new Error('Product not found or access denied')
    }

    if (existingProduct._count.orderItems > 0) {
      return { success: false, error: 'Cannot delete product with existing orders' }
    }

    // Delete product images first
    await prisma.productImage.deleteMany({
      where: { productId: id }
    })

    // Delete the product
    await prisma.product.delete({
      where: { id }
    })

    revalidatePath('/dashboard/products')
    return { success: true }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { success: false, error: 'Failed to delete product' }
  }
}

// Toggle product status
export async function toggleProductStatus(id: string) {
  const user = await requireSeller()

  try {
    const seller = await prisma.seller.findUnique({
      where: { userId: user.id }
    })

    if (!seller) {
      throw new Error('Seller profile not found')
    }

    const product = await prisma.product.findFirst({
      where: {
        id,
        sellerId: seller.id
      }
    })

    if (!product) {
      throw new Error('Product not found or access denied')
    }

    const newStatus = product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        status: newStatus
      }
    })

    revalidatePath('/dashboard/products')
    return { success: true, product: updatedProduct }
  } catch (error) {
    console.error('Error toggling product status:', error)
    return { success: false, error: 'Failed to toggle product status' }
  }
}

// Get all products for public display (landing page)
export async function getPublicProducts(params?: {
  categoryId?: string
  search?: string
  limit?: number
  offset?: number
  featured?: boolean
}) {
  try {
    const { categoryId, search, limit = 20, offset = 0, featured = false } = params || {}

    const where: any = {
      status: 'ACTIVE'
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (featured) {
      where.isFeatured = true
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        seller: {
          include: {
            user: {
              select: {
                name: true,
                image: true
              }
            }
          }
        },
        category: true,
        images: {
          orderBy: { order: 'asc' },
          take: 1 // Only get the first image for listing
        },
        _count: {
          select: {
            reviews: true,
            favorites: true
          }
        }
      },
      orderBy: featured ? { createdAt: 'desc' } : { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    return { success: true, products }
  } catch (error) {
    console.error('Error fetching public products:', error)
    return { success: false, error: 'Failed to fetch products' }
  }
}

// Get product by ID for public view
export async function getPublicProductById(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        status: 'ACTIVE'
      },
      include: {
        seller: {
          include: {
            user: {
              select: {
                name: true,
                image: true
              }
            }
          }
        },
        category: true,
        images: {
          orderBy: { order: 'asc' }
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            reviews: true,
            favorites: true
          }
        }
      }
    })

    if (!product) {
      return { success: false, error: 'Product not found' }
    }

    // Increment view count
    await prisma.product.update({
      where: { id: productId },
      data: {
        views: {
          increment: 1
        }
      }
    })

    return { success: true, product }
  } catch (error) {
    console.error('Error fetching product:', error)
    return { success: false, error: 'Failed to fetch product' }
  }
}
