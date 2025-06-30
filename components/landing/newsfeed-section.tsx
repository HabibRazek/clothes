"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, TrendingUp } from "lucide-react"
import { useState } from "react"
import {useTranslations} from 'next-intl'

export default function NewsfeedSection() {
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
      likes: 8,
      brand: "Zara",
      title: "Pull en cachemire",
      description: "Neuf avec étiquettes",
      size: "M",
      originalPrice: 35.0,
      salePrice: 37.45,
      isLiked: false,
      isTrending: true,
      seller: "Marie"
    },
    {
      id: 2,
      image: null,
      likes: 4,
      brand: "H&M",
      title: "Robe d'été",
      description: "Très bon état",
      size: "S",
      originalPrice: 50.0,
      salePrice: 53.2,
      isLiked: false,
      isTrending: false,
      seller: "Sophie"
    },
    {
      id: 3,
      image: null,
      likes: 4,
      brand: "Urban Outfitters",
      title: "Top crop vintage",
      description: "Bon état",
      size: "XS",
      originalPrice: 10.0,
      salePrice: 11.2,
      isLiked: false,
      isTrending: true,
      seller: "Emma"
    },
    {
      id: 4,
      image: null,
      likes: 4,
      brand: "House of CB",
      title: "Robe de soirée",
      description: "Neuf avec étiquettes",
      size: "S",
      originalPrice: 28.0,
      salePrice: 30.1,
      isLiked: false,
      isTrending: false,
      seller: "Julie"
    },
    {
      id: 5,
      image: null,
      likes: 17,
      brand: "Vintage",
      title: "Veste en jean",
      description: "Très bon état",
      size: "L",
      originalPrice: 15.0,
      salePrice: 16.45,
      isLiked: false,
      isTrending: true,
      seller: "Camille"
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {t('discoverTitle')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('discoverSubtitle')}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {products.map((product) => (
            <Card key={product.id} className="group border-0 shadow-none hover:shadow-md transition-all duration-300 bg-white rounded-lg overflow-hidden cursor-pointer p-0">
              <div className="relative">
                <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-t-lg">
                  <div className="text-center text-gray-400">
                    <div className="text-3xl mb-1">📷</div>
                    <div className="text-xs font-medium">Product Image</div>
                    <div className="text-xs">240x192px</div>
                  </div>
                </div>

                {/* Trending Badge */}
                {product.isTrending && (
                  <Badge className="absolute top-3 left-3 bg-orange-100 text-orange-800 text-xs px-2 py-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Tendance
                  </Badge>
                )}

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
                    {product.size} / {product.size} • {product.description}
                  </div>

                  {/* Pricing - Vinted Style */}
                  <div className="pt-1 sm:pt-2">
                    <div className="text-xs text-gray-500 line-through">
                      {product.originalPrice.toFixed(2)} €
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-[#09B1BA]">
                        {product.salePrice.toFixed(2)} €
                      </span>
                      <span className="text-xs text-gray-500 hidden sm:inline">incl. ⓘ</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View More Button */}
        <div className="flex justify-center mt-12">
          <Button className="px-8 py-3 bg-[#09B1BA] hover:bg-[#078A91] text-white rounded-lg font-medium transition-colors duration-200">
            Voir plus d'articles
          </Button>
        </div>
      </div>
    </section>
  )
}
