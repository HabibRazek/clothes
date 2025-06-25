
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Hero() {
    // Removed unused state and variables


    return (
        <section className="relative h-[500px] lg:h-[600px] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/images/clothes.png"
                    alt="Woman taking mirror selfie in bedroom"
                    className="w-full h-full object-cover"
                    fill
                    priority
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/10"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
                <div className="max-w-md">
                    {/* White Card Overlay */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                            Prêt à faire du tri
                            <br />
                            dans tes placards ?
                        </h1>

                        <div className="space-y-4">
                            <Button className="w-full bg-[#09B1BA] hover:bg-[#078A91] text-white py-3 text-lg font-semibold rounded-lg">
                                Commencer à vendre
                            </Button>

                            <Link
                                href="#"
                                className="block text-center text-[#09B1BA] hover:text-[#078A91] font-medium transition-colors"
                            >
                                Découvrir comment ça marche
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}