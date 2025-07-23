import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  Package, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Eye,
  Edit,
  BarChart3,
  Users,
  Star
} from 'lucide-react'

// Mock data - replace with real data from database
const sellerStats = {
  totalProducts: 24,
  activeProducts: 18,
  totalOrders: 156,
  pendingOrders: 8,
  totalEarnings: 4250.50,
  monthlyEarnings: 850.25,
  averageRating: 4.7,
  totalReviews: 89
}

const recentProducts = [
  {
    id: '1',
    name: 'Robe d\'été fleurie',
    category: 'Vêtements Femmes',
    price: 45.99,
    status: 'active',
    views: 234,
    orders: 12
  },
  {
    id: '2',
    name: 'Sneakers blanches',
    category: 'Chaussures Femmes',
    price: 89.99,
    status: 'active',
    views: 189,
    orders: 8
  },
  {
    id: '3',
    name: 'Sac à main cuir',
    category: 'Sacs à main',
    price: 125.00,
    status: 'pending',
    views: 156,
    orders: 5
  }
]

const recentOrders = [
  {
    id: 'ORD-001',
    product: 'Robe d\'été fleurie',
    customer: 'Marie Dubois',
    amount: 45.99,
    status: 'shipped',
    date: '2024-01-15'
  },
  {
    id: 'ORD-002',
    product: 'Sneakers blanches',
    customer: 'Sophie Martin',
    amount: 89.99,
    status: 'processing',
    date: '2024-01-14'
  },
  {
    id: 'ORD-003',
    product: 'Sac à main cuir',
    customer: 'Julie Leroy',
    amount: 125.00,
    status: 'pending',
    date: '2024-01-13'
  }
]

export default function SellerDashboard() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your products and track your sales</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{sellerStats.totalProducts}</p>
                <p className="text-xs text-gray-500 mt-1">{sellerStats.activeProducts} active</p>
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
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{sellerStats.totalOrders}</p>
                <p className="text-xs text-gray-500 mt-1">{sellerStats.pendingOrders} pending</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">€{sellerStats.totalEarnings}</p>
                <p className="text-xs text-gray-500 mt-1">€{sellerStats.monthlyEarnings} this month</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{sellerStats.averageRating}</p>
                <p className="text-xs text-gray-500 mt-1">{sellerStats.totalReviews} reviews</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-2 border-dashed border-gray-200 hover:border-[#09B1BA] transition-colors">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-[#09B1BA] rounded-lg flex items-center justify-center mx-auto mb-4">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Add New Product</h3>
            <p className="text-gray-600 text-sm mb-4">Create a new product listing</p>
            <Link href="/seller/products/new">
              <Button className="bg-gradient-to-r from-[#09B1BA] to-[#078A91]">
                Add Product
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed border-gray-200 hover:border-green-500 transition-colors">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">View Analytics</h3>
            <p className="text-gray-600 text-sm mb-4">Track your sales performance</p>
            <Link href="/seller/analytics">
              <Button variant="outline">
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed border-gray-200 hover:border-purple-500 transition-colors">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Orders</h3>
            <p className="text-gray-600 text-sm mb-4">Process pending orders</p>
            <Link href="/seller/orders">
              <Button variant="outline">
                View Orders
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products and Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Products</CardTitle>
                <CardDescription>Your latest product listings</CardDescription>
              </div>
              <Link href="/seller/products">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.category}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm font-medium">€{product.price}</span>
                      <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                        {product.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Eye className="w-4 h-4" />
                      <span>{product.views}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                      <ShoppingBag className="w-4 h-4" />
                      <span>{product.orders}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </div>
              <Link href="/seller/orders">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{order.id}</h4>
                    <p className="text-sm text-gray-600">{order.product}</p>
                    <p className="text-sm text-gray-500">by {order.customer}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">€{order.amount}</div>
                    <Badge 
                      variant={
                        order.status === 'shipped' ? 'default' : 
                        order.status === 'processing' ? 'secondary' : 
                        'outline'
                      }
                      className="mt-1"
                    >
                      {order.status}
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">{order.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
