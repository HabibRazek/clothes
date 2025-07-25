"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import {
    Search,
    Menu,
    ChevronDown,
    HelpCircle,
    Globe,
    Shirt,
    ShoppingBag,
    Footprints,
    Watch,
    Sparkles,
    Sun,
    Grid3X3,
} from "lucide-react"
import {Link} from "../../i18n/navigation"
import {useTranslations, useLocale} from 'next-intl'
import {useRouter, usePathname} from '../../i18n/navigation'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { UserMenu } from "@/components/auth/user-menu"

// These will be translated in the component
const categoryKeys = [
    "women",
    "men",
    "designerItems",
    "kids",
    "home",
    "electronics",
    "entertainment",
    "sports",
    "about",
    "ourPlatform",
]

const articleCategoryKeys = [
    "womenClothing",
    "womenShoes",
    "womenBags",
    "womenAccessories",
    "menClothing",
    "menShoes",
    "menAccessories",
    "kidsBabies",
]

// Mega menu data structure
const megaMenuData = {
    sidebar: [
        { icon: Grid3X3, label: "Tout", href: "#", isActive: false },
        { icon: Sun, label: "Tendances été", href: "#", isActive: true, badge: "Nouveau" },
        { icon: Shirt, label: "Vêtements", href: "#", isActive: false },
        { icon: Footprints, label: "Chaussures", href: "#", isActive: false },
        { icon: ShoppingBag, label: "Sacs", href: "#", isActive: false },
        { icon: Watch, label: "Accessoires", href: "#", isActive: false },
        { icon: Sparkles, label: "Beauté", href: "#", isActive: false },
    ],
    columns: [
        {
            items: [
                "Activewear",
                "Casquettes",
                "Tongs & sandales",
                "Bijoux",
                "Sandales",
                "Jupes",
                "Chaussures de sport",
                "Maillots de bain",
            ],
        },
        {
            items: [
                "Sacs de plage",
                "Robes",
                "Sacs à main",
                "Combinaisons",
                "Shorts & pantalons courts",
                "Baskets",
                "Lunettes de soleil",
                "Hauts & T-shirts",
            ],
        },
    ],
}

