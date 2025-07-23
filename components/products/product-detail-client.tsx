'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Heart, 
  Share2, 
  MapPin, 
  Eye, 
  Star, 
  ShoppingCart, 
  MessageCircle,
  Shield,
  Truck,
  RotateCcw,
  Info
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { createOrder } from '@/lib/actions/orders'
import { useRouter } from 'next/navigation'

interface ProductDetailProps {
  product: {
    id: string
    title: string
    description: string
    price: number
    originalPrice?: number
    condition: string
    brand?: string
    size?: string
    color?: string
    material?: string
    location?: string
    views: number
    shippingCost?: number
    canDeliver: boolean
    canPickup: boolean
    createdAt: Date
    category: {
      name: string
    }
    seller: {
      user: {
        name: string
        image?: string
      }
    }
    images: Array<{
      url: string
      altText?: string
    }>
    reviews: Array<{
      id: string
      rating: number
      comment?: string
      user: {
        name: string
        image?: string
      }
      createdAt: Date
    }>
    _count: {
      reviews: number
      favorites: number
    }
  }
}

export default function ProductDetailClient({ product }: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleBuyNow = async () => {
    setIsLoading(true)
    try {
      // For now, redirect to a simple checkout page
      router.push(`/checkout?productId=${product.id}`)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const averageRating = product.reviews.length > 0 
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
    : 0

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'il y a moins d\'1h'
    if (diffInHours < 24) return `il y a ${diffInHours}h`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return 'il y a 1j'
    return `il y a ${diffInDays}j`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[selectedImageIndex]?.url || product.images[0].url}
                alt={product.images[selectedImageIndex]?.altText || product.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-6xl mb-4">📷</div>
                  <div className="text-lg">No Image Available</div>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index ? 'border-[#09B1BA]' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.altText || `${product.title} ${index + 1}`}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{product.title}</h1>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={isFavorite ? 'text-red-500 border-red-500' : ''}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500' : ''}`} />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <Badge variant="outline">{product.category.name}</Badge>
              {product.brand && <span>• {product.brand}</span>}
              {product.size && <span>• Taille {product.size}</span>}
              <span>• {product.condition}</span>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {product.views} vues
              </div>
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                {product._count.favorites} favoris
              </div>
              {product.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {product.location}
                </div>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            {product.originalPrice && (
              <div className="text-lg text-gray-500 line-through">
                {product.originalPrice.toFixed(2)} €
              </div>
            )}
            <div className="text-3xl font-bold text-[#09B1BA]">
              {product.price.toFixed(2)} €
            </div>
            {product.originalPrice && (
              <Badge variant="destructive" className="text-sm">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </Badge>
            )}
          </div>

          {/* Seller Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={product.seller.user.image} />
                  <AvatarFallback>
                    {product.seller.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{product.seller.user.name}</div>
                  <div className="text-sm text-gray-500">
                    Publié {formatTimeAgo(new Date(product.createdAt))}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contacter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleBuyNow}
              disabled={isLoading}
              className="w-full bg-[#09B1BA] hover:bg-[#078A91] text-white py-3 text-lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {isLoading ? 'Chargement...' : 'Acheter maintenant'}
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="py-2">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button variant="outline" className="py-2">
                <Heart className="h-4 w-4 mr-2" />
                Favoris
              </Button>
            </div>
          </div>

          {/* Shipping Info */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Truck className="h-4 w-4 mr-2 text-gray-600" />
                  <span className="text-sm">Livraison</span>
                </div>
                <span className="text-sm font-medium">
                  {product.shippingCost ? `${product.shippingCost.toFixed(2)} €` : 'Gratuite'}
                </span>
              </div>
              
              {product.canPickup && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-600" />
                  <span className="text-sm">Retrait possible</span>
                </div>
              )}

              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-green-600" />
                <span className="text-sm">Protection acheteur</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Description */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
            
            {/* Product Details */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.brand && (
                <div>
                  <div className="text-sm font-medium text-gray-900">Marque</div>
                  <div className="text-sm text-gray-600">{product.brand}</div>
                </div>
              )}
              {product.size && (
                <div>
                  <div className="text-sm font-medium text-gray-900">Taille</div>
                  <div className="text-sm text-gray-600">{product.size}</div>
                </div>
              )}
              {product.color && (
                <div>
                  <div className="text-sm font-medium text-gray-900">Couleur</div>
                  <div className="text-sm text-gray-600">{product.color}</div>
                </div>
              )}
              {product.material && (
                <div>
                  <div className="text-sm font-medium text-gray-900">Matière</div>
                  <div className="text-sm text-gray-600">{product.material}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Avis ({product._count.reviews})
                {averageRating > 0 && (
                  <div className="flex items-center ml-4">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm">{averageRating.toFixed(1)}</span>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={review.user.image} />
                      <AvatarFallback>
                        {review.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{review.user.name}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(new Date(review.createdAt))}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-700 mt-1">{review.comment}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
