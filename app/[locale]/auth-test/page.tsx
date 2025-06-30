import { auth } from '@/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Navbar from '@/components/navigation/navbar'

export default async function AuthTestPage() {
  const session = await auth()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Include Navbar to test user menu */}
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Authentication Test Page</h1>
            <p className="text-gray-600">Test the complete authentication flow with user menu</p>
          </div>

          {/* Authentication Status */}
          <Card>
            <CardHeader>
              <CardTitle>Authentication Status</CardTitle>
              <CardDescription>
                Current session and user information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {session ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-600">Authenticated</Badge>
                    <span className="text-sm text-gray-600">User is logged in</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">User Information</h3>
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
                        <p><strong>Image:</strong> {session.user.image ? 'Yes' : 'No'}</p>
                        <p><strong>Last Login:</strong> {session.user.lastLoginAt ? new Date(session.user.lastLoginAt).toLocaleString() : 'Unknown'}</p>
                        <p><strong>Session Expires:</strong> {new Date(session.expires).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {session.user.seller && (
                    <div>
                      <h3 className="font-semibold mb-2">Seller Information</h3>
                      <div className="space-y-1 text-sm">
                        <p><strong>Store:</strong> {session.user.seller.storeName}</p>
                        <p><strong>Verified Seller:</strong> <Badge variant={session.user.seller.isVerified ? 'default' : 'secondary'}>{session.user.seller.isVerified ? 'Yes' : 'No'}</Badge></p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Badge variant="secondary" className="mb-4">Not Authenticated</Badge>
                  <p className="text-gray-500 mb-4">No active session found</p>
                  <div className="space-x-2">
                    <Link href="/login">
                      <Button variant="outline">Login</Button>
                    </Link>
                    <Link href="/signup">
                      <Button>Sign Up</Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Menu Test */}
          <Card>
            <CardHeader>
              <CardTitle>User Menu Test</CardTitle>
              <CardDescription>
                The user menu should appear in the navbar above when logged in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Expected Behavior:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• When <strong>not logged in</strong>: Navbar shows Login/Signup buttons</li>
                    <li>• When <strong>logged in</strong>: Navbar shows user avatar with dropdown menu</li>
                    <li>• User menu should display: name, email, role, and logout option</li>
                    <li>• Avatar should show user initials or profile image</li>
                    <li>• Dropdown should include role-based navigation (Admin/Seller dashboard)</li>
                  </ul>
                </div>
                
                {session ? (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">✅ User Menu Active</h3>
                    <p className="text-sm text-green-800">
                      Check the navbar above - you should see your user avatar with a dropdown menu containing your profile information and logout option.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Please Log In</h3>
                    <p className="text-sm text-yellow-800">
                      Log in to test the user menu functionality. The navbar should show Login/Signup buttons currently.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Test Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Test Actions</CardTitle>
              <CardDescription>
                Test different authentication scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/login" className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                  <h3 className="font-semibold">Test Login</h3>
                  <p className="text-sm text-gray-600">Login with credentials</p>
                  <p className="text-xs text-gray-500 mt-1">admin@example.com / admin123</p>
                </Link>
                
                <Link href="/signup" className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                  <h3 className="font-semibold">Test Signup</h3>
                  <p className="text-sm text-gray-600">Create new account</p>
                  <p className="text-xs text-gray-500 mt-1">Register with email</p>
                </Link>
                
                <Link href="/sell" className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                  <h3 className="font-semibold">Test Seller Registration</h3>
                  <p className="text-sm text-gray-600">Become a seller</p>
                  <p className="text-xs text-gray-500 mt-1">Multi-step registration</p>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Google OAuth Test */}
          <Card>
            <CardHeader>
              <CardTitle>Google OAuth Test</CardTitle>
              <CardDescription>
                Test Google authentication (requires setup)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Google OAuth Setup</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    To test Google authentication, you need to configure Google OAuth credentials:
                  </p>
                  <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                    <li>Go to <a href="https://console.cloud.google.com/" target="_blank" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
                    <li>Create a new project or select existing</li>
                    <li>Enable Google+ API</li>
                    <li>Create OAuth 2.0 credentials</li>
                    <li>Add authorized redirect URI: <code className="bg-gray-200 px-1 rounded">http://localhost:3001/api/auth/callback/google</code></li>
                    <li>Update .env with your credentials</li>
                  </ol>
                </div>
                
                <div className="text-center">
                  <Link href="/login">
                    <Button variant="outline" className="flex items-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Test Google Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
