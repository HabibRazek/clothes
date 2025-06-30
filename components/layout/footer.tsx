"use client"

import { Separator } from "@/components/ui/separator"
import {
  Smartphone,
  Mail,
  MapPin,
} from "lucide-react"
import {Link} from "../../i18n/navigation"
import {useTranslations} from 'next-intl'

export default function Footer() {
  const t = useTranslations('Footer')
  const tCategories = useTranslations('Categories')
  const footerSections = [
    {
      titleKey: "brand",
      links: [
        { nameKey: "aboutUs", href: "/about", section: "Footer" },
        { nameKey: "howItWorks", href: "/how-it-works", section: "Footer" },
        { nameKey: "press", href: "/press", section: "Footer" },
        { nameKey: "careers", href: "/careers", section: "Footer" },
        { nameKey: "sustainability", href: "/sustainability", section: "Footer" }
      ]
    },
    {
      titleKey: "discover",
      links: [
        { nameKey: "women", href: "/women", section: "Categories" },
        { nameKey: "men", href: "/men", section: "Categories" },
        { nameKey: "kids", href: "/kids", section: "Categories" },
        { nameKey: "home", href: "/home", section: "Categories" },
        { nameKey: "popularBrands", href: "/brands", section: "Footer" }
      ]
    },
    {
      titleKey: "help",
      links: [
        { nameKey: "helpCenter", href: "/help", section: "Footer" },
        { nameKey: "sell", href: "/sell", section: "Footer" },
        { nameKey: "buy", href: "/buy", section: "Footer" },
        { nameKey: "trustSafety", href: "/safety", section: "Footer" },
        { nameKey: "contactUs", href: "/contact", section: "Footer" }
      ]
    },
    {
      titleKey: "legal",
      links: [
        { nameKey: "terms", href: "/terms", section: "Footer" },
        { nameKey: "privacy", href: "/privacy", section: "Footer" },
        { nameKey: "cookies", href: "/cookies", section: "Footer" },
        { nameKey: "legalNotices", href: "/legal", section: "Footer" },
        { nameKey: "disputeResolution", href: "/disputes", section: "Footer" }
      ]
    }
  ]

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center mb-6">
                <span className="text-2xl font-bold text-[#09B1BA]">{t('brand')}</span>
              </Link>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t('description')}
              </p>

              {/* Social Media */}
              <div className="flex gap-4 mb-6">
                <Link href="#" className="p-2 bg-gray-100 rounded-lg hover:bg-[#09B1BA] hover:text-white transition-colors">
                  <div className="h-5 w-5 text-gray-600 flex items-center justify-center text-xs font-bold">f</div>
                </Link>
                <Link href="#" className="p-2 bg-gray-100 rounded-lg hover:bg-[#09B1BA] hover:text-white transition-colors">
                  <div className="h-5 w-5 text-gray-600 flex items-center justify-center text-xs font-bold">ig</div>
                </Link>
                <Link href="#" className="p-2 bg-gray-100 rounded-lg hover:bg-[#09B1BA] hover:text-white transition-colors">
                  <div className="h-5 w-5 text-gray-600 flex items-center justify-center text-xs font-bold">tw</div>
                </Link>
                <Link href="#" className="p-2 bg-gray-100 rounded-lg hover:bg-[#09B1BA] hover:text-white transition-colors">
                  <div className="h-5 w-5 text-gray-600 flex items-center justify-center text-xs font-bold">yt</div>
                </Link>
              </div>

              {/* App Download */}
              <div className="space-y-3">
                <p className="text-sm text-gray-600 font-medium">{t('downloadApp')}</p>
                <div className="flex gap-3">
                  <Link href="#" className="block">
                    <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gray-200 transition-colors">
                      <Smartphone className="h-6 w-6 text-gray-600" />
                      <div>
                        <div className="text-xs text-gray-500">{t('downloadOn')}</div>
                        <div className="text-sm font-semibold text-gray-700">{t('appStore')}</div>
                      </div>
                    </div>
                  </Link>
                  <Link href="#" className="block">
                    <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gray-200 transition-colors">
                      <Smartphone className="h-6 w-6 text-gray-600" />
                      <div>
                        <div className="text-xs text-gray-500">{t('availableOn')}</div>
                        <div className="text-sm font-semibold text-gray-700">{t('googlePlay')}</div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold text-gray-900 mb-4">{t(section.titleKey as any)}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-gray-600 hover:text-[#09B1BA] transition-colors text-sm"
                      >
                        {link.section === 'Categories' ? tCategories(link.nameKey as any) : t(link.nameKey as any)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Separator className="bg-gray-200" />

      {/* Bottom Footer */}
      <div className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-600">
              <span>{t('copyright')}</span>
              <div className="flex items-center gap-4">
                <Link href="/terms" className="hover:text-[#09B1BA] transition-colors">
                  {t('terms')}
                </Link>
                <Link href="/privacy" className="hover:text-[#09B1BA] transition-colors">
                  {t('privacy')}
                </Link>
                <Link href="/cookies" className="hover:text-[#09B1BA] transition-colors">
                  {t('cookies')}
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{t('france')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{t('support')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
