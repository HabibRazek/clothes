"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Heart } from "lucide-react"
import Image from "next/image"

export default function Component() {
  const products = [
    {
    id: 1,
    image: "/images/pull.jpg?height=300&width=300", // ← Updated here
    likes: 8,
    brand: "Nikon",
    description: "New without tags",
    originalPrice: 35.0,
    salePrice: 37.45,
    isLiked: false,
  },
    {
      id: 2,
      image: "/images/pull.jpg?height=300&width=300",
      likes: 4,
      brand: "Bumped",
      description: "New without tags",
      originalPrice: 50.0,
      salePrice: 53.2,
      isLiked: false,
    },
    {
      id: 3,
      image: "/images/pull.jpg?height=300&width=300",
      likes: 4,
      brand: "Urban Outfitters",
      description: "2 / XS · Very good",
      originalPrice: 10.0,
      salePrice: 11.2,
      isLiked: false,
    },
    {
      id: 4,
      image: "/images/pull.jpg?height=300&width=300",
      likes: 4,
      brand: "House of CB",
      description: "4 / S · New with tags",
      originalPrice: 28.0,
      salePrice: 30.1,
      isLiked: false,
    },
    {
      id: 5,
      image: "/images/pull.jpg?height=300&width=300",
      likes: 17,
      brand: "amiee Lynn",
      description: "40 inches · Very good",
      originalPrice: 15.0,
      salePrice: 16.45,
      isLiked: false,
    },
  ]

  return (
    <section className="w-full py-8 bg-white flex justify-center">
      <div className="container px-4">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Newsfeed</h2>
        </div>

        {/* Horizontal Scrolling Cards */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {products.map((product) => (
            <Card key={product.id} className="flex-shrink-0 w-64 border-0 shadow-none bg-white">
              <div className="relative">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.description}
                  width={256}
                  height={256}
                  className="w-full h-64 object-cover rounded-lg"
                />
                {/* Heart Button with Count */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                  <Heart className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600 font-medium">{product.likes}</span>
                </div>
              </div>

              <CardContent className="p-3">
                <div className="space-y-1">
                  {/* Brand */}
                  <p className="text-sm font-medium text-teal-600">{product.brand}</p>

                  {/* Description */}
                  <p className="text-sm text-gray-700 line-clamp-2">{product.description}</p>

                  {/* Pricing */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                    <span className="text-sm font-semibold text-teal-600">${product.salePrice.toFixed(2)} incl. ⓘ</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View More Button */}
        <div className="flex justify-center mt-6">
          <button className="px-6 py-2 bg-[#09B1BA] hover:bg-[#078A91] text-white rounded-lg font-medium hover:bg-teal-700 transition-colors duration-200">
            View More
          </button>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
