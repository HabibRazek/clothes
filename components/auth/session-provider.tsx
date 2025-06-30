'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'

interface SessionProviderProps {
  children: React.ReactNode
  session?: Session | null
}

export function SessionProvider({ children, session }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider
      session={session}
      refetchInterval={0} // Disable automatic refetching
      refetchOnWindowFocus={false} // Disable refetch on window focus
      refetchWhenOffline={false} // Disable refetch when offline
      basePath="/api/auth" // Explicitly set base path
    >
      {children}
    </NextAuthSessionProvider>
  )
}
