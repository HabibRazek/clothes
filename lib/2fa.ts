import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import crypto from 'crypto'

export interface TwoFactorSetup {
  secret: string
  qrCodeUrl: string
  backupCodes: string[]
  manualEntryKey: string
}

export interface TwoFactorVerification {
  isValid: boolean
  usedBackupCode?: boolean
}

/**
 * Generate a new 2FA secret and QR code for user setup
 */
export async function generateTwoFactorSetup(
  userEmail: string,
  serviceName: string = 'Clothes Marketplace'
): Promise<TwoFactorSetup> {
  // Generate secret
  const secret = speakeasy.generateSecret({
    name: userEmail,
    issuer: serviceName,
    length: 32
  })

  // Generate QR code
  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!)

  // Generate backup codes
  const backupCodes = generateBackupCodes()

  return {
    secret: secret.base32!,
    qrCodeUrl,
    backupCodes,
    manualEntryKey: secret.base32!
  }
}

/**
 * Verify a TOTP token or backup code
 */
export function verifyTwoFactorToken(
  token: string,
  secret: string,
  backupCodes: string[] = []
): TwoFactorVerification {
  // First try to verify as TOTP token
  const isValidTOTP = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2 // Allow 2 time steps (60 seconds) of tolerance
  })

  if (isValidTOTP) {
    return { isValid: true, usedBackupCode: false }
  }

  // If TOTP fails, check backup codes
  const normalizedToken = token.replace(/\s/g, '').toLowerCase()
  const isValidBackupCode = backupCodes.some(code => 
    code.toLowerCase() === normalizedToken
  )

  if (isValidBackupCode) {
    return { isValid: true, usedBackupCode: true }
  }

  return { isValid: false }
}

/**
 * Generate backup codes for 2FA
 */
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = []
  
  for (let i = 0; i < count; i++) {
    // Generate 8-character alphanumeric code
    const code = crypto.randomBytes(4).toString('hex').toUpperCase()
    // Format as XXXX-XXXX
    const formattedCode = `${code.slice(0, 4)}-${code.slice(4, 8)}`
    codes.push(formattedCode)
  }
  
  return codes
}

/**
 * Remove a used backup code from the list
 */
export function removeUsedBackupCode(
  backupCodes: string[],
  usedCode: string
): string[] {
  const normalizedUsedCode = usedCode.replace(/\s/g, '').toLowerCase()
  return backupCodes.filter(code => 
    code.toLowerCase() !== normalizedUsedCode
  )
}

/**
 * Generate a new set of backup codes (for regeneration)
 */
export function regenerateBackupCodes(): string[] {
  return generateBackupCodes()
}

/**
 * Validate backup code format
 */
export function isValidBackupCodeFormat(code: string): boolean {
  const normalizedCode = code.replace(/\s/g, '')
  // Should be 8 characters, alphanumeric
  return /^[A-Fa-f0-9]{8}$/.test(normalizedCode)
}

/**
 * Validate TOTP token format
 */
export function isValidTOTPFormat(token: string): boolean {
  // Should be 6 digits
  return /^\d{6}$/.test(token.replace(/\s/g, ''))
}
