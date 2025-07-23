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
import { Plus, Edit, Trash2, Eye, EyeOff, FolderTree, Tag, AlertTriangle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createCategory, updateCategory, deleteCategory, deleteAllCategories, seedClothingCategories } from '@/lib/actions/categories'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  icon?: string
  color?: string
  image?: string
  order: number
  isActive: boolean
  level: number
  metaTitle?: string
  metaDescription?: string
  createdAt: Date
  updatedAt: Date
  parent?: Category
  children?: Category[]
  _count?: {
    products: number
    children: number
  }
}

interface CategoryCRUDProps {
  categories: Category[]
}

export function CategoryCRUD({ categories }: CategoryCRUDProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreateSubcategoryDialogOpen, setIsCreateSubcategoryDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('categories')

  // Separate categories by level
  const rootCategories = categories.filter(cat => cat.level === 0)
  const subcategories = categories.filter(cat => cat.level > 0)

  const handleCreateCategory = async (formData: FormData) => {
    try {
      const result = await createCategory(formData)
      if (result.success) {
        alert('Category created successfully')
        setIsCreateDialogOpen(false)
        window.location.reload()
      } else {
        alert(result.error || 'Failed to create category')
      }
    } catch (error) {
      alert('Failed to create category')
    }
  }

  const handleUpdateCategory = async (formData: FormData) => {
    if (!selectedCategory) return

    try {
      const result = await updateCategory(selectedCategory.id, formData)
      if (result.success) {
        alert('Category updated successfully')
        setIsEditDialogOpen(false)
        setSelectedCategory(null)
        window.location.reload()
      } else {
        alert(result.error || 'Failed to update category')
      }
    } catch (error) {
      alert('Failed to update category')
    }
  }

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return

    try {
      const result = await deleteCategory(selectedCategory.id)
      if (result.success) {
        alert('Category deleted successfully')
        setIsDeleteDialogOpen(false)
        setSelectedCategory(null)
        window.location.reload()
      } else {
        alert(result.error || 'Failed to delete category')
      }
    } catch (error) {
      alert('Failed to delete category')
    }
  }

  const handleDeleteAllCategories = async () => {
    try {
      const result = await deleteAllCategories()
      if (result.success) {
        alert('All categories deleted successfully')
        setIsDeleteAllDialogOpen(false)
        window.location.reload()
      } else {
        alert(result.error || 'Failed to delete all categories')
      }
    } catch (error) {
      alert('Failed to delete all categories')
    }
  }

  const handleSeedCategories = async () => {
    try {
      const result = await seedClothingCategories()
      if (result.success) {
        alert('Clothing categories seeded successfully')
        window.location.reload()
      } else {
        alert(result.error || 'Failed to seed categories')
      }
    } catch (error) {
      alert('Failed to seed categories')
    }
  }

  const CategoryForm = ({ category, onSubmit, submitLabel }: {
    category?: Category
    onSubmit: (formData: FormData) => void
    submitLabel: string
  }) => (
    <form action={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Category Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={category?.name}
            placeholder="Enter category name"
            required
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={category?.slug}
            placeholder="category-slug"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={category?.description}
          placeholder="Category description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="parentId">Parent Category</Label>
          <Select name="parentId" defaultValue={category?.parentId || 'none'}>
            <SelectTrigger>
              <SelectValue placeholder="Select parent category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None (Root Category)</SelectItem>
              {rootCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="order">Display Order</Label>
          <Input
            id="order"
            name="order"
            type="number"
            defaultValue={category?.order || 0}
            min="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="icon">Icon</Label>
          <Input
            id="icon"
            name="icon"
            defaultValue={category?.icon}
            placeholder="icon-name"
          />
        </div>
        <div>
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            name="color"
            type="color"
            defaultValue={category?.color || '#09B1BA'}
          />
        </div>
        <div>
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            name="image"
            defaultValue={category?.image}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="metaTitle">Meta Title</Label>
          <Input
            id="metaTitle"
            name="metaTitle"
            defaultValue={category?.metaTitle}
            placeholder="SEO title"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="hidden"
            name="isActive"
            value={category?.isActive ?? true ? 'true' : 'false'}
          />
          <Switch
            id="isActive"
            defaultChecked={category?.isActive ?? true}
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
        <Label htmlFor="metaDescription">Meta Description</Label>
        <Textarea
          id="metaDescription"
          name="metaDescription"
          defaultValue={category?.metaDescription}
          placeholder="SEO description"
          rows={2}
        />
      </div>

      <DialogFooter>
        <Button type="submit" className="bg-gradient-to-r from-[#09B1BA] to-[#078A91]">
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="flex items-center space-x-2 text-gray-600 hover:text-[#09B1BA] transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#09B1BA] to-[#078A91] rounded-lg flex items-center justify-center">
                <FolderTree className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Category Management</h1>
                <p className="text-sm text-gray-600">Manage product categories and subcategories</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Admin Panel</p>
              <p className="text-xs text-gray-500">Category Management</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Total Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FolderTree className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Main Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{rootCategories.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FolderTree className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Subcategories</p>
                  <p className="text-2xl font-bold text-gray-900">{subcategories.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Tag className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Active Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{categories.filter(c => c.isActive).length}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#09B1BA] to-[#078A91]">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
                <DialogDescription>
                  Add a new category or subcategory to organize your products.
                </DialogDescription>
              </DialogHeader>
              <CategoryForm onSubmit={handleCreateCategory} submitLabel="Create Category" />
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateSubcategoryDialogOpen} onOpenChange={setIsCreateSubcategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-[#09B1BA] text-[#09B1BA] hover:bg-[#09B1BA] hover:text-white">
                <Tag className="h-4 w-4 mr-2" />
                Add Subcategory
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Subcategory</DialogTitle>
                <DialogDescription>
                  Add a new subcategory under an existing category.
                </DialogDescription>
              </DialogHeader>
              <CategoryForm onSubmit={handleCreateCategory} submitLabel="Create Subcategory" />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={handleSeedCategories}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Seed Clothing Categories
          </Button>

          <Dialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Delete All Categories
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete All Categories</DialogTitle>
                <DialogDescription>
                  <span className="text-red-600 font-semibold">
                    ⚠️ WARNING: This action cannot be undone!
                  </span>
                  <br /><br />
                  This will permanently delete:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>All categories and subcategories</li>
                    <li>All products in the system</li>
                    <li>All related data</li>
                  </ul>
                  <br />
                  Are you absolutely sure you want to proceed?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteAllDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteAllCategories}>
                  Yes, Delete Everything
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs for Categories and Subcategories */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="categories">
            <FolderTree className="h-4 w-4 mr-2" />
            Main Categories ({rootCategories.length})
          </TabsTrigger>
          <TabsTrigger value="subcategories">
            <Tag className="h-4 w-4 mr-2" />
            Subcategories ({subcategories.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <CategoryTable 
            categories={rootCategories}
            onEdit={(category) => {
              setSelectedCategory(category)
              setIsEditDialogOpen(true)
            }}
            onDelete={(category) => {
              setSelectedCategory(category)
              setIsDeleteDialogOpen(true)
            }}
          />
        </TabsContent>

        <TabsContent value="subcategories" className="space-y-4">
          <CategoryTable 
            categories={subcategories}
            onEdit={(category) => {
              setSelectedCategory(category)
              setIsEditDialogOpen(true)
            }}
            onDelete={(category) => {
              setSelectedCategory(category)
              setIsDeleteDialogOpen(true)
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category information.
            </DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <CategoryForm 
              category={selectedCategory}
              onSubmit={handleUpdateCategory}
              submitLabel="Update Category"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be undone.
              {selectedCategory?._count?.children && selectedCategory._count.children > 0 && (
                <span className="text-red-600 block mt-2">
                  Warning: This category has {selectedCategory._count.children} subcategories that will also be deleted.
                </span>
              )}
              {selectedCategory?._count?.products && selectedCategory._count.products > 0 && (
                <span className="text-red-600 block mt-2">
                  Warning: This category has {selectedCategory._count.products} products that will need to be reassigned.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
}

function CategoryTable({ 
  categories, 
  onEdit, 
  onDelete 
}: {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    {category.color && (
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                    )}
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-gray-500">{category.slug}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {category.parent ? (
                    <Badge variant="outline">{category.parent.name}</Badge>
                  ) : (
                    <Badge>Root</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {category._count?.products || 0}
                  </Badge>
                </TableCell>
                <TableCell>
                  {category.isActive ? (
                    <Badge className="bg-green-100 text-green-800">
                      <Eye className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <EyeOff className="h-3 w-3 mr-1" />
                      Inactive
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{category.order}</TableCell>
                <TableCell>
                  {new Date(category.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(category)}
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
  )
}
