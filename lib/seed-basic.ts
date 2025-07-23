import { prisma } from './prisma'

export async function seedBasicData() {
  try {
    // Create basic categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { name: 'Vêtements' },
        update: {},
        create: {
          name: 'Vêtements',
          description: 'Tous types de vêtements',
          level: 0,
          isActive: true
        }
      }),
      prisma.category.upsert({
        where: { name: 'Chaussures' },
        update: {},
        create: {
          name: 'Chaussures',
          description: 'Chaussures pour tous',
          level: 0,
          isActive: true
        }
      }),
      prisma.category.upsert({
        where: { name: 'Accessoires' },
        update: {},
        create: {
          name: 'Accessoires',
          description: 'Sacs, bijoux et accessoires',
          level: 0,
          isActive: true
        }
      })
    ])

    console.log('✅ Basic categories created:', categories.length)

    // Create test admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@test.com' },
      update: {},
      create: {
        email: 'admin@test.com',
        name: 'Admin User',
        role: 'ADMIN',
        emailVerified: new Date()
      }
    })

    console.log('✅ Admin user created:', adminUser.email)

    // Create test seller user
    const sellerUser = await prisma.user.upsert({
      where: { email: 'seller@test.com' },
      update: {},
      create: {
        email: 'seller@test.com',
        name: 'Test Seller',
        role: 'SELLER',
        emailVerified: new Date()
      }
    })

    // Create seller profile
    const seller = await prisma.seller.upsert({
      where: { userId: sellerUser.id },
      update: {},
      create: {
        userId: sellerUser.id,
        businessName: 'Test Fashion Store',
        description: 'A test fashion store',
        isVerified: true,
        isActive: true
      }
    })

    console.log('✅ Seller created:', seller.businessName)

    // Create test buyer user
    const buyerUser = await prisma.user.upsert({
      where: { email: 'buyer@test.com' },
      update: {},
      create: {
        email: 'buyer@test.com',
        name: 'Test Buyer',
        role: 'USER',
        emailVerified: new Date()
      }
    })

    console.log('✅ Buyer user created:', buyerUser.email)

    // Create test product
    const product = await prisma.product.create({
      data: {
        title: 'Test T-Shirt',
        description: 'A beautiful test t-shirt for testing purposes',
        price: 25.99,
        originalPrice: 35.99,
        condition: 'NEW_WITH_TAGS',
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
        tags: ['Test', 'Casual', 'Coton'],
        status: 'ACTIVE',
        sellerId: seller.id,
        categoryId: categories[0].id
      }
    })

    console.log('✅ Test product created:', product.title)

    return { success: true, categories, users: [adminUser, sellerUser, buyerUser], seller, product }
  } catch (error) {
    console.error('❌ Error seeding basic data:', error)
    return { success: false, error }
  }
}

// Run if called directly
if (require.main === module) {
  seedBasicData()
    .then((result) => {
      if (result.success) {
        console.log('🎉 Basic data seeded successfully!')
      } else {
        console.error('💥 Failed to seed basic data')
      }
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error)
      process.exit(1)
    })
}
