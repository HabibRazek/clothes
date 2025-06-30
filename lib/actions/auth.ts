'use server'

import { signIn, signOut, auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { redirect } from 'next/navigation'
import { AuthError } from 'next-auth'
import { AuditLogger } from '@/lib/security/audit-log'
import { authRateLimit } from '@/lib/security/rate-limit'
import { headers } from 'next/headers'
import { verifyTwoFactorToken, removeUsedBackupCode } from '@/lib/2fa'

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const twoFactorLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  twoFactorCode: z.string().min(6, 'Two-factor code is required'),
})

const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

const sellerRegistrationSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),

  // Address Information
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  postalCode: z.string().min(3, 'Postal code must be at least 3 characters'),
  country: z.string().min(2, 'Country is required'),

  // Seller Information
  storeName: z.string().min(2, 'Store name must be at least 2 characters'),
  storeDescription: z.string().optional(),
  sellerType: z.enum(['INDIVIDUAL', 'BUSINESS', 'PROFESSIONAL']),
  businessNumber: z.string().optional(),

  // Terms
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
  agreeToSellerTerms: z.boolean().refine(val => val === true, 'You must agree to the seller terms'),
  agreeToMarketing: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Type definitions
export type LoginFormData = z.infer<typeof loginSchema>
export type TwoFactorLoginFormData = z.infer<typeof twoFactorLoginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type SellerRegistrationFormData = z.infer<typeof sellerRegistrationSchema>

export interface ActionResult {
  success: boolean
  message: string
  errors?: Record<string, string[]>
  redirectTo?: string
  requiresTwoFactor?: boolean
  userEmail?: string
}

export async function loginAction(formData: LoginFormData): Promise<ActionResult> {
  const headersList = await headers()
  const ipAddress = headersList.get('x-forwarded-for') || 'unknown'
  const userAgent = headersList.get('user-agent') || 'unknown'

  try {
    // Validate input
    const validatedData = loginSchema.parse(formData)

    // Log login attempt
    await AuditLogger.logAuth('LOGIN', undefined, false, {
      email: validatedData.email,
      ipAddress,
      userAgent,
      timestamp: new Date()
    })

    // Check if user exists and verify password manually first
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        twoFactorEnabled: true,
        twoFactorSecret: true,
        twoFactorBackupCodes: true,
        seller: {
          select: {
            id: true,
            storeName: true,
            isVerified: true
          }
        }
      }
    })

    if (!user || !user.password) {
      await AuditLogger.logSecurityEvent('LOGIN_FAILED_USER_NOT_FOUND', {
        email: validatedData.email,
        ipAddress,
        userAgent
      }, false)
      return {
        success: false,
        message: 'Invalid email or password'
      }
    }

    const isValidPassword = await bcrypt.compare(validatedData.password, user.password)
    if (!isValidPassword) {
      await AuditLogger.logSecurityEvent('LOGIN_FAILED_INVALID_PASSWORD', {
        userId: user.id,
        email: validatedData.email,
        ipAddress,
        userAgent
      }, false)
      return {
        success: false,
        message: 'Invalid email or password'
      }
    }

    // Check if user has 2FA enabled
    if (user.twoFactorEnabled) {
      await AuditLogger.logSecurityEvent('LOGIN_2FA_REQUIRED', {
        userId: user.id,
        email: validatedData.email,
        ipAddress,
        userAgent
      }, true)
      return {
        success: false,
        message: 'Two-factor authentication required',
        requiresTwoFactor: true,
        userEmail: user.email
      }
    }

    // Use Auth.js signIn after manual verification
    const result = await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    })

    if (result?.error) {
      await AuditLogger.logSecurityEvent('LOGIN_FAILED_AUTH_ERROR', {
        userId: user.id,
        email: validatedData.email,
        error: result.error,
        ipAddress,
        userAgent
      }, false)
      return {
        success: false,
        message: 'Authentication failed'
      }
    }

    // Log successful login
    await AuditLogger.logAuth('LOGIN', user.id, true, {
      email: validatedData.email,
      role: user.role,
      ipAddress,
      userAgent
    })

    return {
      success: true,
      message: 'Login successful',
      redirectTo: user.seller ? '/dashboard' : '/'
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation failed',
        errors: error.flatten().fieldErrors
      }
    }

    if (error instanceof AuthError) {
      return {
        success: false,
        message: 'Invalid email or password'
      }
    }

    console.error('Login error:', error)
    await AuditLogger.logSecurityEvent('LOGIN_ERROR', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ipAddress,
      userAgent
    }, false)

    return {
      success: false,
      message: 'An error occurred during login'
    }
  }
}

