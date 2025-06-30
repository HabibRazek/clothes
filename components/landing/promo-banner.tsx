"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Gift, Truck, Shield } from "lucide-react"
import {useTranslations} from 'next-intl'
import {Link} from "../../i18n/navigation"

export default function PromoBanner() {
  const t = useTranslations('PromoBanner')
  const features = [
    {
      icon: Truck,
      title: "Livraison gratuite",
      description: "Dès 20€ d'achat"
    },
    {
      icon: Shield,
      title: "Achat protégé",
      description: "Garantie satisfait ou remboursé"
    },
    {
      icon: Gift,
      title: "Points fidélité",
      description: "Gagne des points à chaque achat"
    },
    {
      icon: Sparkles,
      title: "Articles authentiques",
      description: "Vérifiés par notre équipe"
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-[#09B1BA] to-[#078A91] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-32 right-10 w-24 h-24 border-2 border-white rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <Badge className="bg-white/20 text-white border-white/30 mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Offre limitée
            </Badge>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {t('title')}
            </h2>

            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {t('subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/sell">
                <Button size="lg" className="bg-white text-[#09B1BA] hover:bg-gray-100 font-semibold px-8">
                  {t('button')}
                </Button>
              </Link>
              <Link href="/sell">
                <Button size="lg" variant="outline" className="border-white text-[#09B1BA] hover:bg-gray-100 hover:text-white font-semibold px-8">
                  {t('button')}
                </Button>
              </Link>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                      <p className="text-sm text-white/80">{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">
                Pourquoi choisir Clothes ?
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">2M+</div>
                  <div className="text-white/90 text-sm">Membres actifs</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">50M+</div>
                  <div className="text-white/90 text-sm">Articles vendus</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">4.8★</div>
                  <div className="text-white/90 text-sm">Note moyenne</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">24h</div>
                  <div className="text-white/90 text-sm">Livraison moyenne</div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-white/10 rounded-lg border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-[#09B1BA] font-bold text-sm">🎉</span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">Offre de bienvenue</div>
                    <div className="text-sm text-white/80">-20% sur ton premier achat</div>
                  </div>
                </div>
                <Button size="sm" className="w-full bg-white text-[#09B1BA] hover:bg-gray-100 font-semibold">
                  Profiter de l'offre
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
