import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { generateTwoFactorSetup } from '../lib/2fa'

const prisma = new PrismaClient()

async function createTestUser() {
  console.log('🔧 Creating test user with 2FA enabled...')

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test2fa@example.com' }
    })

    if (existingUser) {
      console.log('❌ Test user already exists')
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('test123', 12)

    // Generate 2FA setup
    const twoFactorSetup = await generateTwoFactorSetup('test2fa@example.com')

    // Create user with 2FA enabled
    const user = await prisma.user.create({
      data: {
        email: 'test2fa@example.com',
        firstName: 'Test',
        lastName: 'User',
        name: 'Test User',
        password: hashedPassword,
        role: 'BUYER',
        isVerified: true,
        twoFactorEnabled: true,
        twoFactorSecret: twoFactorSetup.secret,
        twoFactorBackupCodes: twoFactorSetup.backupCodes
      }
    })

    console.log('✅ Test user created successfully!')
    console.log('📧 Email: test2fa@example.com')
    console.log('🔑 Password: test123')
    console.log('🔐 2FA Secret:', twoFactorSetup.secret)
    console.log('🔑 Manual Entry Key:', twoFactorSetup.manualEntryKey)
    console.log('💾 Backup Codes:', twoFactorSetup.backupCodes)
    console.log('')
    console.log('📱 To test 2FA:')
    console.log('1. Add this secret to your Google Authenticator:')
    console.log('   Secret:', twoFactorSetup.manualEntryKey)
    console.log('2. Or scan this QR code:')
    console.log('   (QR code would be displayed in browser)')
    console.log('3. Use one of these backup codes if needed:')
    twoFactorSetup.backupCodes.forEach((code, index) => {
      console.log(`   ${index + 1}. ${code}`)
    })

  } catch (error) {
    console.error('❌ Error creating test user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()
