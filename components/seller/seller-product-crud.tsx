'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash2, Eye, EyeOff, Package, Tag, Upload, Image as ImageIcon } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  level: number
  isActive: boolean
  children?: Category[]
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: { id: string; name: string }
  subcategory?: { id: string; name: string }
  images: string[]
  status: string
  stock: number
  views: number
  orders: number
  createdAt: Date
  updatedAt: Date
}

interface SellerProductCRUDProps {
  products: Product[]
  categories: Category[]
}

export function SellerProductCRUD({ products, categories }: SellerProductCRUDProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [availableSubcategories, setAvailableSubcategories] = useState<Category[]>([])

  // Get root categories and subcategories
  const rootCategories = categories.filter(cat => cat.level === 0)

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    const category = categories.find(cat => cat.id === categoryId)
    if (category) {
      const subcategories = categories.filter(cat => cat.parentId === categoryId)
      setAvailableSubcategories(subcategories)
    } else {
      setAvailableSubcategories([])
    }
  }

  const handleCreateProduct = async (formData: FormData) => {
    try {
      // Here you would call your server action to create the product
      alert('Product created successfully')
      setIsCreateDialogOpen(false)
      window.location.reload()
    } catch (error) {
      alert('Failed to create product')
    }
  }

  const handleUpdateProduct = async (formData: FormData) => {
    if (!selectedProduct) return
    
    try {
      // Here you would call your server action to update the product
      alert('Product updated successfully')
      setIsEditDialogOpen(false)
      setSelectedProduct(null)
      window.location.reload()
    } catch (error) {
      alert('Failed to update product')
    }
  }

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return
    
    try {
      // Here you would call your server action to delete the product
      alert('Product deleted successfully')
      setIsDeleteDialogOpen(false)
      setSelectedProduct(null)
      window.location.reload()
    } catch (error) {
      alert('Failed to delete product')
    }
  }

  const ProductForm = ({ product, onSubmit, submitLabel }: {
    product?: Product
    onSubmit: (formData: FormData) => void
    submitLabel: string
  }) => (
    <form action={onSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={product?.name}
            placeholder="Enter product name"
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Price (€)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            defaultValue={product?.price}
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={product?.description}
          placeholder="Product description"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="categoryId">Category</Label>
          <Select 
            name="categoryId" 
            defaultValue={product?.category.id || 'none'}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select a category</SelectItem>
              {rootCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="subcategoryId">Subcategory</Label>
          <Select 
            name="subcategoryId" 
            defaultValue={product?.subcategory?.id || 'none'}
            disabled={availableSubcategories.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subcategory" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No subcategory</SelectItem>
              {availableSubcategories.map((subcat) => (
                <SelectItem key={subcat.id} value={subcat.id}>
                  {subcat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            defaultValue={product?.stock || 0}
            min="0"
            required
          />
        </div>
        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            step="0.01"
            placeholder="0.00"
          />
        </div>
        <div className="flex items-center space-x-2 pt-6">
          <input
            type="hidden"
            name="isActive"
            value={product?.status === 'active' ? 'true' : 'false'}
          />
          <Switch
            id="isActive"
            defaultChecked={product?.status === 'active'}
            onCheckedChange={(checked) => {
              const hiddenInput = document.querySelector('input[name="isActive"]') as HTMLInputElement
              if (hiddenInput) {
                hiddenInput.value = checked ? 'true' : 'false'
              }
            }}
          />
          <Label htmlFor="isActive">Active</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="images">Product Images</Label>
        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <Button type="button" variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Images
            </Button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            PNG, JPG, GIF up to 10MB each
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            name="brand"
            placeholder="Product brand"
          />
        </div>
        <div>
          <Label htmlFor="condition">Condition</Label>
          <Select name="condition" defaultValue="new">
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="like-new">Like New</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" className="bg-gradient-to-r from-[#09B1BA] to-[#078A91]">
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  )

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#09B1BA] to-[#078A91]">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Product</DialogTitle>
                <DialogDescription>
                  Add a new product to your store.
                </DialogDescription>
              </DialogHeader>
              <ProductForm onSubmit={handleCreateProduct} submitLabel="Create Product" />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-[200px]">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <Badge variant="outline">{product.category.name}</Badge>
                      {product.subcategory && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {product.subcategory.name}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">€{product.price}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                      {product.stock}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {product.status === 'active' ? (
                      <Badge className="bg-green-100 text-green-800">
                        <Eye className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <EyeOff className="h-3 w-3 mr-1" />
                        {product.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{product.views}</TableCell>
                  <TableCell>{product.orders}</TableCell>
                  <TableCell>
                    {new Date(product.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(product)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(product)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product information.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <ProductForm 
              product={selectedProduct}
              onSubmit={handleUpdateProduct}
              submitLabel="Update Product"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
