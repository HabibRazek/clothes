"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Star, Eye, MessageCircle, Share2, MapPin, ShoppingCart } from "lucide-react"
import { useState, useEffect } from "react"
import { useTranslations } from 'next-intl'
import { getPublicProducts } from '@/lib/actions/products'
import { addToCart } from '@/lib/actions/cart'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  title: string
  price: number
  originalPrice?: number
  condition: string
  brand?: string
  size?: string
  location?: string
  views: number
  likes: number
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
  _count: {
    reviews: number
    favorites: number
  }
}

export default function EnhancedProductCards() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState<Set<string>>(new Set())
  const t = useTranslations('HomePage')
  const tProduct = useTranslations('ProductCard')
  const tCommon = useTranslations('Common')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await getPublicProducts({ limit: 8 })
        if (result.success) {
          setProducts(result.products as Product[])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    )
  }

  const handleAddToCart = async (productId: string) => {
    setAddingToCart(prev => new Set(prev).add(productId))
    try {
      const result = await addToCart(productId, 1)
      if (result.success) {
        // Show success message or update cart count
        alert('Product added to cart!')
      } else {
        alert(result.error || 'Failed to add to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add to cart')
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const discountPercentage = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'il y a moins d\'1h'
    if (diffInHours < 24) return `il y a ${diffInHours}h`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return 'il y a 1j'
    return `il y a ${diffInDays}j`
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="w-full h-48 sm:h-64 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-2 sm:p-3">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }


  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              {t('latestTitle')}
            </h2>
            <p className="text-gray-600">
              {t('latestSubtitle')}
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            <Button variant="outline" size="sm">
              {t('filter')}
            </Button>
            <Button variant="outline" size="sm">
              {t('sortBy')}
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Card className="group border-0 shadow-none hover:shadow-md transition-all duration-300 bg-white rounded-lg overflow-hidden cursor-pointer p-0">
                <div className="relative">
                  {product.images && product.images.length > 0 ? (
                    <div className="w-full h-48 sm:h-64 relative rounded-t-lg overflow-hidden">
                      <Image
                        src={product.images[0].url}
                        alt={product.images[0].altText || product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 sm:h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-t-lg">
                      <div className="text-center text-gray-400">
                        <div className="text-4xl mb-2">📷</div>
                        <div className="text-sm font-medium">Product Image</div>
                        <div className="text-xs">300x256px</div>
                      </div>
                    </div>
                  )}

                  {/* Heart Button - Vinted Style */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-sm hover:shadow-md transition-all duration-200 ${
                      favorites.includes(product.id) ? "text-red-500" : "text-gray-600"
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      toggleFavorite(product.id)
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 transition-all duration-300 ${
                        favorites.includes(product.id) ? "fill-red-500" : ""
                      }`}
                    />
                  </Button>

                  {/* Likes Counter - Bottom Right */}
                  <div className="absolute bottom-2 right-2 text-xs text-gray-600 font-medium">
                    {product._count.favorites}
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    size="sm"
                    className="absolute bottom-2 left-2 bg-[#09B1BA] hover:bg-[#078A91] text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                    onClick={(e) => {
                      e.preventDefault()
                      handleAddToCart(product.id)
                    }}
                    disabled={addingToCart.has(product.id)}
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    {addingToCart.has(product.id) ? 'Adding...' : 'Acheter'}
                  </Button>
                </div>

                <CardContent className="p-2 sm:p-3">
                  <div className="space-y-1">
                    {/* Title */}
                    <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                      {product.title}
                    </div>

                    {/* Brand and Size */}
                    <div className="text-xs text-gray-600 truncate">
                      {product.brand && `${product.brand} • `}
                      {product.size && `Taille ${product.size} • `}
                      {product.condition}
                    </div>

                    {/* Category and Location */}
                    <div className="text-xs text-gray-500 truncate">
                      {product.category.name}
                      {product.location && ` • ${product.location}`}
                    </div>

                    {/* Pricing - Vinted Style */}
                    <div className="pt-1 sm:pt-2">
                      {product.originalPrice && (
                        <div className="text-xs text-gray-500 line-through">
                          {product.originalPrice.toFixed(2)} €
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-[#09B1BA]">
                          {product.price.toFixed(2)} €
                        </span>
                        <span className="text-xs text-gray-500 hidden sm:inline">incl. ⓘ</span>
                      </div>
                    </div>

                    {/* Seller and Time */}
                    <div className="text-xs text-gray-500 truncate pt-1">
                      Par {product.seller.user.name} • {formatTimeAgo(new Date(product.createdAt))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" className="px-8 py-3 border-[#09B1BA] text-[#09B1BA] hover:bg-[#09B1BA] hover:text-white transition-all duration-300">
            Charger plus d'articles
          </Button>
        </div>
      </div>
    </section>
  )
}
