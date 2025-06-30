import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function resetAndSeed() {
  console.log('🔄 Starting database reset and seed...')

  try {
    // First clear the database
    console.log('🗑️  Clearing existing data...')
    
    await prisma.review.deleteMany({})
    await prisma.orderItem.deleteMany({})
    await prisma.order.deleteMany({})
    await prisma.productImage.deleteMany({})
    await prisma.product.deleteMany({})
    await prisma.seller.deleteMany({})
    await prisma.address.deleteMany({})
    await prisma.category.deleteMany({})
    await prisma.verificationToken.deleteMany({})
    await prisma.session.deleteMany({})
    await prisma.account.deleteMany({})
    await prisma.user.deleteMany({})

    console.log('✅ Database cleared!')

    // Now seed with fresh data
    console.log('🌱 Seeding fresh data...')

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
    const adminPassword = await bcrypt.hash('admin123', 12)
    
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        firstName: 'Admin',
        lastName: 'User',
        name: 'Admin User',
        password: adminPassword,
        role: 'ADMIN',
        isVerified: true,
        emailVerified: new Date()
      }
    })
    
    console.log('✅ Admin user created:', admin.email)

    // Create test users
    const testUserPassword = await bcrypt.hash('password123', 12)
    
    const testBuyer = await prisma.user.create({
      data: {
        email: 'buyer@example.com',
        firstName: 'John',
        lastName: 'Doe',
        name: 'John Doe',
        password: testUserPassword,
        role: 'BUYER',
        isVerified: true
      }
    })
    
    console.log('✅ Test buyer created:', testBuyer.email)

    const testSeller = await prisma.user.create({
      data: {
        email: 'seller@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        name: 'Jane Smith',
        password: testUserPassword,
        role: 'SELLER',
        isVerified: true
      }
    })
    
    // Create seller profile
    await prisma.seller.create({
      data: {
        userId: testSeller.id,
        storeName: 'Jane\'s Fashion Store',
        storeDescription: 'Quality fashion items at great prices',
        sellerType: 'INDIVIDUAL',
        isVerified: true
      }
    })
    
    console.log('✅ Test seller created:', testSeller.email)

    // Create categories
    const womenCategory = await prisma.category.create({
      data: {
        name: 'Women',
        slug: 'women',
        description: 'Women\'s fashion and accessories'
      }
    })

    const menCategory = await prisma.category.create({
      data: {
        name: 'Men',
        slug: 'men',
        description: 'Men\'s fashion and accessories'
      }
    })

    const kidsCategory = await prisma.category.create({
      data: {
        name: 'Kids',
        slug: 'kids',
        description: 'Children\'s clothing and accessories'
      }
    })

    console.log('✅ Main categories created')

    // Create subcategories
    if (womenCategory) {
      const womenSubcategories = [
        { name: 'Women Clothing', slug: 'women-clothing', parentId: womenCategory.id },
        { name: 'Women Shoes', slug: 'women-shoes', parentId: womenCategory.id },
        { name: 'Women Bags', slug: 'women-bags', parentId: womenCategory.id },
        { name: 'Women Accessories', slug: 'women-accessories', parentId: womenCategory.id }
      ]

      for (const subcategory of womenSubcategories) {
        await prisma.category.create({
          data: subcategory
        })
      }
    }

    if (menCategory) {
      const menSubcategories = [
        { name: 'Men Clothing', slug: 'men-clothing', parentId: menCategory.id },
        { name: 'Men Shoes', slug: 'men-shoes', parentId: menCategory.id },
        { name: 'Men Accessories', slug: 'men-accessories', parentId: menCategory.id }
      ]

      for (const subcategory of menSubcategories) {
        await prisma.category.create({
          data: subcategory
        })
      }
    }

    if (kidsCategory) {
      const kidsSubcategories = [
        { name: 'Kids Clothing', slug: 'kids-clothing', parentId: kidsCategory.id },
        { name: 'Kids Shoes', slug: 'kids-shoes', parentId: kidsCategory.id },
        { name: 'Kids Accessories', slug: 'kids-accessories', parentId: kidsCategory.id }
      ]

      for (const subcategory of kidsSubcategories) {
        await prisma.category.create({
          data: subcategory
        })
      }
    }

    console.log('✅ Subcategories created')

    console.log('🎉 Database reset and seed completed successfully!')
    console.log('')
    console.log('📋 Test Accounts Created:')
    console.log('👑 Admin: admin@example.com / admin123')
    console.log('🛒 Buyer: buyer@example.com / password123')
    console.log('🏪 Seller: seller@example.com / password123')

  } catch (error) {
    console.error('❌ Error during reset and seed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the reset and seed
resetAndSeed()
  .then(() => {
    console.log('✨ Reset and seed completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Reset and seed failed:', error)
    process.exit(1)
  })
