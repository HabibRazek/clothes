import { getPublicProductById } from '@/lib/actions/products'
import { notFound } from 'next/navigation'
import ProductDetailClient from '@/components/products/product-detail-client'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/layout/footer'

interface ProductPageProps {
  params: Promise<{
    id: string
    locale: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  
  const result = await getPublicProductById(id)
  
  if (!result.success || !result.product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ProductDetailClient product={result.product} />
      <Footer />
    </div>
  )
}
