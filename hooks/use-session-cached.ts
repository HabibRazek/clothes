'use client'

import { useSession } from 'next-auth/react'
import { useRef, useEffect } from 'react'

export function useSessionCached() {
  const { data: session, status } = useSession()
  const cachedSession = useRef(session)
  const cachedStatus = useRef(status)

  // Only update cache when session actually changes
  useEffect(() => {
    if (session !== cachedSession.current) {
      cachedSession.current = session
    }
  }, [session])

  useEffect(() => {
    if (status !== cachedStatus.current) {
      cachedStatus.current = status
    }
  }, [status])

  return {
    data: cachedSession.current,
    status: cachedStatus.current
  }
}
