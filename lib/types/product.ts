import { Prisma } from '@prisma/client'

// Product with all relations for product detail page
export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    seller: {
      include: {
        user: {
          select: {
            name: true
            image: true
          }
        }
      }
    }
    category: true
    images: true
    reviews: {
      include: {
        user: {
          select: {
            name: true
            image: true
          }
        }
      }
    }
    _count: {
      select: {
        reviews: true
        favorites: true
      }
    }
  }
}>

// Product for public listing (simplified)
export type ProductPublic = Prisma.ProductGetPayload<{
  include: {
    seller: {
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    }
    images: {
      take: 1
      orderBy: { order: 'asc' }
    }
  }
}>

// Product for seller management
export type ProductForSeller = Prisma.ProductGetPayload<{
  include: {
    category: true
    images: true
    _count: {
      select: {
        reviews: true
        favorites: true
      }
    }
  }
}>

// Formatted product for checkout component
export interface CheckoutProduct {
  id: string
  title: string
  price: number
  shippingCost: number | null
  canDeliver: boolean
  canPickup: boolean
  seller: {
    user: {
      name: string | null
    }
  }
  images: Array<{
    url: string
    altText: string | null
  }>
}

// Product action results
export interface ProductActionSuccess {
  success: true
  product: ProductWithRelations
}

export interface ProductActionError {
  success: false
  error: string
}

export type ProductActionResult = ProductActionSuccess | ProductActionError
