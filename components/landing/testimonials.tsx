"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"
import {useTranslations} from 'next-intl'

export default function Testimonials() {
  const t = useTranslations('Testimonials')
  const testimonials = [
    {
      id: 1,
      nameKey: "testimonial1.author",
      locationKey: "testimonial1.location",
      avatar: null,
      rating: 5,
      textKey: "testimonial1.text",
      verified: true,
      purchaseCount: 23
    },
    {
      id: 2,
      nameKey: "testimonial2.author",
      locationKey: "testimonial2.location",
      avatar: null,
      rating: 5,
      textKey: "testimonial2.text",
      verified: true,
      purchaseCount: 45
    },
    {
      id: 3,
      nameKey: "testimonial3.author",
      locationKey: "testimonial3.location",
      avatar: null,
      rating: 5,
      textKey: "testimonial3.text",
      verified: true,
      purchaseCount: 67
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-[#09B1BA]/10 text-[#09B1BA] border-[#09B1BA]/20 mb-4">
            ⭐ Témoignages clients
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white rounded-xl overflow-hidden">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Quote Icon */}
                  <div className="flex justify-between items-start">
                    <Quote className="h-8 w-8 text-[#09B1BA]/30" />
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-700 leading-relaxed">
                    "{t(testimonial.textKey as any)}"
                  </p>

                  {/* User Info */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="relative">
                      <div className="w-10 h-10 bg-[#09B1BA] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {t(testimonial.nameKey as any)?.charAt(0) || 'U'}
                        </span>
                      </div>
                      {testimonial.verified && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#09B1BA] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{t(testimonial.nameKey as any)}</span>
                        {testimonial.verified && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            Vérifié
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{t(testimonial.locationKey as any)}</span>
                        <span>•</span>
                        <span>{testimonial.purchaseCount} achats</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#09B1BA] mb-2">4.8/5</div>
              <div className="text-sm text-gray-600">Note moyenne</div>
              <div className="flex justify-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#09B1BA] mb-2">98%</div>
              <div className="text-sm text-gray-600">Clients satisfaits</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#09B1BA] mb-2">24h</div>
              <div className="text-sm text-gray-600">Support réactif</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#09B1BA] mb-2">100%</div>
              <div className="text-sm text-gray-600">Paiement sécurisé</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
