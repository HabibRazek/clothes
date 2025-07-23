import { getSellerProducts } from '@/lib/actions/products'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ProductManagementTable } from '@/components/seller/product-management-table'
import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Search, Package } from 'lucide-react'

// Force dynamic rendering to prevent build-time database calls
export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
  }>
}

export default async function ProductsManagement({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const search = params.search || ''
  
  const { products, total, pages, currentPage } = await getSellerProducts(page, 10, search)
  
  // Calculate stats
  const activeProducts = products.filter(p => p.status === 'ACTIVE').length
  const pendingProducts = products.filter(p => p.status === 'PENDING_APPROVAL').length
  const inactiveProducts = products.filter(p => p.status === 'INACTIVE').length
  const totalViews = products.reduce((sum, p) => sum + p.views, 0)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            <Link href="/dashboard/products/new">
              <Button className="bg-[#09B1BA] hover:bg-[#078A91]">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-600 mt-2">Manage your product listings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total}</div>
              <p className="text-xs text-muted-foreground">
                All your listings
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeProducts}</div>
              <p className="text-xs text-muted-foreground">
                Live on marketplace
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingProducts}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting review
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Product page views
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Products</CardTitle>
            <CardDescription>Find your products by title, brand, or description</CardDescription>
          </CardHeader>
          <CardContent>
            <form method="GET" className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  name="search"
                  placeholder="Search by title, brand, description..."
                  defaultValue={search}
                  className="pl-10"
                />
              </div>
              <Button type="submit" className="bg-[#09B1BA] hover:bg-[#078A91]">
                Search
              </Button>
              {search && (
                <Link href="/dashboard/products">
                  <Button variant="outline">Clear</Button>
                </Link>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Products ({total})
                </CardTitle>
                <CardDescription>
                  Showing {products.length} of {total} products
                  {search && ` matching "${search}"`}
                </CardDescription>
              </div>
              <Link href="/dashboard/products/new">
                <Button className="bg-[#09B1BA] hover:bg-[#078A91]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <ProductManagementTable products={products} />
            </Suspense>
            
            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: pages }, (_, i) => i + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/dashboard/products?page=${pageNum}${search ? `&search=${search}` : ''}`}
                  >
                    <Button
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      className={pageNum === currentPage ? "bg-[#09B1BA] hover:bg-[#078A91]" : ""}
                    >
                      {pageNum}
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Empty State */}
        {total === 0 && !search && (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-600 mb-6">
                Start selling by adding your first product to the marketplace.
              </p>
              <Link href="/dashboard/products/new">
                <Button className="bg-[#09B1BA] hover:bg-[#078A91]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
