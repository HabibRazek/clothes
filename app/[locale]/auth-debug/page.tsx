import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Force dynamic rendering to prevent build-time database calls
export const dynamic = 'force-dynamic'

export default async function AuthDebugPage() {
  let session = null
  let sessionError = null
  let dbConnection = null
  let dbError = null
  let userCount = 0

  // Test session
  try {
    session = await auth()
  } catch (error) {
    sessionError = error instanceof Error ? error.message : 'Unknown session error'
  }

  // Test database connection
  try {
    userCount = await prisma.user.count()
    dbConnection = 'Connected'
  } catch (error) {
    dbError = error instanceof Error ? error.message : 'Unknown database error'
    dbConnection = 'Failed'
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Authentication Debug Page</h1>
          <p className="text-gray-600">Diagnostic information for authentication system</p>
        </div>

        {/* Session Status */}
        <Card>
          <CardHeader>
            <CardTitle>Session Status</CardTitle>
            <CardDescription>Current authentication session</CardDescription>
          </CardHeader>
          <CardContent>
            {sessionError ? (
              <div className="space-y-2">
                <Badge variant="destructive">Session Error</Badge>
                <p className="text-red-600 text-sm">{sessionError}</p>
              </div>
            ) : session ? (
              <div className="space-y-4">
                <Badge variant="default" className="bg-green-600">Authenticated</Badge>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">User Info</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>ID:</strong> {session.user.id}</p>
                      <p><strong>Email:</strong> {session.user.email}</p>
                      <p><strong>Name:</strong> {session.user.name}</p>
                      <p><strong>Role:</strong> {session.user.role}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Session Details</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Expires:</strong> {new Date(session.expires).toLocaleString()}</p>
                      <p><strong>Image:</strong> {session.user.image ? 'Yes' : 'No'}</p>
                      <p><strong>Verified:</strong> {session.user.isVerified ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <Badge variant="secondary">Not Authenticated</Badge>
                <p className="text-gray-600 mt-2">No active session found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Database Status */}
        <Card>
          <CardHeader>
            <CardTitle>Database Status</CardTitle>
            <CardDescription>Database connection and data</CardDescription>
          </CardHeader>
          <CardContent>
            {dbError ? (
              <div className="space-y-2">
                <Badge variant="destructive">Database Error</Badge>
                <p className="text-red-600 text-sm">{dbError}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Badge variant="default" className="bg-green-600">Connected</Badge>
                <p className="text-sm"><strong>Total Users:</strong> {userCount}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Environment Check */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Configuration</CardTitle>
            <CardDescription>Check environment variables</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Auth.js Config</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>AUTH_SECRET:</strong> {process.env.AUTH_SECRET ? '✅ Set' : '❌ Missing'}</p>
                  <p><strong>AUTH_URL:</strong> {process.env.AUTH_URL || '❌ Missing'}</p>
                  <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Database & OAuth</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>DATABASE_URL:</strong> {process.env.DATABASE_URL ? '✅ Set' : '❌ Missing'}</p>
                  <p><strong>GOOGLE_ID:</strong> {process.env.AUTH_GOOGLE_ID ? '✅ Set' : '❌ Missing'}</p>
                  <p><strong>GOOGLE_SECRET:</strong> {process.env.AUTH_GOOGLE_SECRET ? '✅ Set' : '❌ Missing'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Accounts */}
        <Card>
          <CardHeader>
            <CardTitle>Test Accounts</CardTitle>
            <CardDescription>Available test accounts for login</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-red-600">Admin</h3>
                <p className="text-sm">admin@example.com</p>
                <p className="text-sm">admin123</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-blue-600">Buyer</h3>
                <p className="text-sm">buyer@example.com</p>
                <p className="text-sm">password123</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-green-600">Seller</h3>
                <p className="text-sm">seller@example.com</p>
                <p className="text-sm">password123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Test authentication flows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <a href="/en/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Test Login
              </a>
              <a href="/en/signup" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Test Signup
              </a>
              <a href="/api/auth/signin" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                Auth.js Sign In
              </a>
              <a href="/api/auth/signout" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Auth.js Sign Out
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
