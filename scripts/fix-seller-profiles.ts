import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixSellerProfiles() {
  console.log('🔧 Starting seller profile fix...')

  try {
    // Find users with SELLER role but no seller profile
    const sellersWithoutProfile = await prisma.user.findMany({
      where: {
        role: 'SELLER',
        seller: null
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true
      }
    })

    console.log(`Found ${sellersWithoutProfile.length} sellers without profiles`)

    if (sellersWithoutProfile.length === 0) {
      console.log('✅ All sellers already have profiles!')
      return
    }

    // Create seller profiles for these users
    const results = []
    for (const user of sellersWithoutProfile) {
      try {
        const seller = await prisma.seller.create({
          data: {
            userId: user.id,
            storeName: `${user.firstName} ${user.lastName}'s Store`,
            storeDescription: 'Welcome to my store!',
            sellerType: 'INDIVIDUAL'
          }
        })
        
        results.push(seller)
        console.log(`✅ Created seller profile for ${user.firstName} ${user.lastName} (${user.email})`)
      } catch (error) {
        console.error(`❌ Failed to create seller profile for ${user.email}:`, error)
      }
    }

    console.log(`🎉 Successfully created ${results.length} seller profiles!`)
    
  } catch (error) {
    console.error('❌ Error fixing seller profiles:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the fix
if (require.main === module) {
  fixSellerProfiles()
    .then(() => {
      console.log('✨ Seller profile fix completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Seller profile fix failed:', error)
      process.exit(1)
    })
}

export { fixSellerProfiles }
