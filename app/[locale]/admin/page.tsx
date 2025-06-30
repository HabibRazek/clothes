import { getAdminStats } from '@/lib/actions/admin'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/actions/auth'
import AdminDashboardLayout from '@/components/admin/admin-dashboard-layout'

export default async function AdminDashboard() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'ADMIN') {
    redirect('/')
  }

  const stats = await getAdminStats()

  return (
    <AdminDashboardLayout stats={stats} />
  )
}
