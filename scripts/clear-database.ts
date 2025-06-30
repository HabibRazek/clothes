import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearDatabase() {
  console.log('🗑️  Starting database cleanup...')

  try {
    // Delete data in the correct order to respect foreign key constraints
    console.log('Deleting reviews...')
    await prisma.review.deleteMany({})

    console.log('Deleting order items...')
    await prisma.orderItem.deleteMany({})

    console.log('Deleting orders...')
    await prisma.order.deleteMany({})

    console.log('Deleting product images...')
    await prisma.productImage.deleteMany({})

    console.log('Deleting products...')
    await prisma.product.deleteMany({})

    console.log('Deleting sellers...')
    await prisma.seller.deleteMany({})

    console.log('Deleting addresses...')
    await prisma.address.deleteMany({})

    console.log('Deleting categories...')
    await prisma.category.deleteMany({})

    console.log('Deleting Auth.js tables...')
    await prisma.verificationToken.deleteMany({})
    await prisma.session.deleteMany({})
    await prisma.account.deleteMany({})

    console.log('Deleting users...')
    await prisma.user.deleteMany({})

    console.log('✅ Database cleared successfully!')
    console.log('📊 All tables are now empty but schema is preserved.')

  } catch (error) {
    console.error('❌ Error clearing database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the cleanup
clearDatabase()
  .then(() => {
    console.log('🎉 Database cleanup completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Database cleanup failed:', error)
    process.exit(1)
  })
