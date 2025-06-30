import {Link} from "../../i18n/navigation"
import { Button } from "@/components/ui/button"
import {useTranslations} from 'next-intl'

export default function Hero() {
    const t = useTranslations('HomePage')


    return (
        <section className="relative h-[500px] lg:h-[600px] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                        <div className="text-6xl mb-4">📷</div>
                        <div className="text-lg font-medium">Hero Image Placeholder</div>
                        <div className="text-sm">1200x600px recommended</div>
                    </div>
                </div>
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/10"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
                <div className="max-w-md">
                    {/* White Card Overlay */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                            {t('heroTitle')}
                        </h1>

                        <p className="text-gray-600 mb-6">
                            {t('heroSubtitle')}
                        </p>

                        <div className="space-y-4">
                            <Link href="/sell">
                                <Button className="w-full bg-[#09B1BA] hover:bg-[#078A91] text-white py-3 text-lg font-semibold rounded-lg">
                                    {t('heroButton')}
                                </Button>
                            </Link>

                            <Link
                                href="#"
                                className="block text-center text-[#09B1BA] hover:text-[#078A91] font-medium transition-colors"
                            >
                                {t('heroLink')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}