import { getCurrentUser } from '@/lib/actions/auth'
import { getPublicProductById } from '@/lib/actions/products'
import { getOrCreateCart } from '@/lib/actions/cart'
import { redirect } from 'next/navigation'
import CheckoutClient from '@/components/checkout/checkout-client'
import Navbar from '@/components/navigation/navbar'

interface CheckoutPageProps {
  searchParams: Promise<{
    productId?: string
  }>
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const user = await getCurrentUser()
  const { productId } = await searchParams

  if (!user) {
    redirect('/login?callbackUrl=/checkout')
  }

  // If productId is provided, it's a direct product checkout
  if (productId) {
    const result = await getPublicProductById(productId)

    if (!result.success || !result.product) {
      redirect('/')
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <CheckoutClient product={result.product} user={user} />
      </div>
    )
  }

  // Otherwise, checkout from cart
  const cartResult = await getOrCreateCart()

  if (!cartResult.success || !cartResult.cart || cartResult.cart.items.length === 0) {
    redirect('/cart')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <CheckoutClient cart={cartResult.cart} user={user} />
    </div>
  )
}
