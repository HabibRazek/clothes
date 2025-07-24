'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { CreditCard, Truck, MapPin, Shield, ArrowLeft, Banknote } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { createOrder } from '@/lib/actions/orders'
import { clearCart } from '@/lib/actions/cart'
import { useRouter } from 'next/navigation'
import { ProductWithRelations } from '@/lib/types/product'
import { CartWithItems } from '@/lib/types/cart'

// Formatted product interface for checkout
interface CheckoutProduct {
  id: string
  title: string
  price: number
  shippingCost: number | null
  canDeliver: boolean
  canPickup: boolean
  seller: {
    user: {
      name: string | null
    }
  }
  images: Array<{
    url: string
    altText: string | null
  }>
}

interface CheckoutClientProps {
  product?: CheckoutProduct
  cart?: CartWithItems
  user: {
    id: string
    name?: string
    email: string
  }
}

export default function CheckoutClient({ product, cart, user }: CheckoutClientProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery')
  const [paymentMethod, setPaymentMethod] = useState('card')

  // Reset payment method if pickup is selected and cash on delivery was selected
  const handleDeliveryMethodChange = (method: 'delivery' | 'pickup') => {
    setDeliveryMethod(method)
    if (method === 'pickup' && paymentMethod === 'cash_on_delivery') {
      setPaymentMethod('card')
    }
  }
  const router = useRouter()

  // Calculate totals based on whether it's a single product or cart checkout
  const isCartCheckout = !!cart
  const items = isCartCheckout ? cart.items : (product ? [{ id: 'single', quantity: 1, product }] : [])

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const shippingCost = deliveryMethod === 'delivery' ? 5.99 : 0 // Fixed shipping for demo
  const tax = subtotal * 0.20 // 20% VAT
  const total = subtotal + shippingCost + tax

  // Check if all products support the selected delivery method
  const canDeliver = items.every(item => item.product.canDeliver)
  const canPickup = items.every(item => item.product.canPickup)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isCartCheckout) {
        // Handle cart checkout - create multiple orders or one order with multiple items
        // For now, we'll create separate orders for each item (simpler approach)
        const results = []
        for (const item of items) {
          const formData = new FormData(e.currentTarget)
          formData.append('productId', item.product.id)
          formData.append('quantity', item.quantity.toString())
          formData.append('paymentMethod', paymentMethod)

          const result = await createOrder(formData)
          results.push(result)
        }

        const allSuccessful = results.every(r => r.success)
        if (allSuccessful) {
          // Clear cart and redirect
          await clearCart()
          router.push('/orders?success=true')
        } else {
          alert('Some orders failed to process')
        }
      } else if (product) {
        // Handle single product checkout
        const formData = new FormData(e.currentTarget)
        formData.append('productId', product.id)
        formData.append('quantity', '1')
        formData.append('paymentMethod', paymentMethod)

        const result = await createOrder(formData)

        if (result.success) {
          router.push(`/orders/${result.order.id}?success=true`)
        } else {
          alert(result.error || 'Erreur lors de la commande')
        }
      }
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Erreur lors de la commande')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/products/${product.id}`} className="flex items-center text-gray-600 hover:text-[#09B1BA] mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au produit
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Finaliser votre commande</h1>
          <p className="text-gray-600 mt-2">Vérifiez vos informations avant de confirmer</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Mode de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={deliveryMethod} onValueChange={handleDeliveryMethodChange}>
                    {canDeliver && (
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="delivery" id="delivery" />
                        <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Livraison à domicile</div>
                              <div className="text-sm text-gray-600">Livraison sous 3-5 jours ouvrés</div>
                            </div>
                            <div className="font-medium">
                              {shippingCost > 0 ? `${shippingCost.toFixed(2)} €` : 'Gratuit'}
                            </div>
                          </div>
                        </Label>
                      </div>
                    )}

                    {canPickup && (
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="pickup" id="pickup" />
                        <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Retrait en main propre</div>
                              <div className="text-sm text-gray-600">Rencontrez le vendeur</div>
                            </div>
                            <div className="font-medium">Gratuit</div>
                          </div>
                        </Label>
                      </div>
                    )}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              {deliveryMethod === 'delivery' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Adresse de livraison
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input id="firstName" name="firstName" defaultValue={user.name?.split(' ')[0]} required />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Nom</Label>
                        <Input id="lastName" name="lastName" defaultValue={user.name?.split(' ')[1]} required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="street">Adresse</Label>
                      <Input id="street" name="street" placeholder="123 rue de la Paix" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="postalCode">Code postal</Label>
                        <Input id="postalCode" name="postalCode" placeholder="75001" required />
                      </div>
                      <div>
                        <Label htmlFor="city">Ville</Label>
                        <Input id="city" name="city" placeholder="Paris" required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="country">Pays</Label>
                      <Select name="country" defaultValue="FR">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FR">France</SelectItem>
                          <SelectItem value="BE">Belgique</SelectItem>
                          <SelectItem value="CH">Suisse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Mode de paiement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Carte bancaire</div>
                            <div className="text-sm text-gray-600">Visa, Mastercard, American Express</div>
                          </div>
                          <div className="flex space-x-1">
                            <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">VISA</div>
                            <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center">MC</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">PayPal</div>
                            <div className="text-sm text-gray-600">Paiement sécurisé avec PayPal</div>
                          </div>
                          <div className="w-16 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center">PayPal</div>
                        </div>
                      </Label>
                    </div>

                    {deliveryMethod === 'delivery' && (
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                        <Label htmlFor="cash_on_delivery" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Paiement à la livraison</div>
                              <div className="text-sm text-gray-600">Payez en espèces lors de la réception</div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Banknote className="w-5 h-5 text-green-600" />
                              <span className="text-sm font-medium text-green-600">Cash</span>
                            </div>
                          </div>
                        </Label>
                      </div>
                    )}

                    {deliveryMethod === 'pickup' && (
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Banknote className="w-4 h-4" />
                          <span>Le paiement à la livraison n'est pas disponible pour le retrait en main propre</span>
                        </div>
                      </div>
                    )}
                  </RadioGroup>

                  {paymentMethod === 'card' && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Numéro de carte</Label>
                        <Input id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Date d'expiration</Label>
                          <Input id="expiryDate" name="expiryDate" placeholder="MM/AA" required />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" name="cvv" placeholder="123" required />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cash_on_delivery' && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Banknote className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-800">Paiement à la livraison</h4>
                          <p className="text-sm text-green-700 mt-1">
                            Vous paierez en espèces lors de la réception de votre commande.
                            Assurez-vous d'avoir le montant exact : <strong>{total.toFixed(2)} €</strong>
                          </p>
                          <div className="mt-3 text-xs text-green-600">
                            <p>• Paiement en espèces uniquement</p>
                            <p>• Montant exact requis</p>
                            <p>• Disponible uniquement pour la livraison à domicile</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Terms */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-2">
                    <Checkbox id="terms" required />
                    <Label htmlFor="terms" className="text-sm leading-relaxed">
                      J'accepte les{' '}
                      <Link href="/terms" className="text-[#09B1BA] hover:underline">
                        conditions générales de vente
                      </Link>{' '}
                      et la{' '}
                      <Link href="/privacy" className="text-[#09B1BA] hover:underline">
                        politique de confidentialité
                      </Link>
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Récapitulatif de commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Products */}
                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div key={item.id} className="flex space-x-3">
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
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
                        <div className="flex-1">
                          <div className="font-medium text-sm">{item.product.title}</div>
                          <div className="text-sm text-gray-600">Par {item.product.seller.user.name}</div>
                          <div className="text-sm font-medium">
                            {item.quantity > 1 && `${item.quantity} × `}
                            {item.product.price.toFixed(2)} €
                            {item.quantity > 1 && ` = ${(item.product.price * item.quantity).toFixed(2)} €`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sous-total</span>
                      <span>{subtotal.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Livraison</span>
                      <span>{shippingCost > 0 ? `${shippingCost.toFixed(2)} €` : 'Gratuit'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>TVA (20%)</span>
                      <span>{tax.toFixed(2)} €</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{total.toFixed(2)} €</span>
                    </div>
                  </div>

                  {/* Security */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Paiement 100% sécurisé</span>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-[#09B1BA] hover:bg-[#078A91] text-white py-3"
                  >
                    {isLoading ? 'Traitement...' : `Confirmer la commande - ${total.toFixed(2)} €`}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
