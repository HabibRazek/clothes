'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from './auth'
import { revalidatePath } from 'next/cache'

// Get or create user's cart
export async function getOrCreateCart() {
  const user = await getCurrentUser()
  
  if (!user) {
    return { success: false, error: 'Authentication required' }
  }

  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
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
                },
                images: {
                  take: 1,
                  orderBy: { order: 'asc' }
                }
              }
            }
          }
        }
      }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id
        },
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
                  },
                  images: {
                    take: 1,
                    orderBy: { order: 'asc' }
                  }
                }
              }
            }
          }
        }
      })
    }

    return { success: true, cart }
  } catch (error) {
    console.error('Error getting cart:', error)
    return { success: false, error: 'Failed to get cart' }
  }
}

// Add item to cart
export async function addToCart(productId: string, quantity: number = 1) {
  const user = await getCurrentUser()
  
  if (!user) {
    return { success: false, error: 'Authentication required' }
  }

  try {
    // Get or create cart
    const cartResult = await getOrCreateCart()
    if (!cartResult.success || !cartResult.cart) {
      return { success: false, error: 'Failed to get cart' }
    }

    const cart = cartResult.cart

    // Check if product exists and is active
    const product = await prisma.product.findUnique({
      where: { 
        id: productId,
        status: 'ACTIVE'
      }
    })

    if (!product) {
      return { success: false, error: 'Product not found or not available' }
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    })

    if (existingItem) {
      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity
        }
      })
      
      revalidatePath('/cart')
      return { success: true, item: updatedItem }
    } else {
      // Create new cart item
      const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        }
      })
      
      revalidatePath('/cart')
      return { success: true, item: newItem }
    }
  } catch (error) {
    console.error('Error adding to cart:', error)
    return { success: false, error: 'Failed to add item to cart' }
  }
}

// Update cart item quantity
export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const user = await getCurrentUser()
  
  if (!user) {
    return { success: false, error: 'Authentication required' }
  }

  try {
    if (quantity <= 0) {
      return removeFromCart(itemId)
    }

    // Verify the item belongs to the user's cart
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId: user.id
        }
      }
    })

    if (!cartItem) {
      return { success: false, error: 'Cart item not found' }
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    })

    revalidatePath('/cart')
    return { success: true, item: updatedItem }
  } catch (error) {
    console.error('Error updating cart item:', error)
    return { success: false, error: 'Failed to update cart item' }
  }
}

// Remove item from cart
export async function removeFromCart(itemId: string) {
  const user = await getCurrentUser()
  
  if (!user) {
    return { success: false, error: 'Authentication required' }
  }

  try {
    // Verify the item belongs to the user's cart
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId: user.id
        }
      }
    })

    if (!cartItem) {
      return { success: false, error: 'Cart item not found' }
    }

    await prisma.cartItem.delete({
      where: { id: itemId }
    })

    revalidatePath('/cart')
    return { success: true }
  } catch (error) {
    console.error('Error removing from cart:', error)
    return { success: false, error: 'Failed to remove item from cart' }
  }
}

// Clear entire cart
export async function clearCart() {
  const user = await getCurrentUser()
  
  if (!user) {
    return { success: false, error: 'Authentication required' }
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id }
    })

    if (!cart) {
      return { success: true } // Cart doesn't exist, nothing to clear
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    })

    revalidatePath('/cart')
    return { success: true }
  } catch (error) {
    console.error('Error clearing cart:', error)
    return { success: false, error: 'Failed to clear cart' }
  }
}

// Get cart item count
export async function getCartItemCount() {
  const user = await getCurrentUser()
  
  if (!user) {
    return { success: false, error: 'Authentication required' }
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        _count: {
          select: { items: true }
        }
      }
    })

    const count = cart?._count.items || 0
    return { success: true, count }
  } catch (error) {
    console.error('Error getting cart count:', error)
    return { success: false, error: 'Failed to get cart count' }
  }
}
