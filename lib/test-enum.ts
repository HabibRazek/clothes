import { prisma } from './prisma'

async function testProductConditionEnum() {
  try {
    console.log('🧪 Testing ProductCondition enum...')
    
    // Get a seller first
    const seller = await prisma.seller.findFirst()
    if (!seller) {
      console.log('❌ No seller found')
      return
    }
    
    // Get a category first
    const category = await prisma.category.findFirst()
    if (!category) {
      console.log('❌ No category found')
      return
    }

    console.log(`✅ Found seller: ${seller.id}`)
    console.log(`✅ Found category: ${category.id}`)

    // Test each condition value
    const conditions = ['NEW_WITH_TAGS', 'NEW_WITHOUT_TAGS', 'VERY_GOOD', 'GOOD', 'SATISFACTORY']
    
    for (const condition of conditions) {
      try {
        console.log(`\n🔍 Testing condition: ${condition}`)
        
        const product = await prisma.product.create({
          data: {
            sellerId: seller.id,
            categoryId: category.id,
            title: `Test Product - ${condition}`,
            description: `Test product with condition ${condition}`,
            price: 25.99,
            condition: condition as any,
            size: 'M',
            color: 'Bleu',
            material: 'Coton',
            brand: 'Test Brand',
            gender: 'UNISEX',
            style: 'Casual',
            location: 'Paris',
            country: 'FR',
            shippingCost: 5.99,
            canDeliver: true,
            canPickup: true,
            tags: ['Test'],
            status: 'ACTIVE'
          }
        })
        
        console.log(`✅ Successfully created product with condition ${condition}: ${product.id}`)
        
        // Clean up - delete the test product
        await prisma.product.delete({ where: { id: product.id } })
        console.log(`🗑️ Cleaned up test product: ${product.id}`)
        
      } catch (error) {
        console.log(`❌ Failed to create product with condition ${condition}:`, error.message)
      }
    }
    
    console.log('\n🎉 ProductCondition enum test completed!')
    
  } catch (error) {
    console.error('❌ Error testing ProductCondition enum:', error)
  }
}

// Run if called directly
if (require.main === module) {
  testProductConditionEnum()
    .then(() => {
      process.exit(0)
    })
    .catch((error) => {
      console.error('Failed:', error)
      process.exit(1)
    })
}

export { testProductConditionEnum }