export async function twoFactorLoginAction(formData: TwoFactorLoginFormData): Promise<ActionResult> {
  const headersList = await headers()
  const ipAddress = headersList.get('x-forwarded-for') || 'unknown'
  const userAgent = headersList.get('user-agent') || 'unknown'

  try {
    // Validate input
    const validatedData = twoFactorLoginSchema.parse(formData)

    // Get user with 2FA data
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        twoFactorEnabled: true,
        twoFactorSecret: true,
        twoFactorBackupCodes: true,
        seller: {
          select: {
            id: true,
            storeName: true,
            isVerified: true
          }
        }
      }
    })

    if (!user || !user.password) {
      await AuditLogger.logSecurityEvent('2FA_LOGIN_FAILED_USER_NOT_FOUND', {
        email: validatedData.email,
        ipAddress,
        userAgent
      })
      return {
        success: false,
        message: 'Invalid credentials'
      }
    }

    // Verify password again
    const isValidPassword = await bcrypt.compare(validatedData.password, user.password)
    if (!isValidPassword) {
      await AuditLogger.logSecurityEvent('2FA_LOGIN_FAILED_INVALID_PASSWORD', {
        userId: user.id,
        email: validatedData.email,
        ipAddress,
        userAgent
      }, false)
      return {
        success: false,
        message: 'Invalid credentials'
      }
    }

    // Check if 2FA is enabled
    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      return {
        success: false,
        message: 'Two-factor authentication is not enabled for this account'
      }
    }

    // Verify 2FA token
    const verification = verifyTwoFactorToken(
      validatedData.twoFactorCode,
      user.twoFactorSecret,
      user.twoFactorBackupCodes
    )

    if (!verification.isValid) {
      await AuditLogger.logSecurityEvent('2FA_LOGIN_FAILED_INVALID_CODE', {
        userId: user.id,
        email: validatedData.email,
        ipAddress,
        userAgent
      }, false)
      return {
        success: false,
        message: 'Invalid two-factor authentication code'
      }
    }

    // If backup code was used, remove it from the list
    if (verification.usedBackupCode) {
      const updatedBackupCodes = removeUsedBackupCode(
        user.twoFactorBackupCodes,
        validatedData.twoFactorCode
      )

      await prisma.user.update({
        where: { id: user.id },
        data: { twoFactorBackupCodes: updatedBackupCodes }
      })

      await AuditLogger.logSecurityEvent('2FA_BACKUP_CODE_USED', {
        userId: user.id,
        email: validatedData.email,
        remainingCodes: updatedBackupCodes.length,
        ipAddress,
        userAgent
      }, true)
    }

    // Use Auth.js signIn after 2FA verification
    const result = await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    })

    if (result?.error) {
      await AuditLogger.logSecurityEvent('2FA_LOGIN_FAILED_AUTH_ERROR', {
        userId: user.id,
        email: validatedData.email,
        error: result.error,
        ipAddress,
        userAgent
      }, false)
      return {
        success: false,
        message: 'Authentication failed'
      }
    }

    // Log successful 2FA login
    await AuditLogger.logAuth('2FA_LOGIN', user.id, true, {
      email: validatedData.email,
      role: user.role,
      usedBackupCode: verification.usedBackupCode,
      ipAddress,
      userAgent
    })

    return {
      success: true,
      message: 'Login successful',
      redirectTo: user.seller ? '/dashboard' : '/'
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation failed',
        errors: error.flatten().fieldErrors
      }
    }

    console.error('2FA login error:', error)
    await AuditLogger.logSecurityEvent('2FA_LOGIN_ERROR', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ipAddress,
      userAgent
    }, false)

    return {
      success: false,
      message: 'An error occurred during login'
    }
  }
}

export async function logoutAction(): Promise<ActionResult> {
  const headersList = await headers()
  const ipAddress = headersList.get('x-forwarded-for') || 'unknown'
  const userAgent = headersList.get('user-agent') || 'unknown'

  try {
    // Get current session before logout
    const session = await auth()
    const userId = session?.user?.id
    const email = session?.user?.email

    // Perform logout
    await signOut({ redirect: false })

    // Log successful logout
    if (userId) {
      await AuditLogger.logAuth('LOGOUT', userId, true, {
        email,
        ipAddress,
        userAgent
      })
    }

    return {
      success: true,
      message: 'Logged out successfully'
    }

  } catch (error) {
    console.error('Logout error:', error)
    await AuditLogger.logSecurityEvent('LOGOUT_ERROR', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ipAddress,
      userAgent
    }, false)

    return {
      success: false,
      message: 'An error occurred during logout'
    }
  }
}

