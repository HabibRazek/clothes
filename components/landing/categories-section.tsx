"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Shirt,
  Footprints,
  ShoppingBag,
  Watch,
  Sparkles,
  Baby,
  Home,
  Smartphone,
  ArrowRight
} from "lucide-react"
import {Link} from "../../i18n/navigation"
import {useTranslations} from 'next-intl'

export default function CategoriesSection() {
  const tCategories = useTranslations('Categories')
  const categories = [
    {
      id: 1,
      nameKey: "womenClothing",
      icon: Shirt,
      image: null,
      itemCount: "2.3k articles",
      color: "bg-pink-50 text-pink-600",
      href: "/categories/vetements-femmes"
    },
    {
      id: 2,
      nameKey: "shoes",
      icon: Footprints,
      image: null,
      itemCount: "1.8k articles",
      color: "bg-blue-50 text-blue-600",
      href: "/categories/chaussures"
    },
    {
      id: 3,
      nameKey: "bags",
      icon: ShoppingBag,
      image: null,
      itemCount: "956 articles",
      color: "bg-purple-50 text-purple-600",
      href: "/categories/sacs"
    },
    {
      id: 4,
      nameKey: "accessories",
      icon: Watch,
      image: null,
      itemCount: "1.2k articles",
      color: "bg-green-50 text-green-600",
      href: "/categories/accessoires"
    },
    {
      id: 5,
      nameKey: "beauty",
      icon: Sparkles,
      image: null,
      itemCount: "743 articles",
      color: "bg-yellow-50 text-yellow-600",
      href: "/categories/beaute"
    },
    {
      id: 6,
      nameKey: "kidsBabies",
      icon: Baby,
      image: null,
      itemCount: "892 articles",
      color: "bg-orange-50 text-orange-600",
      href: "/categories/enfants"
    },
    {
      id: 7,
      nameKey: "home",
      icon: Home,
      image: null,
      itemCount: "567 articles",
      color: "bg-indigo-50 text-indigo-600",
      href: "/categories/maison"
    },
    {
      id: 8,
      nameKey: "electronics",
      icon: Smartphone,
      image: null,
      itemCount: "234 articles",
      color: "bg-gray-50 text-gray-600",
      href: "/categories/electronique"
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {tCategories('exploreByCategory')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {tCategories('findExactly')}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Link key={category.id} href={category.href}>
                <Card className="group border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white rounded-xl overflow-hidden cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center space-y-3">
                      {/* Large Icon */}
                      <div className={`p-3 rounded-xl ${category.color} group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                        <IconComponent className="h-6 w-6" />
                      </div>

                      {/* Category Info */}
                      <div className="space-y-1">
                        <h3 className="font-semibold text-gray-900 text-xs leading-tight group-hover:text-[#09B1BA] transition-colors">
                          {tCategories(category.nameKey as any)}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {category.itemCount}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            className="group border-[#09B1BA] text-[#09B1BA] hover:bg-[#09B1BA] hover:text-white transition-all duration-300"
          >
            {tCategories('viewAllCategories')}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#09B1BA] mb-2">10k+</div>
            <div className="text-sm text-gray-600">Articles disponibles</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#09B1BA] mb-2">5k+</div>
            <div className="text-sm text-gray-600">Membres actifs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#09B1BA] mb-2">98%</div>
            <div className="text-sm text-gray-600">Satisfaction client</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#09B1BA] mb-2">24h</div>
            <div className="text-sm text-gray-600">Livraison moyenne</div>
          </div>
        </div>
      </div>
    </section>
  )
}
