'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  FolderTree,
  Package
} from 'lucide-react'
import { deleteCategory, toggleCategoryStatus } from '@/lib/actions/categories'
import { CategoryForm } from './category-form'
import { CategoryWithRelations as Category } from '@/lib/types/category'

interface CategoryManagementTableProps {
  categories: Category[]
}

export function CategoryManagementTable({ categories }: CategoryManagementTableProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return
    }

    setIsDeleting(categoryId)
    try {
      const result = await deleteCategory(categoryId)
      if (!result.success) {
        alert(result.error || 'Failed to delete category')
      }
    } catch (error) {
      alert('Failed to delete category')
    } finally {
      setIsDeleting(null)
    }
  }

  const handleToggleStatus = async (categoryId: string) => {
    try {
      const result = await toggleCategoryStatus(categoryId)
      if (!result.success) {
        alert(result.error || 'Failed to toggle category status')
      }
    } catch (error) {
      alert('Failed to toggle category status')
    }
  }

  const getIndentation = (level: number) => {
    return level * 20 // 20px per level
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Order</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <div 
                  className="flex items-center space-x-3"
                  style={{ paddingLeft: `${getIndentation(category.level)}px` }}
                >
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: category.color || '#09B1BA' }}
                  >
                    {category.level === 0 ? (
                      <FolderTree className="w-4 h-4 text-white" />
                    ) : (
                      <Package className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{category.name}</div>
                    <div className="text-sm text-gray-500">{category.slug}</div>
                    {category.parent && (
                      <div className="text-xs text-gray-400">
                        Parent: {category.parent.name}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  Level {category.level}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{category._count?.products || 0} products</div>
                  {(category._count?.children || 0) > 0 && (
                    <div className="text-gray-500">
                      {category._count?.children || 0} subcategories
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={category.isActive ? "default" : "secondary"}>
                  {category.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">{category.order}</span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingCategory(category)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleStatus(category.id)}>
                      {category.isActive ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(category.id)}
                      disabled={isDeleting === category.id || (category._count?.products || 0) > 0 || (category._count?.children || 0) > 0}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isDeleting === category.id ? 'Deleting...' : 'Delete'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Category Modal */}
      {editingCategory && (
        <CategoryForm 
          category={editingCategory} 
          onClose={() => setEditingCategory(null)}
          allCategories={categories}
        />
      )}
    </div>
  )
}
