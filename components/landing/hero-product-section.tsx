"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const pulseKeyframes = `
  @keyframes heartPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  @keyframes heartGlow {
    0% { box-shadow: 0 0 5px rgba(239, 68, 68, 0.4), 0 0 10px rgba(239, 68, 68, 0.2); }
    50% { box-shadow: 0 0 10px rgba(239, 68, 68, 0.6), 0 0 20px rgba(239, 68, 68, 0.3); }
    100% { box-shadow: 0 0 5px rgba(239, 68, 68, 0.4), 0 0 10px rgba(239, 68, 68, 0.2); }
  }
  .heart-pulse {
    animation: heartPulse 0.3s ease-in-out;
  }
  .heart-glow {
    animation: heartGlow 2s ease-in-out infinite;
  }
`

export default function Component() {
  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 199.99,
      originalPrice: 249.99,
      rating: 4.5,
      reviews: 128,
      image: "/placeholder.svg?height=300&width=300",
      badge: "Best Seller",
      description: "Premium noise-canceling wireless headphones with 30-hour battery life.",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 299.99,
      originalPrice: null,
      rating: 4.8,
      reviews: 89,
      image: "/placeholder.svg?height=300&width=300",
      badge: "New",
      description: "Advanced fitness tracking with heart rate monitor and GPS.",
    },
    {
      id: 3,
      name: "Laptop Stand",
      price: 79.99,
      originalPrice: 99.99,
      rating: 4.3,
      reviews: 256,
      image: "/placeholder.svg?height=300&width=300",
      badge: "Sale",
      description: "Ergonomic aluminum laptop stand with adjustable height.",
    },
    {
      id: 4,
      name: "Bluetooth Speaker",
      price: 149.99,
      originalPrice: null,
      rating: 4.6,
      reviews: 174,
      image: "/placeholder.svg?height=300&width=300",
      badge: null,
      description: "Portable waterproof speaker with 360-degree sound.",
    },
  ]

  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (productId: number) => {
    // Add a small vibration effect on mobile devices
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }

    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pulseKeyframes }} />
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/20">
        <div className="container px-4 md:px-6">
          {/* Hero Header */}
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Discover Amazing Products
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Explore our curated collection of premium tech products designed to enhance your lifestyle.
              </p>
            </div>
            <div className="space-x-4">
              <Button size="lg">Shop Now</Button>
              <Button variant="outline" size="lg" className="bg-background text-foreground">
                View All Products
              </Button>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.badge && (
                      <Badge
                        className="absolute top-2 left-2"
                        variant={
                          product.badge === "Sale" ? "destructive" : product.badge === "New" ? "default" : "secondary"
                        }
                      >
                        {product.badge}
                      </Badge>
                    )}
                    <Button
                      size="icon"
                      variant="secondary"
                      className={`absolute top-2 right-2 bg-white/90 hover:bg-white shadow-sm transition-all duration-200 hover:scale-110 active:scale-95 ${
                        favorites.includes(product.id) ? "heart-glow shadow-red-500/30" : ""
                      }`}
                      onClick={() => toggleFavorite(product.id)}
                    >
                      <Heart
                        className={`h-4 w-4 transition-all duration-300 ${
                          favorites.includes(product.id)
                            ? "fill-red-500 text-red-500 scale-110 heart-pulse drop-shadow-sm"
                            : "text-gray-600 hover:text-red-400"
                        }`}
                      />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg leading-none tracking-tight">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

                    {/* Rating */}
                    <div className="flex items-center space-x-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-muted text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">({product.reviews})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFavorite(product.id)}
                      className={`flex-shrink-0 transition-all duration-200 hover:scale-105 active:scale-95 ${
                        favorites.includes(product.id) ? "heart-glow border-red-200 bg-red-50/50" : ""
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 transition-all duration-300 ${
                          favorites.includes(product.id)
                            ? "fill-red-500 text-red-500 scale-110 heart-pulse drop-shadow-sm"
                            : "hover:text-red-400"
                        }`}
                      />
                    </Button>
                    <Button className="flex-1" size="sm">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="flex justify-center mt-12">
            <Button variant="outline" size="lg" className="bg-background text-foreground">
              View More Products
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
