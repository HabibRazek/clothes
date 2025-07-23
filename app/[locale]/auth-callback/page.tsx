import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Loader2 } from 'lucide-react'

// Force dynamic rendering to prevent build-time database calls
export const dynamic = 'force-dynamic'

export default async function AuthCallbackPage() {
  const session = await auth()
  
  // If user is authenticated, redirect to home
  if (session?.user) {
    redirect('/en')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
          <CardTitle>Completing Sign In</CardTitle>
          <CardDescription>
            Please wait while we complete your authentication...
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-gray-600">
            You will be redirected automatically once authentication is complete.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
