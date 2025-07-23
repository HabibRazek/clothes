import { getCurrentUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'

interface CategoriesLayoutProps {
  children: React.ReactNode
}

export default async function CategoriesLayout({
  children,
}: CategoriesLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'ADMIN') {
    redirect('/')
  }

  // Return children directly without any admin layout wrapper
  return <>{children}</>
}
