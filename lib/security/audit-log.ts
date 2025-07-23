export interface AuditLogEntry {
  userId?: string
  action: string
  resource?: string
  details?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  success: boolean
  timestamp: Date
}

export class AuditLogger {
  static async log(entry: Omit<AuditLogEntry, 'timestamp'>) {
    try {
      // In a production app, you'd want a separate audit_logs table
      // For now, we'll log to console and could extend to database
      const logEntry = {
        ...entry,
        timestamp: new Date()
      }
      
      console.log('AUDIT LOG:', JSON.stringify(logEntry, null, 2))
      
      // TODO: Store in database audit_logs table
      // await prisma.auditLog.create({ data: logEntry })
      
    } catch (error) {
      console.error('Failed to write audit log:', error)
    }
  }
  
  static async logAuth(action: 'LOGIN' | 'LOGOUT' | 'SIGNUP' | 'PASSWORD_CHANGE', userId?: string, success: boolean = true, details?: Record<string, any>) {
    await this.log({
      userId,
      action: `AUTH_${action}`,
      resource: 'authentication',
      details,
      success
    })
  }
  
  static async logUserAction(action: string, userId: string, resource?: string, details?: Record<string, any>) {
    await this.log({
      userId,
      action,
      resource,
      details,
      success: true
    })
  }
  
  static async logSecurityEvent(action: string, details: Record<string, any>, success: boolean = false) {
    await this.log({
      action: `SECURITY_${action}`,
      resource: 'security',
      details,
      success
    })
  }
}
