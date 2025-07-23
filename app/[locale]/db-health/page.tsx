import { checkDatabaseConnection, getDatabaseStats } from '@/lib/utils/db-health'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Database, Users, Package, ShoppingCart, FolderTree } from 'lucide-react'

// Force dynamic rendering to prevent build-time database calls
export const dynamic = 'force-dynamic'

export default async function DatabaseHealthPage() {
  const connectionResult = await checkDatabaseConnection()
  const statsResult = await getDatabaseStats()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Health Check</h1>
          <p className="text-gray-600">Monitor database connection and statistics</p>
        </div>

        {/* Connection Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Connection
            </CardTitle>
            <CardDescription>Current database connection status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {connectionResult.success ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Connected
                  </Badge>
                  <span className="text-sm text-gray-600">{connectionResult.message}</span>
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-600" />
                  <Badge variant="destructive">
                    Disconnected
                  </Badge>
                  <span className="text-sm text-gray-600">{connectionResult.message}</span>
                </>
              )}
            </div>
            
            {!connectionResult.success && connectionResult.error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Error:</strong> {connectionResult.error}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Database Statistics */}
        {statsResult.success && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Statistics
              </CardTitle>
              <CardDescription>Current data counts in the database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{statsResult.stats?.users || 0}</p>
                    <p className="text-sm text-gray-600">Users</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{statsResult.stats?.products || 0}</p>
                    <p className="text-sm text-gray-600">Products</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{statsResult.stats?.orders || 0}</p>
                    <p className="text-sm text-gray-600">Orders</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FolderTree className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{statsResult.stats?.categories || 0}</p>
                    <p className="text-sm text-gray-600">Categories</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!statsResult.success && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                Database Statistics Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Error:</strong> {statsResult.message}
                </p>
                {statsResult.error && (
                  <p className="text-xs text-red-600 mt-1">{statsResult.error}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Connection Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Connection Information</CardTitle>
            <CardDescription>Database connection details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Database:</strong> Neon PostgreSQL
              </div>
              <div>
                <strong>Host:</strong> ep-icy-sea-a8ibo64j-pooler.eastus2.azure.neon.tech
              </div>
              <div>
                <strong>Database Name:</strong> clothes_db
              </div>
              <div>
                <strong>SSL Mode:</strong> Required
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Troubleshooting Tips</CardTitle>
            <CardDescription>Common solutions for database connection issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <strong>Neon Free Tier Sleep:</strong> Free tier databases sleep after inactivity. 
                Run <code className="bg-gray-100 px-1 rounded">npx prisma db push</code> to wake it up.
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <strong>Connection Timeout:</strong> If connection fails, wait a few seconds and refresh the page.
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <strong>Schema Sync:</strong> Run <code className="bg-gray-100 px-1 rounded">npx prisma generate</code> 
                if you see schema-related errors.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
