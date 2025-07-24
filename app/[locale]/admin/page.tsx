import { getAdminStats } from '@/lib/actions/admin'
import DashboardContent from '@/components/admin/dashboard-content'
import { AdminStats } from '@/lib/types/admin'

// Force dynamic rendering to prevent build-time database calls
export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const statsResult = await getAdminStats()

  // Explicit type assertion to ensure compatibility
  const stats: AdminStats = {
    totalUsers: statsResult.totalUsers,
    totalSellers: statsResult.totalSellers,
    totalBuyers: statsResult.totalBuyers,
    totalProducts: statsResult.totalProducts,
    totalOrders: statsResult.totalOrders,
    recentUsers: statsResult.recentUsers,
    recentOrders: statsResult.recentOrders
  }

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
