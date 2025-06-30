import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
  const adminPassword = await bcrypt.hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
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

  const testBuyer = await prisma.user.upsert({
    where: { email: 'buyer@example.com' },
    update: {},
    create: {
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

  const testSeller = await prisma.user.upsert({
    where: { email: 'seller@example.com' },
    update: {},
    create: {
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
  await prisma.seller.upsert({
    where: { userId: testSeller.id },
    update: {},
    create: {
      userId: testSeller.id,
      storeName: 'Jane\'s Fashion Store',
      storeDescription: 'Quality fashion items at great prices',
      sellerType: 'INDIVIDUAL',
      isVerified: true
    }
  })

  console.log('✅ Test seller created:', testSeller.email)

  // Create some sample categories
  const categories = [
    {
      name: 'Women',
      slug: 'women',
      description: 'Women\'s clothing and accessories'
    },
    {
      name: 'Men',
      slug: 'men',
      description: 'Men\'s clothing and accessories'
    },
    {
      name: 'Kids',
      slug: 'kids',
      description: 'Children\'s clothing and accessories'
    },
    {
      name: 'Home',
      slug: 'home',
      description: 'Home decor and furniture'
    }
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    })
  }

  // Create subcategories
  const womenCategory = await prisma.category.findUnique({
    where: { slug: 'women' }
  })

  const menCategory = await prisma.category.findUnique({
    where: { slug: 'men' }
  })

  if (womenCategory) {
    const womenSubcategories = [
      { name: 'Women Clothing', slug: 'women-clothing', parentId: womenCategory.id },
      { name: 'Women Shoes', slug: 'women-shoes', parentId: womenCategory.id },
      { name: 'Women Bags', slug: 'women-bags', parentId: womenCategory.id },
      { name: 'Women Accessories', slug: 'women-accessories', parentId: womenCategory.id }
    ]

    for (const subcategory of womenSubcategories) {
      await prisma.category.upsert({
        where: { slug: subcategory.slug },
        update: {},
        create: subcategory
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
      await prisma.category.upsert({
        where: { slug: subcategory.slug },
        update: {},
        create: subcategory
      })
    }
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
