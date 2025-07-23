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
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { createProduct, updateProduct } from '@/lib/actions/products'
import { useRouter } from 'next/navigation'
import {
  countries,
  getCitiesByCountry,
  productSizes,
  productColors,
  productMaterials,
  productStyles,
  productTags,
  productConditions
} from '@/lib/data/locations'

interface Category {
  id: string
  name: string
  slug: string
  children: Category[]
}

interface Product {
  id: string
  title: string
  description: string
  price: number
  originalPrice: number | null
  categoryId: string
  condition: string
  size: string | null
  brand: string | null
  color: string | null
  material: string | null
  gender: string | null
  season: string | null
  style: string | null
  location: string | null
  country: string | null
  shippingCost: number | null
  canDeliver: boolean
  canPickup: boolean
  tags: string[]
  weight: number | null
  measurements: string | null
}

interface ProductFormProps {
  categories: Category[]
  product?: Product
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(product?.categoryId || '')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(product?.country || 'FR')
  const [selectedTags, setSelectedTags] = useState<string[]>(product?.tags || [])
  const router = useRouter()

  const isEditing = !!product

  // Get subcategories for selected main category
  const selectedMainCategory = categories.find(cat => 
    cat.id === selectedCategory || cat.children.some(child => child.id === selectedCategory)
  )
  const subcategories = selectedMainCategory?.children || []

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    
    try {
      let result
      if (isEditing && product) {
        result = await updateProduct(product.id, formData)
      } else {
        result = await createProduct(formData)
      }
      
      if (result.success) {
        router.push('/dashboard/products')
      } else {
        console.error('Product save error:', result.error)
        alert(result.error || 'Failed to save product')
      }
    } catch (error) {
      console.error('Product save error:', error)
      alert(error instanceof Error ? error.message : 'Failed to save product')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get available cities for selected country
  const availableCities = getCitiesByCountry(selectedCountry)

  // Handle tag selection
  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag))
  }

  // Get appropriate sizes based on category
  const getSizesForCategory = (categoryName: string) => {
    if (categoryName.toLowerCase().includes('chaussure') || categoryName.toLowerCase().includes('shoe')) {
      return productSizes.shoes
    } else if (categoryName.toLowerCase().includes('accessoire') || categoryName.toLowerCase().includes('sac')) {
      return productSizes.accessories
    } else {
      return productSizes.clothing
    }
  }

  const selectedCategoryName = categories.find(c => c.id === selectedCategory)?.name || ''
  const availableSizes = getSizesForCategory(selectedCategoryName)

  const genderOptions = [
    { value: 'WOMEN', label: 'Women' },
    { value: 'MEN', label: 'Men' },
    { value: 'UNISEX', label: 'Unisex' },
    { value: 'KIDS_GIRLS', label: 'Girls' },
    { value: 'KIDS_BOYS', label: 'Boys' },
    { value: 'BABY', label: 'Baby' }
  ]

  const seasonOptions = [
    { value: 'SPRING', label: 'Spring' },
    { value: 'SUMMER', label: 'Summer' },
    { value: 'FALL', label: 'Fall' },
    { value: 'WINTER', label: 'Winter' },
    { value: 'ALL_SEASON', label: 'All Season' }
  ]

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Product Title *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={product?.title || ''}
              placeholder="e.g., Pull en laine mérinos COS"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              name="brand"
              defaultValue={product?.brand || ''}
              placeholder="e.g., COS, Zara, H&M"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={product?.description || ''}
            placeholder="Describe your item in detail..."
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="categoryId">Main Category *</Label>
            <Select 
              name="categoryId" 
              defaultValue={product?.categoryId || ''}
              onValueChange={(value) => {
                const mainCat = categories.find(cat => cat.id === value)
                if (mainCat) {
                  setSelectedCategory(value)
                  setSelectedSubcategory('')
                } else {
                  // It's a subcategory
                  const parentCat = categories.find(cat => 
                    cat.children.some(child => child.id === value)
                  )
                  if (parentCat) {
                    setSelectedCategory(parentCat.id)
                    setSelectedSubcategory(value)
                  }
                }
              }}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <React.Fragment key={category.id}>
                    <SelectItem value={category.id} className="font-semibold">
                      {category.name}
                    </SelectItem>
                    {category.children.map((subcategory) => (
                      <React.Fragment key={subcategory.id}>
                        <SelectItem value={subcategory.id} className="pl-6 font-medium">
                          {subcategory.name}
                        </SelectItem>
                        {subcategory.children && subcategory.children.map((subSubcategory) => (
                          <SelectItem key={subSubcategory.id} value={subSubcategory.id} className="pl-12 text-sm">
                            {subSubcategory.name}
                          </SelectItem>
                        ))}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Condition *</Label>
            <Select name="condition" defaultValue={product?.condition || ''} required>
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {productConditions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
          <CardDescription>Set your product pricing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Selling Price (€) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product?.price || ''}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price (€)</Label>
              <Input
                id="originalPrice"
                name="originalPrice"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product?.originalPrice || ''}
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500">
                Show the original retail price to highlight savings
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Details */}
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Additional product information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Select name="size" defaultValue={product?.size || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {availableSizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Select name="color" defaultValue={product?.color || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {productColors.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              <Select name="material" defaultValue={product?.material || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {productMaterials.map((material) => (
                    <SelectItem key={material} value={material}>
                      {material}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select name="gender" defaultValue={product?.gender || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="season">Season</Label>
              <Select name="season" defaultValue={product?.season || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  {seasonOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="style">Style</Label>
              <Select name="style" defaultValue={product?.style || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {productStyles.map((style) => (
                    <SelectItem key={style} value={style}>
                      {style}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product?.weight || ''}
                placeholder="0.5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="measurements">Measurements</Label>
            <Input
              id="measurements"
              name="measurements"
              defaultValue={product?.measurements || ''}
              placeholder="e.g., Length: 60cm, Chest: 50cm, Sleeve: 25cm"
            />
            <p className="text-xs text-gray-500">
              Provide detailed measurements to help buyers
            </p>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {productTags.filter(tag => !selectedTags.includes(tag)).map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addTag(tag)}
                    className="text-xs"
                  >
                    + {tag}
                  </Button>
                ))}
              </div>
            </div>
            <input type="hidden" name="tags" value={selectedTags.join(',')} />
          </div>
        </CardContent>
      </Card>

      {/* Shipping & Delivery */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping & Delivery</CardTitle>
          <CardDescription>Set your delivery options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Select
                name="country"
                defaultValue={product?.country || 'FR'}
                onValueChange={setSelectedCountry}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">City *</Label>
              <Select name="location" defaultValue={product?.location || ''} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {availableCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shippingCost">Shipping Cost (€)</Label>
              <Input
                id="shippingCost"
                name="shippingCost"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product?.shippingCost || ''}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="canDeliver" 
                name="canDeliver" 
                defaultChecked={product?.canDeliver ?? true}
              />
              <Label htmlFor="canDeliver">Offer delivery/shipping</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="canPickup" 
                name="canPickup" 
                defaultChecked={product?.canPickup ?? false}
              />
              <Label htmlFor="canPickup">Allow local pickup</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4 pt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-[#09B1BA] hover:bg-[#078A91]"
        >
          {isSubmitting 
            ? (isEditing ? 'Updating...' : 'Creating...') 
            : (isEditing ? 'Update Product' : 'Create Product')
          }
        </Button>
      </div>
    </form>
  )
}
