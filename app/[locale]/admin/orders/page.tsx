import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/actions/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Package, Search, Filter } from 'lucide-react'
import Link from 'next/link'

export default async function OrdersPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600 mt-2">Manage all orders and transactions</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#09B1BA]" />
                Orders
              </CardTitle>
              <CardDescription>Coming soon...</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Order management features will be available here.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
