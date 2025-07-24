import { Prisma } from '@prisma/client'

// Cart with all relations for cart page
export type CartWithItems = Prisma.CartGetPayload<{
  include: {
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
            }
            images: {
              take: 1
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    }
  }
}>

// Cart item with product details
export type CartItemWithProduct = Prisma.CartItemGetPayload<{
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
        }
        images: {
          take: 1
          orderBy: { order: 'asc' }
        }
      }
    }
  }
}>

// Return types for cart actions
export interface CartActionSuccess {
  success: true
  cart: CartWithItems
}

export interface CartActionError {
  success: false
  error: string
}

export type CartActionResult = CartActionSuccess | CartActionError
