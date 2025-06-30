import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/actions/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, TrendingUp, Users, ShoppingBag, DollarSign, Activity } from 'lucide-react'
import Link from 'next/link'

export default async function AnalyticsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar placeholder - you can extract this to a shared component */}
      <div className="flex">
        <div className="w-64 bg-white shadow-xl">
          <div className="p-6">
            <Link href="/admin" className="text-[#09B1BA] hover:text-[#078A91]">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
        
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-2">Detailed analytics and insights</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#09B1BA]" />
                  Sales Analytics
                </CardTitle>
                <CardDescription>Coming soon...</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Advanced sales analytics will be available here.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#09B1BA]" />
                  User Analytics
                </CardTitle>
                <CardDescription>Coming soon...</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">User behavior and engagement analytics.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[#09B1BA]" />
                  Performance
                </CardTitle>
                <CardDescription>Coming soon...</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Platform performance metrics.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
