import { NextRequest } from 'next/server'

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  keyGenerator?: (req: NextRequest) => string
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store (in production, use Redis or similar)
const store = new Map<string, RateLimitEntry>()

export class RateLimiter {
  private config: RateLimitConfig
  
  constructor(config: RateLimitConfig) {
    this.config = config
  }
  
  private getKey(req: NextRequest): string {
    if (this.config.keyGenerator) {
      return this.config.keyGenerator(req)
    }
    
    // Default: use IP address
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : req.ip || 'unknown'
    return `rate_limit:${ip}`
  }
  
  private cleanupExpired() {
    const now = Date.now()
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetTime) {
        store.delete(key)
      }
    }
  }
  
  check(req: NextRequest): { allowed: boolean; remaining: number; resetTime: number } {
    this.cleanupExpired()
    
    const key = this.getKey(req)
    const now = Date.now()
    const resetTime = now + this.config.windowMs
    
    const entry = store.get(key)
    
    if (!entry || now > entry.resetTime) {
      // First request or window expired
      store.set(key, { count: 1, resetTime })
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime
      }
    }
    
    if (entry.count >= this.config.maxRequests) {
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime
      }
    }
    
    // Increment counter
    entry.count++
    store.set(key, entry)
    
    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetTime: entry.resetTime
    }
  }
}

// Pre-configured rate limiters
export const authRateLimit = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 login attempts per 15 minutes
  keyGenerator: (req) => {
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : req.ip || 'unknown'
    return `auth:${ip}`
  }
})

export const apiRateLimit = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
})

export const strictRateLimit = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute
})
