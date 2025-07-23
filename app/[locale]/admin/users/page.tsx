import { getUsers } from '@/lib/actions/admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { UserManagementTable } from '@/components/admin/user-management-table'
import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'

// Force dynamic rendering to prevent build-time database calls
export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
  }>
}

export default async function UsersManagement({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const search = params.search || ''

  const { users, total, pages, currentPage } = await getUsers(page, 10, search)

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
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">Manage all users in your marketplace</p>
      </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Buyers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.role === 'BUYER').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Sellers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.role === 'SELLER').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.role === 'ADMIN').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Users</CardTitle>
            <CardDescription>Find users by name, email, or other criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <form method="GET" className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  name="search"
                  placeholder="Search by name, email..."
                  defaultValue={search}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
              {search && (
                <Link href="/admin/users">
                  <Button variant="outline">Clear</Button>
                </Link>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({total})</CardTitle>
            <CardDescription>
              Showing {users.length} of {total} users
              {search && ` matching "${search}"`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <UserManagementTable users={users} />
            </Suspense>
            
            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: pages }, (_, i) => i + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/admin/users?page=${pageNum}${search ? `&search=${search}` : ''}`}
                  >
                    <Button
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                    >
                      {pageNum}
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  )
}
