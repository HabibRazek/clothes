import { Prisma } from '@prisma/client'

// Shared Category type that matches exactly what getCategories returns
export type CategoryWithRelations = Prisma.CategoryGetPayload<{
  include: {
    children: true
    parent: true
    _count: {
      select: {
        products: true
        children: true
      }
    }
  }
}>

// Simple Category type for basic usage
export type CategoryBasic = Prisma.CategoryGetPayload<{
  select: {
    id: true
    name: true
    slug: true
  }
}>

// Category with children for hierarchical display
export type CategoryWithChildren = Prisma.CategoryGetPayload<{
  include: {
    children: {
      include: {
        children: true
      }
    }
  }
}>
