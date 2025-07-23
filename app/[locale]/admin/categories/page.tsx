import { getCategories } from '@/lib/actions/categories'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, FolderTree, Eye, Edit, Trash2, Tag } from 'lucide-react'
import { CategoryCRUD } from '@/components/admin/category-crud'

// Force dynamic rendering to prevent build-time database calls
export const dynamic = 'force-dynamic'

export default async function CategoriesManagement() {
  const categories = await getCategories()
  
  // Separate root categories and subcategories for stats
  const rootCategories = categories.filter(cat => cat.level === 0)
  const subcategories = categories.filter(cat => cat.level > 0)
  const activeCategories = categories.filter(cat => cat.isActive)
  const totalProducts = categories.reduce((sum, cat) => sum + (cat._count?.products || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
                <p className="text-sm text-gray-600">Manage product categories and subcategories</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-gradient-to-r from-[#09B1BA] to-[#078A91] hover:from-[#078A91] hover:to-[#067A81] text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Total Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{rootCategories.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Main categories</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FolderTree className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Subcategories</p>
                  <p className="text-2xl font-bold text-gray-900">{subcategories.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Sub-level categories</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FolderTree className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Active Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{activeCategories.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Currently active</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                  <p className="text-xs text-gray-500 mt-1">Across all categories</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category CRUD Component */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Category Management</CardTitle>
                <CardDescription>
                  Create, edit, and manage categories and subcategories
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <CategoryCRUD categories={categories} />
            </Suspense>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