// Add this mega menu data structure after the existing megaMenuData
const categoryMegaMenus = {
    women: {
        sections: [
            {
                title: "Vêtements",
                items: [
                    "Robes",
                    "Hauts & T-shirts",
                    "Pantalons",
                    "Jupes",
                    "Shorts",
                    "Blazers & Vestes",
                    "Pulls & Gilets",
                    "Lingerie",
                    "Pyjamas",
                ],
            },
            {
                title: "Chaussures",
                items: [
                    "Baskets",
                    "Sandales",
                    "Escarpins",
                    "Bottes",
                    "Bottines",
                    "Ballerines",
                    "Chaussures de sport",
                    "Tongs",
                    "Mocassins",
                ],
            },
            {
                title: "Sacs & Accessoires",
                items: [
                    "Sacs à main",
                    "Sacs à dos",
                    "Pochettes",
                    "Portefeuilles",
                    "Bijoux",
                    "Montres",
                    "Lunettes",
                    "Écharpes",
                    "Ceintures",
                ],
            },
            {
                title: "Beauté",
                items: [
                    "Maquillage",
                    "Parfums",
                    "Soins visage",
                    "Soins corps",
                    "Cheveux",
                    "Vernis à ongles",
                    "Accessoires beauté",
                ],
            },
        ],
    },
    men: {
        sections: [
            {
                title: "Vêtements",
                items: [
                    "T-shirts",
                    "Chemises",
                    "Pantalons",
                    "Jeans",
                    "Shorts",
                    "Vestes",
                    "Pulls",
                    "Costumes",
                    "Sous-vêtements",
                ],
            },
            {
                title: "Chaussures",
                items: [
                    "Baskets",
                    "Chaussures de ville",
                    "Boots",
                    "Sandales",
                    "Chaussures de sport",
                    "Mocassins",
                    "Chaussures de sécurité",
                ],
            },
            {
                title: "Accessoires",
                items: ["Montres", "Sacs", "Portefeuilles", "Ceintures", "Casquettes", "Lunettes", "Bijoux", "Écharpes"],
            },
            {
                title: "Sport",
                items: [
                    "Vêtements de sport",
                    "Chaussures de sport",
                    "Équipement fitness",
                    "Maillots de bain",
                    "Accessoires sport",
                ],
            },
        ],
    },
    designerItems: {
        sections: [
            {
                title: "Créateurs Femmes",
                items: ["Robes de créateur", "Sacs de luxe", "Chaussures designer", "Bijoux de créateur", "Parfums de niche"],
            },
            {
                title: "Créateurs Hommes",
                items: ["Costumes sur mesure", "Montres de luxe", "Chaussures italiennes", "Accessoires premium"],
            },
            {
                title: "Marques Premium",
                items: ["Chanel", "Louis Vuitton", "Hermès", "Gucci", "Prada", "Dior"],
            },
            {
                title: "Collections Limitées",
                items: ["Éditions limitées", "Collaborations", "Pièces vintage", "Haute couture"],
            },
        ],
    },
    kids: {
        sections: [
            {
                title: "Bébé (0-2 ans)",
                items: [
                    "Bodies",
                    "Pyjamas",
                    "Robes",
                    "Pantalons",
                    "Chaussures bébé",
                    "Accessoires bébé",
                    "Jouets",
                    "Poussettes",
                ],
            },
            {
                title: "Fille (2-14 ans)",
                items: [
                    "Robes",
                    "T-shirts",
                    "Pantalons",
                    "Jupes",
                    "Chaussures fille",
                    "Sacs d'école",
                    "Accessoires",
                    "Jouets fille",
                ],
            },
            {
                title: "Garçon (2-14 ans)",
                items: [
                    "T-shirts",
                    "Pantalons",
                    "Shorts",
                    "Vestes",
                    "Chaussures garçon",
                    "Sacs d'école",
                    "Accessoires",
                    "Jouets garçon",
                ],
            },
            {
                title: "Ado (14+ ans)",
                items: ["Mode ado", "Chaussures ado", "Sacs", "Accessoires tech", "Sport", "Beauté ado"],
            },
        ],
    },
    home: {
        sections: [
            {
                title: "Décoration",
                items: ["Coussins", "Rideaux", "Tapis", "Tableaux", "Vases", "Bougies", "Miroirs"],
            },
            {
                title: "Mobilier",
                items: ["Canapés", "Tables", "Chaises", "Étagères", "Commodes", "Lits"],
            },
            {
                title: "Cuisine",
                items: ["Vaisselle", "Ustensiles", "Électroménager", "Rangement", "Linge de table"],
            },
            {
                title: "Jardin",
                items: ["Mobilier jardin", "Plantes", "Outils jardinage", "Barbecue", "Parasols"],
            },
        ],
    },
    electronics: {
        sections: [
            {
                title: "Smartphones & Tablettes",
                items: ["iPhone", "Samsung", "iPad", "Accessoires mobile", "Coques"],
            },
            {
                title: "Informatique",
                items: ["Ordinateurs portables", "PC de bureau", "Écrans", "Claviers", "Souris"],
            },
            {
                title: "Audio & Vidéo",
                items: ["Casques", "Enceintes", "TV", "Consoles de jeux", "Appareils photo"],
            },
            {
                title: "Objets connectés",
                items: ["Montres connectées", "Domotique", "Fitness trackers", "Enceintes intelligentes"],
            },
        ],
    },
}

