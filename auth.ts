import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials)

          const user = await prisma.user.findUnique({
            where: { email },
            include: { seller: true }
          })

          if (!user || !user.password) {
            return null
          }

          const isValidPassword = await bcrypt.compare(password, user.password)
          if (!isValidPassword) {
            return null
          }

          return {
            id: user.id,
            email: user.email!,
            name: user.name || `${user.firstName} ${user.lastName}`,
            image: user.image,
            role: user.role,
            firstName: user.firstName || undefined,
            lastName: user.lastName || undefined,
            seller: user.seller,
            isVerified: user.isVerified
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.role = user.role
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.seller = user.seller
        token.isVerified = user.isVerified
        token.lastLoginAt = new Date().toISOString()

        // Update last login in database
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              updatedAt: new Date()
            }
          })
        } catch (error) {
          console.error('Failed to update last login:', error)
        }
      }

      // Handle session updates
      if (trigger === "update" && session) {
        // Refresh user data from database
        try {
          const updatedUser = await prisma.user.findUnique({
            where: { id: token.sub },
            include: { seller: true }
          })

          if (updatedUser) {
            token.role = updatedUser.role
            token.firstName = updatedUser.firstName || undefined
            token.lastName = updatedUser.lastName || undefined
            token.seller = updatedUser.seller
            token.isVerified = updatedUser.isVerified
          }
        } catch (error) {
          console.error('Failed to refresh user data:', error)
        }
      }

      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.seller = token.seller as any
        session.user.isVerified = token.isVerified as boolean
        session.user.lastLoginAt = token.lastLoginAt as string

        // Session expires is handled by Auth.js automatically
      }
      return session
    },

    async signIn({ user, account }) {
      try {
        // Rate limiting check (simple implementation)
        const now = new Date()
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

        // Check for too many login attempts
        const recentAttempts = await prisma.user.count({
          where: {
            email: user.email!,
            updatedAt: {
              gte: oneHourAgo
            }
          }
        })

        if (recentAttempts > 10) {
          console.warn(`Too many login attempts for ${user.email}`)
          return false
        }

        // Handle Google OAuth
        if (account?.provider === "google") {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (!existingUser) {
            // Create new user from Google profile
            const names = user.name?.split(' ') || []
            await prisma.user.create({
              data: {
                email: user.email!,
                firstName: names[0] || '',
                lastName: names.slice(1).join(' ') || '',
                name: user.name || '',
                image: user.image,
                emailVerified: new Date(),
                role: 'BUYER',
                isVerified: true
              }
            })
          } else {
            // Update existing user with Google data
            await prisma.user.update({
              where: { email: user.email! },
              data: {
                image: user.image || existingUser.image,
                emailVerified: existingUser.emailVerified || new Date(),
                updatedAt: new Date()
              }
            })
          }
        }

        // Log successful sign in
        console.log(`Successful sign in: ${user.email} via ${account?.provider || 'credentials'}`)
        return true

      } catch (error) {
        console.error('Sign in error:', error)
        return false
      }
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      // Default redirect to home page after successful login
      return `${baseUrl}/en`
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    },
    callbackUrl: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.callback-url' : 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    },
    csrfToken: {
      name: process.env.NODE_ENV === 'production' ? '__Host-next-auth.csrf-token' : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      console.log(`User signed in: ${user.email} (${account?.provider || 'credentials'})${isNewUser ? ' - New user' : ''}`)

      // Log to database for audit trail
      try {
        await prisma.user.update({
          where: { email: user.email! },
          data: { updatedAt: new Date() }
        })
      } catch (error) {
        console.error('Failed to log sign in event:', error)
      }
    },
    async signOut() {
      console.log('User signed out')
    },
    async createUser({ user }) {
      console.log(`New user created: ${user.email}`)
    },
    async updateUser({ user }) {
      console.log(`User updated: ${user.email}`)
    },
    async linkAccount({ user, account }) {
      console.log(`Account linked: ${user.email} -> ${account.provider}`)
    }
  },
  debug: process.env.NODE_ENV === 'development',
})