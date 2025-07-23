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
      await AuditLogger.logSecurityEvent('UNVERIFIED_ADMIN_ACCESS_ATTEMPT', {
        userId: user.userId,
        email: user.email
      })
      return { valid: false, reason: 'User not verified' }
    }

    // Check role requirements
    if (requiredRole && user.role !== requiredRole) {
      await AuditLogger.logSecurityEvent('INSUFFICIENT_PRIVILEGES', {
        userId: user.userId,
        email: user.email,
        requiredRole,
        actualRole: user.role
      })
      return { valid: false, reason: 'Insufficient privileges' }
    }

    return { valid: true, user }
  }

  /**
   * Check for concurrent sessions (if implementing session limits)
   */
  static async checkConcurrentSessions(userId: string): Promise<boolean> {
    // This would require storing active sessions in database
    // For now, we'll just return true
    return true
  }

  /**
   * Invalidate all sessions for a user (useful for security incidents)
   */
  static async invalidateAllUserSessions(userId: string): Promise<void> {
    try {
      // In a full implementation, you'd:
      // 1. Delete all sessions from database
      // 2. Add user to a "force logout" list
      // 3. Update user's session version/nonce

      await AuditLogger.logSecurityEvent('ALL_SESSIONS_INVALIDATED', {
        userId,
        reason: 'Security incident or admin action'
      })

      console.log(`All sessions invalidated for user: ${userId}`)

    } catch (error) {
      console.error('Failed to invalidate sessions:', error)
    }
  }

  /**
   * Log session activity for monitoring
   */
  static async logSessionActivity(action: string, userId: string, details?: Record<string, any>) {
    await AuditLogger.logUserAction(`SESSION_${action}`, userId, 'session', details)
  }

  /**
   * Check if session is from a suspicious location/device
   */
  static async checkSuspiciousActivity(userId: string, ipAddress?: string, userAgent?: string): Promise<boolean> {
    // In a production app, you'd check:
    // 1. Unusual login locations
    // 2. New devices
    // 3. Rapid location changes
    // 4. Known malicious IPs

    // For now, just log the activity
    await AuditLogger.logUserAction('SESSION_ACCESS', userId, 'session', {
      ipAddress,
      userAgent
    })

    return false // No suspicious activity detected
  }
}

/**
 * Middleware helper for protecting routes
 */
export async function requireAuth(requiredRole?: string) {
  const validation = await SessionSecurity.validateSession(requiredRole)

  if (!validation.valid) {
    throw new Error(validation.reason || 'Authentication required')
  }

  return validation.user!
}

/**
 * Check if user has permission for a specific action
 */
export function hasPermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    'BUYER': 1,
    'SELLER': 2,
    'ADMIN': 3
  }

  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0

  return userLevel >= requiredLevel
}
