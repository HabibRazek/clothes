import { getCurrentUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import AdminLayoutClient from '@/components/admin/admin-layout-client'

interface AdminLayoutWrapperProps {
  children: React.ReactNode
}

export default async function AdminLayoutWrapper({
  children,
}: AdminLayoutWrapperProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'ADMIN') {
    redirect('/')
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
