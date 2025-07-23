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
  Heart,
  TrendingUp
} from 'lucide-react'
import { deleteProduct, toggleProductStatus } from '@/lib/actions/products'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  title: string
  description: string
  price: number
  originalPrice: number | null
  condition: string
  status: string
  views: number
  likes: number
  createdAt: string
  category: {
    name: string
  }
  images: Array<{
    url: string
    altText: string | null
  }>
  _count: {
    reviews: number
    favorites: number
  }
}

interface ProductManagementTableProps {
  products: Product[]
}

export function ProductManagementTable({ products }: ProductManagementTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    setIsDeleting(productId)
    try {
      const result = await deleteProduct(productId)
      if (!result.success) {
        alert(result.error || 'Failed to delete product')
      }
    } catch (error) {
      alert('Failed to delete product')
    } finally {
      setIsDeleting(null)
    }
  }

  const handleToggleStatus = async (productId: string) => {
    try {
      const result = await toggleProductStatus(productId)
      if (!result.success) {
        alert(result.error || 'Failed to toggle product status')
      }
    } catch (error) {
      alert('Failed to toggle product status')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Active</Badge>
      case 'PENDING_APPROVAL':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>
      case 'INACTIVE':
        return <Badge variant="secondary">Inactive</Badge>
      case 'SOLD':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Sold</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getConditionBadge = (condition: string) => {
    const conditionColors = {
      'NEW': 'bg-green-100 text-green-700 border-green-200',
      'LIKE_NEW': 'bg-blue-100 text-blue-700 border-blue-200',
      'GOOD': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'FAIR': 'bg-orange-100 text-orange-700 border-orange-200',
      'POOR': 'bg-red-100 text-red-700 border-red-200'
    }
    
    return (
      <Badge className={conditionColors[condition as keyof typeof conditionColors] || 'bg-gray-100 text-gray-700'}>
        {condition.replace('_', ' ')}
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Performance</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {product.images.length > 0 ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.images[0].altText || product.title}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 line-clamp-1">{product.title}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                    <div className="text-xs text-gray-400">
                      Created {new Date(product.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{product.category.name}</Badge>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-semibold text-[#09B1BA]">€{product.price}</div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="text-xs text-gray-500 line-through">
                      €{product.originalPrice}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {getConditionBadge(product.condition)}
              </TableCell>
              <TableCell>
                {getStatusBadge(product.status)}
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <Eye className="h-3 w-3 mr-1" />
                    {product.views} views
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Heart className="h-3 w-3 mr-1" />
                    {product.likes} likes
                  </div>
                  {product._count.reviews > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {product._count.reviews} reviews
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/products/${product.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleStatus(product.id)}>
                      {product.status === 'ACTIVE' ? (
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
                    <DropdownMenuItem asChild>
                      <Link href={`/products/${product.id}`} target="_blank">
                        <Eye className="h-4 w-4 mr-2" />
                        View Public
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(product.id)}
                      disabled={isDeleting === product.id}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isDeleting === product.id ? 'Deleting...' : 'Delete'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
