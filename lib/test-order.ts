import { prisma } from './prisma'

async function testOrderCreation() {
  try {
    // Get test data
    const product = await prisma.product.findFirst({
      include: {
        seller: true
      }
    })

    const user = await prisma.user.findFirst({
      where: { email: 'buyer@test.com' }
    })

    if (!product || !user) {
      console.log('❌ Missing test data')
      return
    }

    console.log('📦 Testing order creation...')
    console.log(`Product: ${product.title} (${product.id})`)
    console.log(`User: ${user.name} (${user.id})`)

    // Test order creation
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        deliveryFirstName: 'Test',
        deliveryLastName: 'User',
        deliveryStreet: '123 Test Street',
        deliveryCity: 'Paris',
        deliveryPostalCode: '75001',
        deliveryCountry: 'FR',
        subtotal: product.price,
        shippingCost: 5.99,
        tax: product.price * 0.20,
        total: product.price + 5.99 + (product.price * 0.20),
        paymentMethod: 'CARD',
        status: 'PENDING',
        paymentStatus: 'PENDING'
      }
    })

    console.log('✅ Order created:', order.id)

    // Create order item
    const orderItem = await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: product.id,
        quantity: 1,
        price: product.price
      }
    })

    console.log('✅ Order item created:', orderItem.id)

    // Test URLs
    console.log('\n🔗 Test URLs:')
    console.log(`Product: http://localhost:3001/products/${product.id}`)
    console.log(`Checkout: http://localhost:3001/checkout?productId=${product.id}`)

    return { order, orderItem, product, user }
  } catch (error) {
    console.error('❌ Error testing order creation:', error)
    return null
  }
}

// Run if called directly
if (require.main === module) {
  testOrderCreation()
    .then(() => {
      process.exit(0)
    })
    .catch((error) => {
      console.error('Failed:', error)
      process.exit(1)
    })
}

export { testOrderCreation }
