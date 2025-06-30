import Hero from "@/components/landing/hero";
import NewsfeedSection from "@/components/landing/newsfeed-section";
import PromoBanner from "@/components/landing/promo-banner";
import Testimonials from "@/components/landing/testimonials";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/layout/footer";
import FeaturedSection from "@/components/landing/featured-section";
import CategoriesSection from "@/components/landing/categories-section";
import EnhancedProductCards from "@/components/landing/enhanced-product-cards";
import {setRequestLocale} from 'next-intl/server';

export default async function Home({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  
  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      <Hero/>
      <FeaturedSection />
      <CategoriesSection />
      <EnhancedProductCards />
      <PromoBanner />
      <Testimonials />
      <NewsfeedSection />
      <Footer />
    </div>
  );
}
