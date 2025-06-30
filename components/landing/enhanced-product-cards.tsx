"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Star, Eye, MessageCircle, Share2, MapPin } from "lucide-react"
import { useState } from "react"
import {useTranslations} from 'next-intl'

export default function EnhancedProductCards() {
  const [favorites, setFavorites] = useState<number[]>([])
  const t = useTranslations('HomePage')
  const tProduct = useTranslations('ProductCard')
  const tCommon = useTranslations('Common')

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    )
  }

  const products = [
    {
      id: 1,
      image: null,
      title: "Pull en laine mérinos",
      brand: "COS",
      size: "M",
      condition: "Neuf avec étiquettes",
      price: 45.00,
      originalPrice: 89.00,
      likes: 32,
      views: 156,
      messages: 8,
      isPromoted: true,
      location: "Paris",
      postedTime: "il y a 2h",
      seller: {
        name: "Camille",
        avatar: null,
        rating: 4.9,
        reviews: 234,
        isVerified: true
      },
      tags: ["Tendance", "Éco-responsable"]
    },
    {
      id: 2,
      image: null,
      title: "Robe midi fleurie",
      brand: "& Other Stories",
      size: "S",
      condition: "Très bon état",
      price: 28.00,
      originalPrice: 65.00,
      likes: 67,
      views: 289,
      messages: 15,
      isPromoted: false,
      location: "Lyon",
      postedTime: "il y a 5h",
      seller: {
        name: "Léa",
        avatar: null,
        rating: 4.7,
        reviews: 89,
        isVerified: true
      },
      tags: ["Vintage", "Printemps"]
    },
    {
      id: 3,
      image: null,
      title: "Blazer noir classique",
      brand: "Mango",
      size: "L",
      condition: "Bon état",
      price: 35.00,
      originalPrice: 79.00,
      likes: 24,
      views: 98,
      messages: 3,
      isPromoted: false,
      location: "Marseille",
      postedTime: "il y a 1j",
      seller: {
        name: "Sarah",
        avatar: null,
        rating: 4.8,
        reviews: 156,
        isVerified: false
      },
      tags: ["Bureau", "Classique"]
    },
    {
      id: 4,
      image: null,
      title: "Jean mom fit vintage",
      brand: "Levi's",
      size: "28",
      condition: "Très bon état",
      price: 52.00,
      originalPrice: 95.00,
      likes: 89,
      views: 445,
      messages: 22,
      isPromoted: true,
      location: "Bordeaux",
      postedTime: "il y a 3h",
      seller: {
        name: "Emma",
        avatar: null,
        rating: 4.9,
        reviews: 312,
        isVerified: true
      },
      tags: ["Vintage", "Denim"]
    },
    {
      id: 5,
      image: null,
      title: "Bottines en cuir",
      brand: "Dr. Martens",
      size: "39",
      condition: "Bon état",
      price: 75.00,
      originalPrice: 150.00,
      likes: 43,
      views: 234,
      messages: 12,
      isPromoted: false,
      location: "Toulouse",
      postedTime: "il y a 6h",
      seller: {
        name: "Julie",
        avatar: null,
        rating: 4.6,
        reviews: 78,
        isVerified: true
      },
      tags: ["Cuir", "Hiver"]
    },
    {
      id: 6,
      image: null,
      title: "Sac bandoulière",
      brand: "Sézane",
      size: "Unique",
      condition: "Neuf avec étiquettes",
      price: 120.00,
      originalPrice: 195.00,
      likes: 156,
      views: 678,
      messages: 34,
      isPromoted: true,
      location: "Nice",
      postedTime: "il y a 1h",
      seller: {
        name: "Marine",
        avatar: null,
        rating: 5.0,
        reviews: 445,
        isVerified: true
      },
      tags: ["Luxe", "Cuir"]
    }
  ]

  const discountPercentage = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100)
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
            <Card key={product.id} className="group border-0 shadow-none hover:shadow-md transition-all duration-300 bg-white rounded-lg overflow-hidden cursor-pointer p-0">
              <div className="relative">
                <div className="w-full h-48 sm:h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-t-lg">
                  <div className="text-center text-gray-400">
                    <div className="text-4xl mb-2">📷</div>
                    <div className="text-sm font-medium">Product Image</div>
                    <div className="text-xs">300x256px</div>
                  </div>
                </div>

                {/* Heart Button - Vinted Style */}
                <Button
                  size="icon"
                  variant="ghost"
                  className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-sm hover:shadow-md transition-all duration-200 ${
                    favorites.includes(product.id) ? "text-red-500" : "text-gray-600"
                  }`}
                  onClick={() => toggleFavorite(product.id)}
                >
                  <Heart
                    className={`h-4 w-4 transition-all duration-300 ${
                      favorites.includes(product.id) ? "fill-red-500" : ""
                    }`}
                  />
                </Button>

                {/* Likes Counter - Bottom Right */}
                <div className="absolute bottom-2 right-2 text-xs text-gray-600 font-medium">
                  {product.likes}
                </div>
              </div>

              <CardContent className="p-2 sm:p-3">
                <div className="space-y-1">
                  {/* Brand Name */}
                  <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                    {product.brand}
                  </div>

                  {/* Size and Condition */}
                  <div className="text-xs text-gray-600 truncate">
                    {product.size} / {product.size} • {product.condition}
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
                </div>
              </CardContent>
            </Card>
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
