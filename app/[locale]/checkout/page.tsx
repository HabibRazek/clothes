import { getCurrentUser } from '@/lib/actions/auth'
import { getPublicProductById } from '@/lib/actions/products'
import { getOrCreateCart } from '@/lib/actions/cart'
import { redirect } from 'next/navigation'
import CheckoutClient from '@/components/checkout/checkout-client'
import Navbar from '@/components/navigation/navbar'

// Force dynamic rendering to prevent build-time database calls
export const dynamic = 'force-dynamic'

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

    // Format product for checkout component
    const checkoutProduct = {
      id: result.product.id,
      title: result.product.title,
      price: result.product.price,
      shippingCost: result.product.shippingCost,
      canDeliver: result.product.canDeliver,
      canPickup: result.product.canPickup,
      seller: {
        user: {
          name: result.product.seller.user.name
        }
      },
      images: result.product.images.map(img => ({
        url: img.url,
        altText: img.altText
      }))
    }

    // Format user for checkout component
    const checkoutUser = {
      id: user.id,
      name: user.name || undefined, // Convert null to undefined
      email: user.email
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <CheckoutClient product={checkoutProduct} user={checkoutUser} />
      </div>
    )
  }

  // Otherwise, checkout from cart
  const cartResult = await getOrCreateCart()

  if (!cartResult.success || !cartResult.cart || cartResult.cart.items.length === 0) {
    redirect('/cart')
  }

  // Format user for checkout component
  const checkoutUser = {
    id: user.id,
    name: user.name || undefined, // Convert null to undefined
    email: user.email
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <CheckoutClient cart={cartResult.cart} user={checkoutUser} />
    </div>
  )
}
