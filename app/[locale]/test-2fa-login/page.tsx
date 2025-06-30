import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function Test2FALoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              🔐 Test 2FA Login Flow
            </CardTitle>
            <CardDescription className="text-gray-600">
              Test the complete two-factor authentication login process
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Test Account Info */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">Test Account with 2FA Enabled</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Email</Badge>
                  <code className="bg-white px-2 py-1 rounded">test2fa@example.com</code>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Password</Badge>
                  <code className="bg-white px-2 py-1 rounded">test123</code>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">2FA Secret</Badge>
                  <code className="bg-white px-2 py-1 rounded text-xs">INIW4RBPJFEVWLDVLYVDU4RQHR4DMKK5NRAXM2CJIRWEWLC3HYTA</code>
                </div>
              </div>
            </div>

            {/* Backup Codes */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-3">Backup Codes (for testing)</h3>
              <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                {['FE8D-A005', 'EB64-69B2', 'B29D-2623', 'EC9B-CC82', 'F76F-BBDE', '50FE-FFD4', 'A4C1-06C7', 'B578-D1CE', '7EDF-2459', '34C8-BABB'].map((code, index) => (
                  <div key={index} className="p-2 bg-white rounded text-center">
                    {code}
                  </div>
                ))}
              </div>
            </div>

            {/* Test Instructions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">How to Test 2FA Login:</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold">1</div>
                  <div>
                    <p className="font-medium">Setup Google Authenticator</p>
                    <p className="text-sm text-gray-600">Add the secret key above to your Google Authenticator app</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold">2</div>
                  <div>
                    <p className="font-medium">Login with Credentials</p>
                    <p className="text-sm text-gray-600">Use the email and password above to start the login process</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold">3</div>
                  <div>
                    <p className="font-medium">Enter 2FA Code</p>
                    <p className="text-sm text-gray-600">Use the 6-digit code from Google Authenticator or one of the backup codes</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white text-sm font-bold">✓</div>
                  <div>
                    <p className="font-medium">Complete Login</p>
                    <p className="text-sm text-gray-600">You should be redirected to the home page after successful verification</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Scenarios */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-3">Test Scenarios</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-white">✅</Badge>
                  <span>Login with Google Authenticator code</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-white">✅</Badge>
                  <span>Login with backup code (single use)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-white">❌</Badge>
                  <span>Try invalid 2FA code (should fail)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-white">❌</Badge>
                  <span>Try used backup code (should fail)</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center pt-4">
              <Link 
                href="/login" 
                className="inline-flex items-center px-6 py-3 bg-[#09B1BA] hover:bg-[#078A91] text-white font-medium rounded-lg transition-colors"
              >
                🚀 Start 2FA Login Test
              </Link>
            </div>

            {/* Additional Info */}
            <div className="text-center text-sm text-gray-500">
              <p>This test account is created specifically for testing 2FA functionality.</p>
              <p>The backup codes will be consumed when used, so refresh this page to see updated codes.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
