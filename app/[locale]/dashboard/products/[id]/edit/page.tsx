import { getSellerProductById } from '@/lib/actions/products'
import { getRootCategories } from '@/lib/actions/categories'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProductForm } from '@/components/seller/product-form'
import Link from 'next/link'
import { ArrowLeft, Edit } from 'lucide-react'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params
  
  const [product, categories] = await Promise.all([
    getSellerProductById(id),
    getRootCategories()
  ])

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard/products">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-2">Update your product listing</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-[#09B1BA]" />
              Product Information
            </CardTitle>
            <CardDescription>
              Update the details below to modify your product listing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductForm categories={categories} product={product} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
