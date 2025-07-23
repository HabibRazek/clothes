'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Plus } from 'lucide-react'
import { createCategory, updateCategory } from '@/lib/actions/categories'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  level: number
  order: number
  isActive: boolean
  color: string | null
  icon: string | null
  parentId: string | null
  parent: {
    name: string
  } | null
  children: Category[]
  _count: {
    products: number
    children: number
  }
}

interface CategoryFormProps {
  category?: Category
  onClose?: () => void
  allCategories?: Category[]
  trigger?: React.ReactNode
}

export function CategoryForm({ category, onClose, allCategories = [], trigger }: CategoryFormProps) {
  const [open, setOpen] = useState(!!category)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const isEditing = !!category
  const rootCategories = allCategories.filter(cat => cat.level === 0 && cat.id !== category?.id)
  const subcategories = allCategories.filter(cat => cat.level === 1 && cat.id !== category?.id)
  const allParentOptions = [...rootCategories, ...subcategories]

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    
    try {
      let result
      if (isEditing && category) {
        result = await updateCategory(category.id, formData)
      } else {
        result = await createCategory(formData)
      }
      
      if (result.success) {
        setOpen(false)
        if (onClose) onClose()
      } else {
        alert(result.error || 'Failed to save category')
      }
    } catch (error) {
      alert('Failed to save category')
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const predefinedColors = [
    '#09B1BA', '#10B981', '#8B5CF6', '#F59E0B', 
    '#EF4444', '#3B82F6', '#EC4899', '#6366F1'
  ]

  const predefinedIcons = [
    'Shirt', 'Footprints', 'ShoppingBag', 'Sparkles',
    'Package', 'FolderTree', 'Tag', 'Star'
  ]

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen && onClose) onClose()
    }}>
      {!isEditing && (
        <DialogTrigger asChild>
          {trigger || (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Category' : 'Add New Category'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the category information below.'
              : 'Create a new category for organizing products.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form action={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={category?.name || ''}
                placeholder="e.g., Vêtements"
                required
                onChange={(e) => {
                  const slugInput = document.getElementById('slug') as HTMLInputElement
                  if (slugInput && !isEditing) {
                    slugInput.value = generateSlug(e.target.value)
                  }
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={category?.slug || ''}
                placeholder="e.g., vetements"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={category?.description || ''}
              placeholder="Brief description of this category"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parentId">Parent Category</Label>
              <Select name="parentId" defaultValue={category?.parentId || 'none'}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parent category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Parent (Root Category)</SelectItem>
                  {rootCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className="font-semibold">
                      {cat.name} (Level 0)
                    </SelectItem>
                  ))}
                  {subcategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className="pl-6">
                      {cat.name} (Level 1)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-500"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      const colorInput = document.getElementById('color') as HTMLInputElement
                      if (colorInput) colorInput.value = color
                    }}
                  />
                ))}
              </div>
              <Input
                id="color"
                name="color"
                type="color"
                defaultValue={category?.color || '#09B1BA'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Select name="icon" defaultValue={category?.icon || 'none'}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Icon</SelectItem>
                  {predefinedIcons.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      {icon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isEditing && (
            <div className="flex items-center space-x-2">
              <Switch 
                id="isActive" 
                name="isActive" 
                defaultChecked={category?.isActive}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
              <Input
                id="metaTitle"
                name="metaTitle"
                defaultValue={category?.metaTitle || ''}
                placeholder="SEO title for this category"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
              <Textarea
                id="metaDescription"
                name="metaDescription"
                defaultValue={category?.metaDescription || ''}
                placeholder="SEO description for this category"
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setOpen(false)
                if (onClose) onClose()
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? (isEditing ? 'Updating...' : 'Creating...') 
                : (isEditing ? 'Update Category' : 'Create Category')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
