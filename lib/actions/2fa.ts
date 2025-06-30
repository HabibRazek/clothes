'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import {
  generateTwoFactorSetup,
  verifyTwoFactorToken,
  removeUsedBackupCode,
  regenerateBackupCodes
} from '@/lib/2fa'
import { revalidatePath } from 'next/cache'
import { AuditLogger } from '@/lib/security/audit-log'
import { headers } from 'next/headers'

export interface TwoFactorSetupResult {
  success: boolean
  message: string
  data?: {
    qrCodeUrl: string
    backupCodes: string[]
    manualEntryKey: string
  }
}

export interface TwoFactorVerifyResult {
  success: boolean
  message: string
}

/**
 * Setup 2FA for the current user
 */
export async function setupTwoFactorAction(): Promise<TwoFactorSetupResult> {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return {
        success: false,
        message: 'Authentication required'
      }
    }

    // Check if user already has 2FA enabled
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, twoFactorEnabled: true }
    })

    if (!user) {
      return {
        success: false,
        message: 'User not found'
      }
    }

    if (user.twoFactorEnabled) {
      return {
        success: false,
        message: 'Two-factor authentication is already enabled'
      }
    }

    // Generate 2FA setup
    const setup = await generateTwoFactorSetup(session.user.email)

    // Store the secret temporarily (not enabled yet)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorSecret: setup.secret,
        twoFactorBackupCodes: setup.backupCodes
      }
    })

    // Log the setup attempt
    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'

    await AuditLogger.logSecurityEvent('2FA_SETUP_INITIATED', {
      userId: user.id,
      email: session.user.email,
      ipAddress,
      userAgent
    }, true)

    return {
      success: true,
      message: 'Two-factor authentication setup initiated',
      data: {
        qrCodeUrl: setup.qrCodeUrl,
        backupCodes: setup.backupCodes,
        manualEntryKey: setup.manualEntryKey
      }
    }

  } catch (error) {
    console.error('2FA setup error:', error)
    return {
      success: false,
      message: 'Failed to setup two-factor authentication'
    }
  }
}

/**
 * Verify and enable 2FA
 */
export async function verifyAndEnableTwoFactorAction(token: string): Promise<TwoFactorVerifyResult> {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return {
        success: false,
        message: 'Authentication required'
      }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        twoFactorEnabled: true,
        twoFactorSecret: true,
        twoFactorBackupCodes: true
      }
    })

    if (!user) {
      return {
        success: false,
        message: 'User not found'
      }
    }

    if (user.twoFactorEnabled) {
      return {
        success: false,
        message: 'Two-factor authentication is already enabled'
      }
    }

    if (!user.twoFactorSecret) {
      return {
        success: false,
        message: 'Two-factor authentication setup not found. Please start setup again.'
      }
    }

    // Verify the token
    const verification = verifyTwoFactorToken(
      token,
      user.twoFactorSecret,
      user.twoFactorBackupCodes
    )

    if (!verification.isValid) {
      return {
        success: false,
        message: 'Invalid verification code'
      }
    }

    // Enable 2FA
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorEnabled: true
      }
    })

    // Log successful 2FA enablement
    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'

    await AuditLogger.logSecurityEvent('2FA_ENABLED', {
      userId: user.id,
      email: session.user.email,
      ipAddress,
      userAgent
    }, true)

    revalidatePath('/profile')

    return {
      success: true,
      message: 'Two-factor authentication enabled successfully'
    }

  } catch (error) {
    console.error('2FA verification error:', error)
    return {
      success: false,
      message: 'Failed to verify two-factor authentication'
    }
  }
}

/**
 * Disable 2FA
 */
export async function disableTwoFactorAction(password: string): Promise<TwoFactorVerifyResult> {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return {
        success: false,
        message: 'Authentication required'
      }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        password: true,
        twoFactorEnabled: true
      }
    })

    if (!user) {
      return {
        success: false,
        message: 'User not found'
      }
    }

    if (!user.twoFactorEnabled) {
      return {
        success: false,
        message: 'Two-factor authentication is not enabled'
      }
    }

    // Verify password for security
    if (!user.password) {
      return {
        success: false,
        message: 'Password verification required'
      }
    }

    const bcrypt = await import('bcryptjs')
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return {
        success: false,
        message: 'Invalid password'
      }
    }

    // Disable 2FA
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorBackupCodes: []
      }
    })

    // Log 2FA disablement
    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'

    await AuditLogger.logSecurityEvent('2FA_DISABLED', {
      userId: user.id,
      email: session.user.email,
      ipAddress,
      userAgent
    }, true)

    revalidatePath('/profile')

    return {
      success: true,
      message: 'Two-factor authentication disabled successfully'
    }

  } catch (error) {
    console.error('2FA disable error:', error)
    return {
      success: false,
      message: 'Failed to disable two-factor authentication'
    }
  }
}

/**
 * Regenerate backup codes
 */
export async function regenerateBackupCodesAction(): Promise<TwoFactorSetupResult> {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return {
        success: false,
        message: 'Authentication required'
      }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, twoFactorEnabled: true }
    })

    if (!user) {
      return {
        success: false,
        message: 'User not found'
      }
    }

    if (!user.twoFactorEnabled) {
      return {
        success: false,
        message: 'Two-factor authentication is not enabled'
      }
    }

    // Generate new backup codes
    const newBackupCodes = regenerateBackupCodes()

    // Update user with new backup codes
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorBackupCodes: newBackupCodes
      }
    })

    // Log backup codes regeneration
    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'

    await AuditLogger.logSecurityEvent('2FA_BACKUP_CODES_REGENERATED', {
      userId: user.id,
      email: session.user.email,
      ipAddress,
      userAgent
    }, true)

    revalidatePath('/profile')

    return {
      success: true,
      message: 'Backup codes regenerated successfully',
      data: {
        qrCodeUrl: '', // Not needed for regeneration
        backupCodes: newBackupCodes,
        manualEntryKey: '' // Not needed for regeneration
      }
    }

  } catch (error) {
    console.error('Backup codes regeneration error:', error)
    return {
      success: false,
      message: 'Failed to regenerate backup codes'
    }
  }
}
