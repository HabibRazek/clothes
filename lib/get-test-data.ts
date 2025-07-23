import { prisma } from './prisma'

async function getTestData() {
  try {
    const products = await prisma.product.findMany({
      include: {
        seller: {
          include: {
            user: true
          }
        },
        category: true
      }
    })

    const users = await prisma.user.findMany()

    console.log('=== TEST DATA ===')
    console.log('\n📦 Products:')
    products.forEach(product => {
      console.log(`- ${product.title} (ID: ${product.id})`)
      console.log(`  Price: €${product.price}`)
      console.log(`  Seller: ${product.seller.user.name}`)
      console.log(`  Category: ${product.category.name}`)
      console.log(`  URL: http://localhost:3001/products/${product.id}`)
      console.log(`  Checkout: http://localhost:3001/checkout?productId=${product.id}`)
      console.log('')
    })

    console.log('\n👥 Users:')
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`)
    })

    return { products, users }
  } catch (error) {
    console.error('Error getting test data:', error)
    return null
  }
}

// Run if called directly
if (require.main === module) {
  getTestData()
    .then(() => {
      process.exit(0)
    })
    .catch((error) => {
      console.error('Failed:', error)
      process.exit(1)
    })
}

export { getTestData }
