'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getCurrentUser } from './auth'

// Helper function to require admin access
async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Admin access required')
  }
  return user
}

// Get all categories with hierarchy
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        children: {
          orderBy: { order: 'asc' }
        },
        parent: true,
        _count: {
          select: {
            products: true,
            children: true
          }
        }
      },
      orderBy: [
        { level: 'asc' },
        { order: 'asc' }
      ]
    })

    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to fetch categories')
  }
}

// Get category by ID
export async function getCategoryById(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        children: {
          orderBy: { order: 'asc' }
        },
        parent: true,
        _count: {
          select: {
            products: true,
            children: true
          }
        }
      }
    })

    return category
  } catch (error) {
    console.error('Error fetching category:', error)
    throw new Error('Failed to fetch category')
  }
}

// Get root categories (level 0) with nested children
export async function getRootCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        level: 0,
        isActive: true
      },
      include: {
        children: {
          where: { isActive: true },
          include: {
            children: {
              where: { isActive: true },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            products: true,
            children: true
          }
        }
      },
      orderBy: { order: 'asc' }
    })

    return categories
  } catch (error) {
    console.error('Error fetching root categories:', error)
    throw new Error('Failed to fetch root categories')
  }
}

// Create category
export async function createCategory(formData: FormData) {
  await requireAdmin()

  try {
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const description = formData.get('description') as string
    const parentIdRaw = formData.get('parentId') as string
    const parentId = parentIdRaw === 'none' || !parentIdRaw ? null : parentIdRaw
    const iconRaw = formData.get('icon') as string
    const icon = iconRaw === 'none' || !iconRaw ? null : iconRaw
    const color = formData.get('color') as string || null
    const order = parseInt(formData.get('order') as string) || 0
    const metaTitle = formData.get('metaTitle') as string || null
    const metaDescription = formData.get('metaDescription') as string || null

    // Determine level based on parent
    let level = 0
    if (parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: parentId }
      })
      if (parent) {
        level = parent.level + 1
      }
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        parentId,
        icon,
        color,
        order,
        level,
        metaTitle,
        metaDescription,
        isActive: true
      }
    })

    revalidatePath('/admin/categories')
    return { success: true, category }
  } catch (error) {
    console.error('Error creating category:', error)
    return { success: false, error: 'Failed to create category' }
  }
}

// Update category
export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin()

  try {
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const description = formData.get('description') as string
    const parentIdRaw = formData.get('parentId') as string
    const parentId = parentIdRaw === 'none' || !parentIdRaw ? null : parentIdRaw
    const iconRaw = formData.get('icon') as string
    const icon = iconRaw === 'none' || !iconRaw ? null : iconRaw
    const color = formData.get('color') as string || null
    const order = parseInt(formData.get('order') as string) || 0
    const isActive = formData.get('isActive') === 'true'
    const metaTitle = formData.get('metaTitle') as string || null
    const metaDescription = formData.get('metaDescription') as string || null

    // Determine level based on parent
    let level = 0
    if (parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: parentId }
      })
      if (parent) {
        level = parent.level + 1
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || null,
        parentId,
        icon,
        color,
        order,
        level,
        isActive,
        metaTitle,
        metaDescription
      }
    })

    revalidatePath('/admin/categories')
    return { success: true, category }
  } catch (error) {
    console.error('Error updating category:', error)
    return { success: false, error: 'Failed to update category' }
  }
}

// Delete category
export async function deleteCategory(id: string) {
  await requireAdmin()

  try {
    // Check if category has children or products
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    if (!category) {
      return { success: false, error: 'Category not found' }
    }

    if (category.children.length > 0) {
      return { success: false, error: 'Cannot delete category with subcategories' }
    }

    if (category._count.products > 0) {
      return { success: false, error: 'Cannot delete category with products' }
    }

    await prisma.category.delete({
      where: { id }
    })

    revalidatePath('/admin/categories')
    return { success: true }
  } catch (error) {
    console.error('Error deleting category:', error)
    return { success: false, error: 'Failed to delete category' }
  }
}

// Toggle category active status
export async function toggleCategoryStatus(id: string) {
  await requireAdmin()

  try {
    const category = await prisma.category.findUnique({
      where: { id }
    })

    if (!category) {
      return { success: false, error: 'Category not found' }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        isActive: !category.isActive
      }
    })

    revalidatePath('/admin/categories')
    return { success: true, category: updatedCategory }
  } catch (error) {
    console.error('Error toggling category status:', error)
    return { success: false, error: 'Failed to toggle category status' }
  }
}

// Delete all categories (admin only)
export async function deleteAllCategories() {
  await requireAdmin()

  try {
    // First, delete all products to avoid foreign key constraints
    await prisma.product.deleteMany({})

    // Then delete all categories (this will cascade delete subcategories)
    await prisma.category.deleteMany({})

    revalidatePath('/admin/categories')
    revalidatePath('/admin/categories-standalone')
    return { success: true, message: 'All categories and products deleted successfully' }
  } catch (error) {
    console.error('Error deleting all categories:', error)
    return { success: false, error: 'Failed to delete all categories' }
  }
}

