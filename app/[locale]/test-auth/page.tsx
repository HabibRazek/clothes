import { auth } from '@/auth'
import { UserMenu } from '@/components/auth/user-menu'
import { LogoutButton } from '@/components/auth/logout-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SessionSecurity } from '@/lib/security/session-security'
import Link from 'next/link'

export default async function TestAuthPage() {
  const session = await auth()
  const sessionInfo = await SessionSecurity.getCurrentSession()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Authentication Test Page</h1>
          <p className="text-gray-600">Test all authentication and security features</p>
        </div>

        {/* User Menu Demo */}
        <Card>
          <CardHeader>
            <CardTitle>User Menu Component</CardTitle>
            <CardDescription>
              Shows user info, role, and logout functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <UserMenu />
            </div>
          </CardContent>
        </Card>

        {/* Session Information */}
        <Card>
          <CardHeader>
            <CardTitle>Session Information</CardTitle>
            <CardDescription>
              Current session data and security status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {session ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Basic Info</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Email:</strong> {session.user.email}</p>
                      <p><strong>Name:</strong> {session.user.firstName} {session.user.lastName}</p>
                      <p><strong>Role:</strong> <Badge variant={session.user.role === 'ADMIN' ? 'destructive' : 'default'}>{session.user.role}</Badge></p>
                      <p><strong>Verified:</strong> <Badge variant={session.user.isVerified ? 'default' : 'secondary'}>{session.user.isVerified ? 'Yes' : 'No'}</Badge></p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Session Details</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>User ID:</strong> {session.user.id}</p>
                      <p><strong>Last Login:</strong> {session.user.lastLoginAt ? new Date(session.user.lastLoginAt).toLocaleString() : 'Unknown'}</p>
                      <p><strong>Session Expires:</strong> {new Date(session.expires).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {session.user.seller && (
                  <div>
                    <h3 className="font-semibold mb-2">Seller Info</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Store:</strong> {session.user.seller.storeName}</p>
                      <p><strong>Verified Seller:</strong> <Badge variant={session.user.seller.isVerified ? 'default' : 'secondary'}>{session.user.seller.isVerified ? 'Yes' : 'No'}</Badge></p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No active session</p>
                <div className="space-x-2">
                  <Link href="/login" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Login
                  </Link>
                  <Link href="/signup" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Features */}
        <Card>
          <CardHeader>
            <CardTitle>Security Features</CardTitle>
            <CardDescription>
              Implemented security measures and audit logging
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Authentication Security</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Password hashing with bcrypt
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    JWT session management
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Rate limiting on login attempts
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Secure HTTP-only cookies
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    CSRF protection
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Audit & Monitoring</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Login/logout audit logging
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Failed login attempt tracking
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    IP address and user agent logging
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Role-based access control
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Session validation and refresh
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        {session && (
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>
                Test authentication actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <LogoutButton variant="outline">
                  Logout (with audit logging)
                </LogoutButton>
                
                {session.user.role === 'ADMIN' && (
                  <Link href="/admin" className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                    Admin Dashboard
                  </Link>
                )}
                
                {session.user.role === 'SELLER' && (
                  <Link href="/dashboard" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    Seller Dashboard
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Test Navigation</CardTitle>
            <CardDescription>
              Test protected routes and authentication flows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/login" className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                <h3 className="font-semibold">Login Page</h3>
                <p className="text-sm text-gray-600">Test credentials login</p>
              </Link>
              
              <Link href="/signup" className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                <h3 className="font-semibold">Signup Page</h3>
                <p className="text-sm text-gray-600">Test user registration</p>
              </Link>
              
              <Link href="/sell" className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                <h3 className="font-semibold">Seller Registration</h3>
                <p className="text-sm text-gray-600">Test seller onboarding</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