export async function signupAction(formData: SignupFormData): Promise<ActionResult> {
  try {
    // Validate input
    const validatedData = signupSchema.parse(formData)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return {
        success: false,
        message: 'User with this email already exists'
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        name: `${validatedData.firstName} ${validatedData.lastName}`,
        email: validatedData.email,
        phone: validatedData.phone,
        password: hashedPassword,
        role: 'BUYER'
      }
    })

    // Sign in the user automatically after registration
    const signInResult = await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    })

    if (signInResult?.error) {
      // User created but sign in failed - still success
      console.warn('User created but auto sign-in failed:', signInResult.error)
    }

    return {
      success: true,
      message: 'Account created successfully',
      redirectTo: '/'
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation failed',
        errors: error.flatten().fieldErrors
      }
    }

    console.error('Signup error:', error)
    return {
      success: false,
      message: 'An error occurred during signup'
    }
  }
}

// Password change schema
const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match",
  path: ["confirmPassword"],
})

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

export async function changePasswordAction(formData: ChangePasswordFormData): Promise<ActionResult> {
  const headersList = await headers()
  const ipAddress = headersList.get('x-forwarded-for') || 'unknown'
  const userAgent = headersList.get('user-agent') || 'unknown'

  try {
    // Get current session
    const session = await auth()
    if (!session?.user?.email) {
      return {
        success: false,
        message: 'You must be logged in to change your password'
      }
    }

    // Validate input
    const validatedData = changePasswordSchema.parse(formData)

    // Get user with current password
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        password: true
      }
    })

    if (!user || !user.password) {
      await AuditLogger.logSecurityEvent('PASSWORD_CHANGE_FAILED_USER_NOT_FOUND', {
        email: session.user.email,
        ipAddress,
        userAgent
      }, false)
      return {
        success: false,
        message: 'User not found or invalid account type'
      }
    }

    // Verify current password
    const isValidCurrentPassword = await bcrypt.compare(validatedData.currentPassword, user.password)
    if (!isValidCurrentPassword) {
      await AuditLogger.logSecurityEvent('PASSWORD_CHANGE_FAILED_INVALID_CURRENT', {
        userId: user.id,
        email: user.email,
        ipAddress,
        userAgent
      }, false)
      return {
        success: false,
        message: 'Current password is incorrect'
      }
    }

    // Check if new password is different from current
    const isSamePassword = await bcrypt.compare(validatedData.newPassword, user.password)
    if (isSamePassword) {
      return {
        success: false,
        message: 'New password must be different from your current password'
      }
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, 12)

    // Update password in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date()
      }
    })

    // Log successful password change
    await AuditLogger.logSecurityEvent('PASSWORD_CHANGED', {
      userId: user.id,
      email: user.email,
      ipAddress,
      userAgent
    }, true)

    return {
      success: true,
      message: 'Password changed successfully'
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation failed',
        errors: error.flatten().fieldErrors
      }
    }

    console.error('Password change error:', error)
    await AuditLogger.logSecurityEvent('PASSWORD_CHANGE_ERROR', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ipAddress,
      userAgent
    }, false)

    return {
      success: false,
      message: 'An error occurred while changing your password'
    }
  }
}

export async function sellerRegistrationAction(formData: SellerRegistrationFormData): Promise<ActionResult> {
  try {
    // Validate input
    const validatedData = sellerRegistrationSchema.parse(formData)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return {
        success: false,
        message: 'User with this email already exists'
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Create user and seller in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          name: `${validatedData.firstName} ${validatedData.lastName}`,
          email: validatedData.email,
          phone: validatedData.phone,
          password: hashedPassword,
          role: 'SELLER'
        }
      })

      // Create address
      await tx.address.create({
        data: {
          userId: user.id,
          street: validatedData.address,
          city: validatedData.city,
          postalCode: validatedData.postalCode,
          country: validatedData.country,
          isDefault: true
        }
      })

      // Create seller profile
      await tx.seller.create({
        data: {
          userId: user.id,
          storeName: validatedData.storeName,
          storeDescription: validatedData.storeDescription,
          sellerType: validatedData.sellerType,
          businessNumber: validatedData.businessNumber
        }
      })

      return user
    })

    // Sign in the user automatically after registration
    const signInResult = await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    })

    if (signInResult?.error) {
      // User created but sign in failed - still success
      console.warn('Seller created but auto sign-in failed:', signInResult.error)
    }

    return {
      success: true,
      message: 'Seller account created successfully',
      redirectTo: '/dashboard'
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation failed',
        errors: error.flatten().fieldErrors
      }
    }

    console.error('Seller registration error:', error)
    return {
      success: false,
      message: 'An error occurred during seller registration'
    }
  }
}



export async function getCurrentUser() {
  try {
    const session = await auth()

    if (!session?.user?.email) return null

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        seller: true,
        addresses: true
      }
    })

    return user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

// Google OAuth action
export async function googleSignInAction() {
  try {
    await signIn('google', { redirectTo: '/' })
  } catch (error) {
    console.error('Google sign in error:', error)
    throw error
  }
}
