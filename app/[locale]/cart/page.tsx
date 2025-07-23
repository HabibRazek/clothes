import { getOrCreateCart } from '@/lib/actions/cart'
import { getCurrentUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import CartClient from '@/components/cart/cart-client'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/layout/footer'

export default async function CartPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login?callbackUrl=/cart')
  }

  const result = await getOrCreateCart()
  
  if (!result.success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Erreur</h1>
            <p className="text-gray-600">{result.error}</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <CartClient cart={result.cart} />
      <Footer />
    </div>
  )
}