// Add state for category mega menu
export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [showMegaMenu, setShowMegaMenu] = useState(false)
    const [activeCategoryMenu, setActiveCategoryMenu] = useState<string | null>(null)

    const { data: session } = useSession()
    const t = useTranslations('Navigation')
    const tCategories = useTranslations('Categories')
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    const categories = categoryKeys.map(key => tCategories(key as any))
    const articleCategories = articleCategoryKeys.map(key => tCategories(key as any))

    const handleLanguageChange = (newLocale: string) => {
        router.replace(pathname, {locale: newLocale})
    }

    return (
        <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            {/* Main Navigation */}
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <span className="text-2xl font-bold text-[#09B1BA]">Clothes</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center flex-1 max-w-2xl mx-8">
                        {/* Articles Dropdown with Mega Menu */}
                        <div
                            className="relative"
                            onMouseEnter={() => setShowMegaMenu(true)}
                            onMouseLeave={() => setShowMegaMenu(false)}
                        >
                            <Button variant="ghost" className="flex items-center gap-1 text-gray-700 hover:text-[#09B1BA]">
                                {t('articles')}
                                <ChevronDown className="h-4 w-4" />
                            </Button>

                            {/* Mega Menu */}
                            {showMegaMenu && (
                                <div className="absolute top-full left-0 w-[800px] bg-white shadow-xl border border-gray-200 rounded-lg mt-1 p-6 z-50">
                                    <div className="flex gap-6">
                                        {/* Sidebar */}
                                        <div className="w-48 space-y-2">
                                            {megaMenuData.sidebar.map((item, index) => {
                                                const IconComponent = item.icon
                                                return (
                                                    <Link
                                                        key={index}
                                                        href={item.href}
                                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${item.isActive ? "bg-teal-50 text-teal-600" : "text-gray-700 hover:bg-gray-50"
                                                            }`}
                                                    >
                                                        <IconComponent className="h-4 w-4" />
                                                        <span className="text-sm font-medium">{item.label}</span>
                                                        {item.badge && (
                                                            <span className="ml-auto bg-teal-100 text-teal-700 text-xs px-2 py-0.5 rounded-full">
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                    </Link>
                                                )
                                            })}
                                        </div>

                                        {/* Content Columns */}
                                        <div className="flex-1 grid grid-cols-2 gap-8">
                                            {megaMenuData.columns.map((column, columnIndex) => (
                                                <div key={columnIndex} className="space-y-3">
                                                    {column.items.map((item, itemIndex) => (
                                                        <Link
                                                            key={itemIndex}
                                                            href="#"
                                                            className="block text-sm text-gray-600 hover:text-[#09B1BA] transition-colors py-1"
                                                        >
                                                            {item}
                                                        </Link>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-md mx-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    type="text"
                                    placeholder={t('search')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-gray-50 border-gray-200 focus:border-[#09B1BA] focus:ring-[#09B1BA] rounded-md"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Desktop Action Buttons */}
                    <div className="hidden lg:flex items-center gap-4">
                        {session ? (
                            /* Logged in user menu */
                            <>
                                {/* Sell Button */}
                                <Link href="/sell">
                                  <Button className="bg-[#09B1BA] hover:bg-[#078A91] text-white px-6 rounded-md">{t('sell')}</Button>
                                </Link>

                                {/* Help Icon */}
                                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-[#09B1BA]">
                                    <HelpCircle className="h-5 w-5" />
                                </Button>

                                {/* Language Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="flex items-center gap-1 text-gray-600 hover:text-[#09B1BA]">
                                            <Globe className="h-4 w-4" />
                                            {locale.toUpperCase()}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => handleLanguageChange('fr')}>Français</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleLanguageChange('en')}>English</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* User Menu */}
                                <UserMenu />
                            </>
                        ) : (
                            /* Not logged in - show login/signup */
                            <>
                                {/* Sign In / Up Links with Border Grouping */}
                                <div className="border border-[#09B1BA] rounded-md px-3 py-1.5 flex items-center gap-3">
                                    <Link href="/login" className="text-sm text-[#01888f] hover:text-[#09B1BA] transition-colors">
                                        {t('login')}
                                    </Link>
                                    <span className="text-[#09B1BA]">|</span>
                                    <Link href="/signup" className="text-sm text-[#01888f] hover:text-[#09B1BA] transition-colors">
                                        {t('signup')}
                                    </Link>
                                </div>

                                {/* Sell Button */}
                                <Link href="/sell">
                                  <Button className="bg-[#09B1BA] hover:bg-[#078A91] text-white px-6 rounded-md">{t('sell')}</Button>
                                </Link>

                                {/* Help Icon */}
                                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-[#09B1BA]">
                                    <HelpCircle className="h-5 w-5" />
                                </Button>

                                {/* Language Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="flex items-center gap-1 text-gray-600 hover:text-[#09B1BA]">
                                            <Globe className="h-4 w-4" />
                                            {locale.toUpperCase()}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => handleLanguageChange('fr')}>Français</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleLanguageChange('en')}>English</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="p-0 w-full sm:w-full">
                            <div className="flex flex-col h-full">
                                <SheetHeader className="px-6 py-4 border-b border-gray-200">
                                    <SheetTitle className="text-left text-2xl font-bold text-[#09B1BA]">{t('menu')}</SheetTitle>
                                </SheetHeader>
                                <div className="flex-1 overflow-y-auto px-6 py-6">
                                    <div className="space-y-6">
                                        {/* Mobile Search */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">{t('search')}</label>
                                            <div className="relative mt-2">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                                <Input
                                                    type="text"
                                                    placeholder={t('search')}
                                                    className="pl-12 py-3 bg-gray-50 border-gray-200 text-base rounded-md"
                                                />
                                            </div>
                                        </div>
                                        <Separator className="my-6" />

                                        {/* Mobile Auth Section */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-900">{t('account')}</h3>
                                            {session ? (
                                                /* Logged in user info */
                                                <div className="border border-gray-300 rounded-md p-4">
                                                    <UserMenu />
                                                </div>
                                            ) : (
                                                /* Not logged in - show login/signup */
                                                <div className="border border-gray-300 rounded-md p-2 space-y-2">
                                                    <Link
                                                        href="/login"
                                                        className="block py-2 px-3 text-gray-700 hover:text-[#09B1BA] hover:bg-purple-50 rounded transition-colors text-base"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        {t('login')}
                                                    </Link>
                                                    <Link
                                                        href="/signup"
                                                        className="block py-2 px-3 text-gray-700 hover:text-[#09B1BA] hover:bg-purple-50 rounded transition-colors text-base"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        {t('signup')}
                                                    </Link>
                                                </div>
                                            )}
                                        </div>

                                        <div className="py-2">
                                            <Link href="/sell" className="block">
                                                <Button className="w-full bg-[#09B1BA] hover:bg-[#078A91] text-white py-3 text-base font-medium rounded-md">
                                                    {t('sell')}
                                                </Button>
                                            </Link>
                                        </div>
                                        <Separator className="my-6" />

                                        {/* Mobile Categories */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-900">{t('categories')}</h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                {categories.map((category, index) => {
                                                    const icons = [Shirt, Shirt, Sparkles, Shirt, ShoppingBag, Watch, Sun, Footprints, HelpCircle, Grid3X3];
                                                    const Icon = icons[index] || Grid3X3;
                                                    return (
                                                        <Link
                                                            key={category}
                                                            href="#"
                                                            className="flex flex-col items-center py-4 px-3 text-gray-700 hover:text-[#09B1BA] hover:bg-[#09B1BA]/5 rounded-xl transition-all duration-200 border border-gray-100 hover:border-[#09B1BA]/20 hover:shadow-sm"
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            <Icon className="h-6 w-6 mb-2 text-[#09B1BA]" />
                                                            <span className="text-xs text-center font-medium leading-tight">{category}</span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <Separator className="my-6" />

                                        {/* Mobile Articles */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-900">{t('popularItems')}</h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                {articleCategories.map((category, index) => {
                                                    const icons = [Shirt, Footprints, ShoppingBag, Watch, Shirt, Footprints, Watch, Sparkles];
                                                    const Icon = icons[index] || Shirt;
                                                    return (
                                                        <Link
                                                            key={category}
                                                            href="#"
                                                            className="flex flex-col items-center py-3 px-2 text-gray-700 hover:text-[#09B1BA] hover:bg-[#09B1BA]/5 rounded-lg transition-all duration-200 border border-gray-100 hover:border-[#09B1BA]/20"
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            <Icon className="h-5 w-5 mb-1 text-[#09B1BA]" />
                                                            <span className="text-xs text-center font-medium leading-tight">{category}</span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile Footer */}
                                <div className="border-t border-gray-200 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="flex items-center gap-2 text-gray-600 px-4 py-2 rounded-md"
                                                >
                                                    <Globe className="h-4 w-4" />
                                                    {locale === 'fr' ? 'Français' : 'English'}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => handleLanguageChange('fr')}>Français</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleLanguageChange('en')}>English</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <Button variant="outline" size="icon" className="text-gray-600 hover:text-[#09B1BA] rounded-md">
                                            <HelpCircle className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Secondary Navigation - Categories */}
            <div className="hidden lg:block bg-gray-50 border-t border-gray-200 relative">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center space-x-8 h-12 overflow-x-auto">
                        {categoryKeys.map((categoryKey, index) => {
                            const translatedCategory = categories[index]
                            return (
                                <div
                                    key={categoryKey}
                                    className="relative h-full flex items-center"
                                    onMouseEnter={() => setActiveCategoryMenu(categoryKey)}
                                    onMouseLeave={() => setActiveCategoryMenu(null)}
                                >
                                    <Link
                                        href="#"
                                        className="text-sm text-gray-600 hover:text-[#09B1BA] transition-colors whitespace-nowrap py-3 border-b-2 border-transparent hover:border-[#09B1BA] h-full flex items-center"
                                    >
                                        {translatedCategory}
                                    </Link>
                                </div>
                            )
                        })}
                    </nav>
                </div>

                {/* Full-width Category Mega Menu */}
                {activeCategoryMenu && categoryMegaMenus[activeCategoryMenu as keyof typeof categoryMegaMenus] && (
                    <div
                        className="absolute top-full left-0 w-screen bg-white shadow-2xl border-t border-gray-200 z-50"
                        onMouseEnter={() => setActiveCategoryMenu(activeCategoryMenu)}
                        onMouseLeave={() => setActiveCategoryMenu(null)}
                        style={{ marginLeft: "calc(-50vw + 50%)" }}
                    >
                        <div className="max-w-7xl mx-auto px-4 py-8">
                            <div className="grid grid-cols-4 gap-8">
                                {categoryMegaMenus[activeCategoryMenu as keyof typeof categoryMegaMenus].sections.map(
                                    (section, index) => (
                                        <div key={index} className="space-y-4">
                                            <h3 className="font-semibold text-gray-900 text-base border-b border-gray-200 pb-2">
                                                {section.title}
                                            </h3>
                                            <ul className="space-y-2">
                                                {section.items.map((item, itemIndex) => (
                                                    <li key={itemIndex}>
                                                        <Link
                                                            href="#"
                                                            className="text-sm text-gray-600 hover:text-[#09B1BA] transition-colors block py-1 hover:bg-purple-50 px-2 rounded"
                                                        >
                                                            {item}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ),
                                )}
                            </div>

                            {/* Featured Section */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-[#09B1BA] to-[#078A91] rounded-lg flex items-center justify-center">
                                            <Sparkles className="h-8 w-8 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Nouveautés {activeCategoryMenu}</h4>
                                            <p className="text-sm text-gray-600">Découvrez les dernières tendances</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="border-[#09B1BA] text-[#09B1BA] hover:bg-[#09B1BA] hover:text-white"
                                    >
                                        Voir tout
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Categories Bar */}
            <div className="lg:hidden bg-gray-50 border-t border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex items-center space-x-6 h-12 overflow-x-auto">
                        {categories.slice(0, 4).map((category) => (
                            <Link
                                key={category}
                                href="#"
                                className="text-sm text-gray-600 hover:text-[#09B1BA] transition-colors whitespace-nowrap"
                            >
                                {category}
                            </Link>
                        ))}
                        <Button variant="ghost" size="sm" className="text-gray-600 whitespace-nowrap">
                            Plus...
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}
