import { getRootCategories } from '@/lib/actions/categories'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProductForm } from '@/components/seller/product-form'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'

export default async function NewProductPage() {
  const categories = await getRootCategories()

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
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-2">Create a new product listing for your store</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#09B1BA]" />
              Product Information
            </CardTitle>
            <CardDescription>
              Fill in the details below to create your product listing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductForm categories={categories} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
