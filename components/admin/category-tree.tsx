'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ChevronDown, 
  ChevronRight, 
  FolderTree, 
  Package, 
  Plus,
  Edit,
  Eye,
  EyeOff
} from 'lucide-react'
import { CategoryForm } from './category-form'
import { toggleCategoryStatus } from '@/lib/actions/categories'

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
  _count?: {
    products: number
    children: number
  }
}

interface CategoryTreeProps {
  categories: Category[]
}

interface CategoryNodeProps {
  category: Category
  allCategories: Category[]
  level?: number
}

function CategoryNode({ category, allCategories, level = 0 }: CategoryNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2) // Auto-expand first 2 levels
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const hasChildren = category.children && category.children.length > 0
  const indentClass = level === 0 ? '' : level === 1 ? 'ml-6' : 'ml-12'

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

  return (
    <div className={`${indentClass} border-l-2 border-gray-100 pl-4 py-2`}>
      <div className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3">
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 h-6 w-6"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: category.color || '#09B1BA' }}
          >
            {level === 0 ? (
              <FolderTree className="w-4 h-4 text-white" />
            ) : (
              <Package className="w-4 h-4 text-white" />
            )}
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <span className={`font-medium ${level === 0 ? 'text-lg' : level === 1 ? 'text-base' : 'text-sm'}`}>
                {category.name}
              </span>
              <Badge variant="outline" className="text-xs">
                Level {category.level}
              </Badge>
              <Badge variant={category.isActive ? "default" : "secondary"} className="text-xs">
                {category.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="text-sm text-gray-500">
              {category.description || 'No description'}
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
              <span>{category._count?.products || 0} products</span>
              {hasChildren && <span>{category.children.length} subcategories</span>}
              <span>Order: {category.order}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingCategory(category)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleStatus(category.id)}
            className="h-8 w-8 p-0"
          >
            {category.isActive ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>

          <CategoryForm 
            allCategories={allCategories}
            trigger={
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      </div>

      {/* Render children */}
      {hasChildren && isExpanded && (
        <div className="mt-2 space-y-1">
          {category.children.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              allCategories={allCategories}
              level={level + 1}
            />
          ))}
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <CategoryForm 
          category={editingCategory} 
          onClose={() => setEditingCategory(null)}
          allCategories={allCategories}
        />
      )}
    </div>
  )
}

export function CategoryTree({ categories }: CategoryTreeProps) {
  const rootCategories = categories.filter(cat => cat.level === 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderTree className="h-5 w-5 text-[#09B1BA]" />
          Category Hierarchy
        </CardTitle>
        <CardDescription>
          Visual representation of your category structure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rootCategories.map((category) => (
            <CategoryNode
              key={category.id}
              category={category}
              allCategories={categories}
              level={0}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
