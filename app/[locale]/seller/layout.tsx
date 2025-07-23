import { getCurrentUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import SellerLayoutClient from '@/components/seller/seller-layout-client'

interface SellerLayoutWrapperProps {
  children: React.ReactNode
}

export default async function SellerLayoutWrapper({
  children,
}: SellerLayoutWrapperProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'SELLER' && user.role !== 'ADMIN') {
    redirect('/')
  }

  return <SellerLayoutClient>{children}</SellerLayoutClient>
}
