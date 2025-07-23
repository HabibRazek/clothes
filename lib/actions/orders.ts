'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from './auth'
import { revalidatePath } from 'next/cache'
import { OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client'

// Create a new order
export async function createOrder(formData: FormData) {
  const user = await getCurrentUser()
  
  if (!user) {
    return { success: false, error: 'Authentication required' }
  }

  try {
    const productId = formData.get('productId') as string
    const quantity = parseInt(formData.get('quantity') as string) || 1
    const paymentMethodString = formData.get('paymentMethod') as string

    // Get delivery information from form
    const deliveryFirstName = formData.get('firstName') as string
    const deliveryLastName = formData.get('lastName') as string
    const deliveryStreet = formData.get('street') as string
    const deliveryCity = formData.get('city') as string
    const deliveryPostalCode = formData.get('postalCode') as string
    const deliveryCountry = formData.get('country') as string

    // Map payment method string to enum
    let paymentMethod: PaymentMethod
    switch (paymentMethodString) {
      case 'card':
        paymentMethod = 'CARD'
        break
      case 'paypal':
        paymentMethod = 'PAYPAL'
        break
      case 'cash_on_delivery':
        paymentMethod = 'CASH_ON_DELIVERY'
        break
      default:
        paymentMethod = 'CARD'
    }

    // Get the product
    const product = await prisma.product.findUnique({
      where: { 
        id: productId,
        status: 'ACTIVE'
      },
      include: {
        seller: true
      }
    })

    if (!product) {
      return { success: false, error: 'Product not found or not available' }
    }

    // Calculate totals
    const subtotal = product.price * quantity
    const shippingCost = product.shippingCost || 0
    const tax = subtotal * 0.20 // 20% VAT (adjust as needed)
    const total = subtotal + shippingCost + tax

    // Set initial payment status based on payment method
    const initialPaymentStatus = paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PENDING'

    // Create the order first
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        deliveryFirstName,
        deliveryLastName,
        deliveryStreet,
        deliveryCity,
        deliveryPostalCode,
        deliveryCountry,
        subtotal,
        shippingCost,
        tax,
        total,
        paymentMethod,
        status: 'PENDING',
        paymentStatus: initialPaymentStatus
      }
    })

    // Create the order item separately
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId,
        quantity,
        price: product.price
      }
    })

    // Fetch the complete order with relations
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                seller: {
                  include: {
                    user: {
                      select: {
                        name: true,
                        email: true
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
        },
        address: true
      }
    })

    revalidatePath('/orders')
    revalidatePath('/seller/orders')
    return { success: true, order: completeOrder }
  } catch (error) {
    console.error('Error creating order:', error)
    return { success: false, error: 'Failed to create order' }
  }
}

// Get user's orders
export async function getUserOrders() {
  const user = await getCurrentUser()
  
  if (!user) {
    return { success: false, error: 'Authentication required' }
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
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
        },
        address: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { success: true, orders }
  } catch (error) {
    console.error('Error fetching user orders:', error)
    return { success: false, error: 'Failed to fetch orders' }
  }
}

// Get seller's orders
export async function getSellerOrders() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'SELLER') {
    return { success: false, error: 'Seller access required' }
  }

  try {
    const seller = await prisma.seller.findUnique({
      where: { userId: user.id }
    })

    if (!seller) {
      return { success: false, error: 'Seller profile not found' }
    }

    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              sellerId: seller.id
            }
          }
        }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        items: {
          where: {
            product: {
              sellerId: seller.id
            }
          },
          include: {
            product: {
              include: {
                images: {
                  take: 1,
                  orderBy: { order: 'asc' }
                }
              }
            }
          }
        },
        address: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { success: true, orders }
  } catch (error) {
    console.error('Error fetching seller orders:', error)
    return { success: false, error: 'Failed to fetch orders' }
  }
}

// Update order status (seller only)
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'SELLER') {
    return { success: false, error: 'Seller access required' }
  }

  try {
    const seller = await prisma.seller.findUnique({
      where: { userId: user.id }
    })

    if (!seller) {
      return { success: false, error: 'Seller profile not found' }
    }

    // Verify the order contains products from this seller
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        items: {
          some: {
            product: {
              sellerId: seller.id
            }
          }
        }
      }
    })

    if (!order) {
      return { success: false, error: 'Order not found or unauthorized' }
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              include: {
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

    revalidatePath('/seller/orders')
    return { success: true, order: updatedOrder }
  } catch (error) {
    console.error('Error updating order status:', error)
    return { success: false, error: 'Failed to update order status' }
  }
}

// Get order by ID
export async function getOrderById(orderId: string) {
  const user = await getCurrentUser()
  
  if (!user) {
    return { success: false, error: 'Authentication required' }
  }

  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        OR: [
          { userId: user.id }, // User's own order
          {
            items: {
              some: {
                product: {
                  seller: {
                    userId: user.id
                  }
                }
              }
            }
          } // Seller's product order
        ]
      },
      include: {
        user: {
          select: {
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
        },
        address: true
      }
    })

    if (!order) {
      return { success: false, error: 'Order not found' }
    }

    return { success: true, order }
  } catch (error) {
    console.error('Error fetching order:', error)
    return { success: false, error: 'Failed to fetch order' }
  }
}
