'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { logoutAction } from '@/lib/actions/auth'

interface LogoutButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  showIcon?: boolean
  children?: React.ReactNode
  className?: string
}

export function LogoutButton({
  variant = 'ghost',
  size = 'default',
  showIcon = true,
  children,
  className
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      // Use server action for logout with audit logging
      const result = await logoutAction()

      if (result.success) {
        // Also sign out on client side
        await signOut({
          redirect: false,
          callbackUrl: '/'
        })

        toast.success(result.message)

        // Redirect to home page
        router.push('/')
        router.refresh()
      } else {
        toast.error(result.message)
      }

    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to log out')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {showIcon && <LogOut className="h-4 w-4 mr-2" />}
          {children || 'Logout'}
        </>
      )}
    </Button>
  )
}
