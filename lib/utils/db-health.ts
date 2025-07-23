import { prisma } from '@/lib/prisma'

export async function checkDatabaseConnection() {
  try {
    // Simple query to test connection
    await prisma.$queryRaw`SELECT 1`
    return { success: true, message: 'Database connection successful' }
  } catch (error) {
    console.error('Database connection failed:', error)
    return { 
      success: false, 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function wakeUpDatabase() {
  try {
    // Wake up the database with a simple query
    await prisma.$queryRaw`SELECT NOW()`
    return { success: true, message: 'Database is awake' }
  } catch (error) {
    console.error('Failed to wake up database:', error)
    return { 
      success: false, 
      message: 'Failed to wake up database',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function getDatabaseStats() {
  try {
    const [userCount, productCount, orderCount, categoryCount] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.category.count()
    ])

    return {
      success: true,
      stats: {
        users: userCount,
        products: productCount,
        orders: orderCount,
        categories: categoryCount
      }
    }
  } catch (error) {
    console.error('Failed to get database stats:', error)
    return { 
      success: false, 
      message: 'Failed to get database stats',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
