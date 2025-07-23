import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Store, UserCheck, Search, Filter, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function SellersPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Seller Management</h1>
        <p className="text-gray-600 mt-2">Manage seller accounts and verification</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-[#09B1BA]" />
            Sellers
          </CardTitle>
          <CardDescription>Coming soon...</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Seller management features will be available here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
