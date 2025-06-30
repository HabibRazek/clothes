"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Star, TrendingUp } from "lucide-react"
import { useState } from "react"
import {useTranslations} from 'next-intl'
import {Link} from "../../i18n/navigation"

export default function FeaturedSection() {
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

  const featuredProducts = [
    {
      id: 1,
      image: null,
      title: "Robe d'été vintage",
      brand: "Zara",
      size: "M",
      condition: "Très bon état",
      price: 25.00,
      originalPrice: 45.00,
      likes: 24,
      isNew: false,
      isTrending: true,
      seller: {
        name: "Marie",
        rating: 4.8,
        reviews: 156
      }
    },
    {
      id: 2,
      image: null,
      title: "Sac à main cuir",
      brand: "Coach",
      size: "Unique",
      condition: "Neuf avec étiquettes",
      price: 180.00,
      originalPrice: 320.00,
      likes: 67,
      isNew: true,
      isTrending: false,
      seller: {
        name: "Sophie",
        rating: 4.9,
        reviews: 89
      }
    },
    {
      id: 3,
      image: null,
      title: "Baskets blanches",
      brand: "Adidas",
      size: "38",
      condition: "Bon état",
      price: 35.00,
      originalPrice: 80.00,
      likes: 18,
      isNew: false,
      isTrending: true,
      seller: {
        name: "Emma",
        rating: 4.7,
        reviews: 203
      }
    },
    {
      id: 4,
      image: null,
      title: "Veste en jean vintage",
      brand: "Levi's",
      size: "S",
      condition: "Très bon état",
      price: 42.00,
      originalPrice: 89.00,
      likes: 31,
      isNew: false,
      isTrending: false,
      seller: {
        name: "Julie",
        rating: 4.6,
        reviews: 124
      }
    }
  ]

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              {t('featuredTitle')}
            </h2>
            <p className="text-gray-600">
              {t('featuredSubtitle')}
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex">
            {t('viewAll')}
          </Button>
        </div>

        {/* Featured Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group border-0 shadow-none hover:shadow-md transition-all duration-300 bg-white rounded-lg overflow-hidden cursor-pointer p-0">
              <div className="relative">
                <div className="w-full h-48 sm:h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-t-lg">
                  <div className="text-center text-gray-400">
                    <div className="text-4xl mb-2">📷</div>
                    <div className="text-sm font-medium">Product Image</div>
                    <div className="text-xs">300x300px</div>
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.isNew && (
                    <Badge className="bg-[#09B1BA] text-white text-xs px-2 py-1">
                      {tCommon('new')}
                    </Badge>
                  )}
                  {product.isTrending && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs px-2 py-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {tCommon('trending')}
                    </Badge>
                  )}
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
                    {tProduct('size')} {product.size} • {product.condition}
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
                      <span className="text-xs text-gray-500 hidden sm:inline">{tProduct('incl')} ⓘ</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="flex justify-center mt-8 md:hidden">
          <Button variant="outline" className="w-full max-w-xs">
            {t('viewMore')}
          </Button>
        </div>
      </div>
    </section>
  )
}
