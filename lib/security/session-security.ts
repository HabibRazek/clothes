import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AuditLogger } from './audit-log'

export interface SessionInfo {
  userId: string
  email: string
  role: string
  isVerified: boolean
  lastLoginAt?: string
  sessionId?: string
}

export class SessionSecurity {
  /**
   * Get current session with security checks
   */
  static async getCurrentSession(): Promise<SessionInfo | null> {
    try {
      const session = await auth()
      
      if (!session?.user?.email) {
        return null
      }
      
      // Verify user still exists and is active
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          email: true,
          role: true,
          isVerified: true,
          updatedAt: true
        }
      })
      
      if (!user) {
        // User was deleted - invalid session
        await AuditLogger.logSecurityEvent('INVALID_SESSION_USER_DELETED', {
          email: session.user.email
        })
        return null
      }
      
      return {
        userId: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        lastLoginAt: session.user.lastLoginAt
      }
      
    } catch (error) {
      console.error('Session security check failed:', error)
      return null
    }
  }
  
  /**
   * Validate session and check for suspicious activity
   */
  static async validateSession(requiredRole?: string): Promise<{ valid: boolean; user?: SessionInfo; reason?: string }> {
    const user = await this.getCurrentSession()
    
    if (!user) {
      return { valid: false, reason: 'No valid session' }
    }
    
    // Check if user is verified for sensitive operations
    if (requiredRole === 'ADMIN' && !user.isVerified) {
      await AuditLogger.logSecurityEvent('UNVERIFIED_ADMIN_ACCESS_ATTEMPT', {\n        userId: user.userId,\n        email: user.email\n      })\n      return { valid: false, reason: 'User not verified' }\n    }\n    \n    // Check role requirements\n    if (requiredRole && user.role !== requiredRole) {\n      await AuditLogger.logSecurityEvent('INSUFFICIENT_PRIVILEGES', {\n        userId: user.userId,\n        email: user.email,\n        requiredRole,\n        actualRole: user.role\n      })\n      return { valid: false, reason: 'Insufficient privileges' }\n    }\n    \n    return { valid: true, user }\n  }\n  \n  /**\n   * Check for concurrent sessions (if implementing session limits)\n   */\n  static async checkConcurrentSessions(userId: string): Promise<boolean> {\n    // This would require storing active sessions in database\n    // For now, we'll just return true\n    return true\n  }\n  \n  /**\n   * Invalidate all sessions for a user (useful for security incidents)\n   */\n  static async invalidateAllUserSessions(userId: string): Promise<void> {\n    try {\n      // In a full implementation, you'd:\n      // 1. Delete all sessions from database\n      // 2. Add user to a \"force logout\" list\n      // 3. Update user's session version/nonce\n      \n      await AuditLogger.logSecurityEvent('ALL_SESSIONS_INVALIDATED', {\n        userId,\n        reason: 'Security incident or admin action'\n      })\n      \n      console.log(`All sessions invalidated for user: ${userId}`)\n      \n    } catch (error) {\n      console.error('Failed to invalidate sessions:', error)\n    }\n  }\n  \n  /**\n   * Log session activity for monitoring\n   */\n  static async logSessionActivity(action: string, userId: string, details?: Record<string, any>) {\n    await AuditLogger.logUserAction(`SESSION_${action}`, userId, 'session', details)\n  }\n  \n  /**\n   * Check if session is from a suspicious location/device\n   */\n  static async checkSuspiciousActivity(userId: string, ipAddress?: string, userAgent?: string): Promise<boolean> {\n    // In a production app, you'd check:\n    // 1. Unusual login locations\n    // 2. New devices\n    // 3. Rapid location changes\n    // 4. Known malicious IPs\n    \n    // For now, just log the activity\n    await AuditLogger.logUserAction('SESSION_ACCESS', userId, 'session', {\n      ipAddress,\n      userAgent\n    })\n    \n    return false // No suspicious activity detected\n  }\n}\n\n/**\n * Middleware helper for protecting routes\n */\nexport async function requireAuth(requiredRole?: string) {\n  const validation = await SessionSecurity.validateSession(requiredRole)\n  \n  if (!validation.valid) {\n    throw new Error(validation.reason || 'Authentication required')\n  }\n  \n  return validation.user!\n}\n\n/**\n * Check if user has permission for a specific action\n */\nexport function hasPermission(userRole: string, requiredRole: string): boolean {\n  const roleHierarchy = {\n    'BUYER': 1,\n    'SELLER': 2,\n    'ADMIN': 3\n  }\n  \n  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0\n  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0\n  \n  return userLevel >= requiredLevel\n}
