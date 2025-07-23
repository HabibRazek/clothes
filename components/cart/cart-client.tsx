'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { updateCartItemQuantity, removeFromCart, clearCart } from '@/lib/actions/cart'
import { useRouter } from 'next/navigation'

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    title: string
    price: number
    condition: string
    seller: {
      user: {
        name: string
      }
    }
    images: Array<{
      url: string
      altText?: string
    }>
  }
}

interface Cart {
  id: string
  items: CartItem[]
}

interface CartClientProps {
  cart: Cart
}

export default function CartClient({ cart }: CartClientProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set())
  const router = useRouter()

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    setLoadingItems(prev => new Set(prev).add(itemId))
    try {
      const result = await updateCartItemQuantity(itemId, newQuantity)
      if (result.success) {
        router.refresh()
      } else {
        alert(result.error || 'Failed to update quantity')
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      alert('Failed to update quantity')
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const removeItem = async (itemId: string) => {
    setLoadingItems(prev => new Set(prev).add(itemId))
    try {
      const result = await removeFromCart(itemId)
      if (result.success) {
        router.refresh()
      } else {
        alert(result.error || 'Failed to remove item')
      }
    } catch (error) {
      console.error('Error removing item:', error)
      alert('Failed to remove item')
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const clearAllItems = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return
    
    setIsLoading(true)
    try {
      const result = await clearCart()
      if (result.success) {
        router.refresh()
      } else {
        alert(result.error || 'Failed to clear cart')
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
      alert('Failed to clear cart')
    } finally {
      setIsLoading(false)
    }
  }

  const subtotal = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const shipping = 5.99 // Fixed shipping for demo
  const tax = subtotal * 0.20 // 20% VAT
  const total = subtotal + shipping + tax

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link href="/">
            <Button className="bg-[#09B1BA] hover:bg-[#078A91]">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <Button
            variant="outline"
            onClick={clearAllItems}
            disabled={isLoading}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-gray-100">
                      {item.product.images && item.product.images.length > 0 ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.images[0].altText || item.product.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          📷
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <Link 
                        href={`/products/${item.product.id}`}
                        className="font-medium text-gray-900 hover:text-[#09B1BA] transition-colors"
                      >
                        {item.product.title}
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">
                        By {item.product.seller.user.name}
                      </p>
                      <Badge variant="outline" className="mt-2">
                        {item.product.condition}
                      </Badge>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={loadingItems.has(item.id) || item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={loadingItems.has(item.id)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        €{(item.product.price * item.quantity).toFixed(2)}
                      </div>
                      {item.quantity > 1 && (
                        <div className="text-sm text-gray-500">
                          €{item.product.price.toFixed(2)} each
                        </div>
                      )}
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      disabled={loadingItems.has(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({cart.items.length} items)</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>€{shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (20%)</span>
                    <span>€{tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-[#09B1BA] hover:bg-[#078A91] text-white py-3"
                  onClick={() => router.push('/checkout')}
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
