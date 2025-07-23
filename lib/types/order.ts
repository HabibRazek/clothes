import { Prisma } from '@prisma/client'

// Order with all relations for admin/seller views (matches getAllOrders query)
export type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    user: {
      select: {
        id: true
        name: true
        email: true
      }
    }
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

// Basic order type for simple displays
export type OrderBasic = Prisma.OrderGetPayload<{
  select: {
    id: true
    status: true
    total: true
    createdAt: true
  }
}>

// Order with items for checkout/cart views
export type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: {
          include: {
            images: true
          }
        }
      }
    }
  }
}>
