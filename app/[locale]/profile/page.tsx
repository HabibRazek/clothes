import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProfileEditForm from '@/components/profile/profile-edit-form'

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Fetch user with 2FA status
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      name: true,
      image: true,
      role: true,
      isVerified: true,
      phone: true,
      twoFactorEnabled: true
    }
  })

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Profile Settings
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Manage your account information and security preferences
              </p>
            </div>
          </div>

          {/* Profile Content */}
          <div className="space-y-6">
            <ProfileEditForm user={user} />
          </div>
        </div>
      </div>
    </div>
  )
}
