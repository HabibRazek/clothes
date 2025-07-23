import { getCategories } from '@/lib/actions/categories'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Suspense } from 'react'
import Link from 'next/link'
import { Plus, Package, Eye, Edit, Trash2 } from 'lucide-react'
import { SellerProductCRUD } from '@/components/seller/seller-product-crud'

// Mock products data - replace with real data from database
const sellerProducts = [
  {
    id: '1',
    name: 'Robe d\'été fleurie',
    description: 'Belle robe d\'été avec motifs floraux',
    price: 45.99,
    category: { id: '1', name: 'Vêtements Femmes' },
    subcategory: { id: '2', name: 'Robes' },
    images: ['/placeholder-product.jpg'],
    status: 'active',
    stock: 15,
    views: 234,
    orders: 12,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Sneakers blanches',
    description: 'Sneakers confortables en cuir blanc',
    price: 89.99,
    category: { id: '2', name: 'Chaussures Femmes' },
    subcategory: { id: '3', name: 'Sneakers' },
    images: ['/placeholder-product.jpg'],
    status: 'active',
    stock: 8,
    views: 189,
    orders: 8,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '3',
    name: 'Sac à main cuir',
    description: 'Sac à main en cuir véritable',
    price: 125.00,
    category: { id: '3', name: 'Sacs à main' },
    subcategory: { id: '4', name: 'Sacs de jour' },
    images: ['/placeholder-product.jpg'],
    status: 'pending',
    stock: 5,
    views: 156,
    orders: 5,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-10')
  }
]

export default async function SellerProducts() {
  const categories = await getCategories()
  
  // Calculate stats
  const totalProducts = sellerProducts.length
  const activeProducts = sellerProducts.filter(p => p.status === 'active').length
  const pendingProducts = sellerProducts.filter(p => p.status === 'pending').length
  const totalStock = sellerProducts.reduce((sum, p) => sum + p.stock, 0)
  const totalViews = sellerProducts.reduce((sum, p) => sum + p.views, 0)
  const totalOrders = sellerProducts.reduce((sum, p) => sum + p.orders, 0)

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
            <p className="text-gray-600 mt-2">Manage your product listings</p>
          </div>
          <Link href="/seller/products/new">
            <Button className="bg-gradient-to-r from-[#09B1BA] to-[#078A91] hover:from-[#078A91] hover:to-[#067A81] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{activeProducts}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingProducts}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Stock</p>
                <p className="text-2xl font-bold text-gray-900">{totalStock}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{totalViews}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product CRUD Component */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>
                Create, edit, and manage your product listings
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <SellerProductCRUD 
              products={sellerProducts} 
              categories={categories}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