// Seed specific categories for clothing marketplace
export async function seedClothingCategories() {
  await requireAdmin()

  try {
    // Delete existing categories first
    await prisma.product.deleteMany({})
    await prisma.category.deleteMany({})

    // Create main categories
    const vetements = await prisma.category.create({
      data: {
        name: 'Vêtements',
        slug: 'vetements',
        description: 'Tous les vêtements pour hommes, femmes et enfants',
        level: 0,
        order: 1,
        isActive: true,
        color: '#09B1BA',
        icon: 'Shirt'
      }
    })

    const chaussures = await prisma.category.create({
      data: {
        name: 'Chaussures',
        slug: 'chaussures',
        description: 'Chaussures pour tous les styles et occasions',
        level: 0,
        order: 2,
        isActive: true,
        color: '#10B981',
        icon: 'Footprints'
      }
    })

    const sacs = await prisma.category.create({
      data: {
        name: 'Sacs & Accessoires',
        slug: 'sacs-accessoires',
        description: 'Sacs, bijoux et accessoires de mode',
        level: 0,
        order: 3,
        isActive: true,
        color: '#8B5CF6',
        icon: 'ShoppingBag'
      }
    })

    const beaute = await prisma.category.create({
      data: {
        name: 'Beauté',
        slug: 'beaute',
        description: 'Produits de beauté et cosmétiques',
        level: 0,
        order: 4,
        isActive: true,
        color: '#EC4899',
        icon: 'Sparkles'
      }
    })

    // Create subcategories for Vêtements
    const vetementsFemmes = await prisma.category.create({
      data: {
        name: 'Femmes',
        slug: 'vetements-femmes',
        description: 'Vêtements pour femmes',
        parentId: vetements.id,
        level: 1,
        order: 1,
        isActive: true,
        color: '#F59E0B'
      }
    })

    const vetementsHommes = await prisma.category.create({
      data: {
        name: 'Hommes',
        slug: 'vetements-hommes',
        description: 'Vêtements pour hommes',
        parentId: vetements.id,
        level: 1,
        order: 2,
        isActive: true,
        color: '#3B82F6'
      }
    })

    const vetementsEnfants = await prisma.category.create({
      data: {
        name: 'Enfants',
        slug: 'vetements-enfants',
        description: 'Vêtements pour enfants',
        parentId: vetements.id,
        level: 1,
        order: 3,
        isActive: true,
        color: '#6366F1'
      }
    })

    // Create subcategories for Chaussures
    await prisma.category.create({
      data: {
        name: 'Femmes',
        slug: 'chaussures-femmes',
        description: 'Chaussures pour femmes',
        parentId: chaussures.id,
        level: 1,
        order: 1,
        isActive: true,
        color: '#F59E0B'
      }
    })

    await prisma.category.create({
      data: {
        name: 'Hommes',
        slug: 'chaussures-hommes',
        description: 'Chaussures pour hommes',
        parentId: chaussures.id,
        level: 1,
        order: 2,
        isActive: true,
        color: '#3B82F6'
      }
    })

    await prisma.category.create({
      data: {
        name: 'Enfants',
        slug: 'chaussures-enfants',
        description: 'Chaussures pour enfants',
        parentId: chaussures.id,
        level: 1,
        order: 3,
        isActive: true,
        color: '#6366F1'
      }
    })

    // Create subcategories for Sacs & Accessoires
    await prisma.category.create({
      data: {
        name: 'Sacs à main',
        slug: 'sacs-main',
        description: 'Sacs à main et pochettes',
        parentId: sacs.id,
        level: 1,
        order: 1,
        isActive: true,
        color: '#EF4444'
      }
    })

    await prisma.category.create({
      data: {
        name: 'Bijoux',
        slug: 'bijoux',
        description: 'Bijoux et montres',
        parentId: sacs.id,
        level: 1,
        order: 2,
        isActive: true,
        color: '#F59E0B'
      }
    })

    await prisma.category.create({
      data: {
        name: 'Accessoires',
        slug: 'accessoires',
        description: 'Écharpes, ceintures et autres accessoires',
        parentId: sacs.id,
        level: 1,
        order: 3,
        isActive: true,
        color: '#10B981'
      }
    })

    // Create subcategories for Beauté
    await prisma.category.create({
      data: {
        name: 'Maquillage',
        slug: 'maquillage',
        description: 'Produits de maquillage',
        parentId: beaute.id,
        level: 1,
        order: 1,
        isActive: true,
        color: '#EC4899'
      }
    })

    await prisma.category.create({
      data: {
        name: 'Soins',
        slug: 'soins',
        description: 'Soins du visage et du corps',
        parentId: beaute.id,
        level: 1,
        order: 2,
        isActive: true,
        color: '#8B5CF6'
      }
    })

    await prisma.category.create({
      data: {
        name: 'Parfums',
        slug: 'parfums',
        description: 'Parfums et eaux de toilette',
        parentId: beaute.id,
        level: 1,
        order: 3,
        isActive: true,
        color: '#F59E0B'
      }
    })

    revalidatePath('/admin/categories')
    revalidatePath('/admin/categories-standalone')
    return { success: true, message: 'Clothing categories seeded successfully' }
  } catch (error) {
    console.error('Error seeding categories:', error)
    return { success: false, error: 'Failed to seed categories' }
  }
}
