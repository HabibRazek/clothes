import { getAdminStats } from '@/lib/actions/admin'
import DashboardContent from '@/components/admin/dashboard-content'

export default async function AdminDashboard() {
  const stats = await getAdminStats()

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, manage your marketplace</p>
      </div>

      <div className="max-w-7xl mx-auto">
        <DashboardContent stats={stats} />
      </div>
    </div>
  )
}
