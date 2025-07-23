import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Categories data based on the image provided
const categoriesData = [
  {
    name: 'Vêtements',
    slug: 'vetements',
    description: 'Tous les vêtements pour femmes et hommes',
    icon: 'Shirt',
    color: '#09B1BA',
    level: 0,
    order: 1,
    children: [
      {
        name: 'Robes',
        slug: 'robes',
        description: 'Robes pour toutes occasions',
        level: 1,
        order: 1,
        children: [
          { name: 'Robes courtes', slug: 'robes-courtes', level: 2, order: 1 },
          { name: 'Robes longues', slug: 'robes-longues', level: 2, order: 2 },
          { name: 'Robes midi', slug: 'robes-midi', level: 2, order: 3 },
          { name: 'Robes de soirée', slug: 'robes-soiree', level: 2, order: 4 }
        ]
      },
      {
        name: 'Hauts & T-shirts',
        slug: 'hauts-tshirts',
        description: 'T-shirts, chemises, blouses et tops',
        level: 1,
        order: 2,
        children: [
          { name: 'T-shirts', slug: 'tshirts', level: 2, order: 1 },
          { name: 'Chemises', slug: 'chemises', level: 2, order: 2 },
          { name: 'Blouses', slug: 'blouses', level: 2, order: 3 },
          { name: 'Tops', slug: 'tops', level: 2, order: 4 },
          { name: 'Débardeurs', slug: 'debardeurs', level: 2, order: 5 }
        ]
      },
      {
        name: 'Pantalons',
        slug: 'pantalons',
        description: 'Pantalons, jeans et leggings',
        level: 1,
        order: 3,
        children: [
          { name: 'Jeans', slug: 'jeans', level: 2, order: 1 },
          { name: 'Pantalons classiques', slug: 'pantalons-classiques', level: 2, order: 2 },
          { name: 'Leggings', slug: 'leggings', level: 2, order: 3 },
          { name: 'Pantalons de sport', slug: 'pantalons-sport', level: 2, order: 4 }
        ]
      },
      {
        name: 'Jupes',
        slug: 'jupes',
        description: 'Jupes courtes, longues et midi',
        level: 1,
        order: 4,
        children: [
          { name: 'Jupes courtes', slug: 'jupes-courtes', level: 2, order: 1 },
          { name: 'Jupes longues', slug: 'jupes-longues', level: 2, order: 2 },
          { name: 'Jupes midi', slug: 'jupes-midi', level: 2, order: 3 }
        ]
      },
      {
        name: 'Shorts',
        slug: 'shorts',
        description: 'Shorts et bermudas',
        level: 1,
        order: 5,
        children: [
          { name: 'Shorts courts', slug: 'shorts-courts', level: 2, order: 1 },
          { name: 'Bermudas', slug: 'bermudas', level: 2, order: 2 },
          { name: 'Shorts de sport', slug: 'shorts-sport', level: 2, order: 3 }
        ]
      },
      {
        name: 'Blazers & Vestes',
        slug: 'blazers-vestes',
        description: 'Vestes, blazers et manteaux',
        level: 1,
        order: 6,
        children: [
          { name: 'Blazers', slug: 'blazers', level: 2, order: 1 },
          { name: 'Vestes', slug: 'vestes', level: 2, order: 2 },
          { name: 'Manteaux', slug: 'manteaux', level: 2, order: 3 },
          { name: 'Doudounes', slug: 'doudounes', level: 2, order: 4 }
        ]
      },
      {
        name: 'Pulls & Gilets',
        slug: 'pulls-gilets',
        description: 'Pulls, cardigans et gilets',
        level: 1,
        order: 7,
        children: [
          { name: 'Pulls', slug: 'pulls', level: 2, order: 1 },
          { name: 'Cardigans', slug: 'cardigans', level: 2, order: 2 },
          { name: 'Gilets', slug: 'gilets', level: 2, order: 3 },
          { name: 'Sweats', slug: 'sweats', level: 2, order: 4 }
        ]
      },
      {
        name: 'Lingerie',
        slug: 'lingerie',
        description: 'Sous-vêtements et lingerie',
        level: 1,
        order: 8,
        children: [
          { name: 'Soutiens-gorge', slug: 'soutiens-gorge', level: 2, order: 1 },
          { name: 'Culottes', slug: 'culottes', level: 2, order: 2 },
          { name: 'Ensembles', slug: 'ensembles-lingerie', level: 2, order: 3 },
          { name: 'Nuisettes', slug: 'nuisettes', level: 2, order: 4 }
        ]
      },
      {
        name: 'Pyjamas',
        slug: 'pyjamas',
        description: 'Pyjamas et vêtements de nuit',
        level: 1,
        order: 9,
        children: [
          { name: 'Pyjamas complets', slug: 'pyjamas-complets', level: 2, order: 1 },
          { name: 'Chemises de nuit', slug: 'chemises-nuit', level: 2, order: 2 },
          { name: 'Peignoirs', slug: 'peignoirs', level: 2, order: 3 }
        ]
      }
    ]
  },
  {
    name: 'Chaussures',
    slug: 'chaussures',
    description: 'Chaussures pour tous les styles',
    icon: 'Footprints',
    color: '#10B981',
    level: 0,
    order: 2,
    children: [
      {
        name: 'Baskets',
        slug: 'baskets',
        description: 'Baskets et sneakers',
        level: 1,
        order: 1,
        children: [
          { name: 'Baskets basses', slug: 'baskets-basses', level: 2, order: 1 },
          { name: 'Baskets montantes', slug: 'baskets-montantes', level: 2, order: 2 },
          { name: 'Sneakers', slug: 'sneakers', level: 2, order: 3 }
        ]
      },
      {
        name: 'Sandales',
        slug: 'sandales',
        description: 'Sandales et nu-pieds',
        level: 1,
        order: 2,
        children: [
          { name: 'Sandales plates', slug: 'sandales-plates', level: 2, order: 1 },
          { name: 'Sandales à talons', slug: 'sandales-talons', level: 2, order: 2 },
          { name: 'Nu-pieds', slug: 'nu-pieds', level: 2, order: 3 }
        ]
      },
      {
        name: 'Escarpins',
        slug: 'escarpins',
        description: 'Escarpins et chaussures à talons',
        level: 1,
        order: 3,
        children: [
          { name: 'Escarpins classiques', slug: 'escarpins-classiques', level: 2, order: 1 },
          { name: 'Escarpins ouverts', slug: 'escarpins-ouverts', level: 2, order: 2 },
          { name: 'Chaussures à talons', slug: 'chaussures-talons', level: 2, order: 3 }
        ]
      },
      {
        name: 'Bottes',
        slug: 'bottes',
        description: 'Bottes et bottines',
        level: 1,
        order: 4,
        children: [
          { name: 'Bottines', slug: 'bottines', level: 2, order: 1 },
          { name: 'Bottes hautes', slug: 'bottes-hautes', level: 2, order: 2 },
          { name: 'Bottes de pluie', slug: 'bottes-pluie', level: 2, order: 3 }
        ]
      },
      {
        name: 'Ballerines',
        slug: 'ballerines',
        description: 'Ballerines et chaussures plates',
        level: 1,
        order: 5,
        children: [
          { name: 'Ballerines classiques', slug: 'ballerines-classiques', level: 2, order: 1 },
          { name: 'Ballerines pointues', slug: 'ballerines-pointues', level: 2, order: 2 },
          { name: 'Chaussures plates', slug: 'chaussures-plates', level: 2, order: 3 }
        ]
      },
      {
        name: 'Chaussures de sport',
        slug: 'chaussures-sport',
        description: 'Chaussures de sport et running',
        level: 1,
        order: 6,
        children: [
          { name: 'Running', slug: 'running', level: 2, order: 1 },
          { name: 'Fitness', slug: 'fitness', level: 2, order: 2 },
          { name: 'Tennis', slug: 'tennis', level: 2, order: 3 }
        ]
      },
      {
        name: 'Tongs',
        slug: 'tongs',
        description: 'Tongs et claquettes',
        level: 1,
        order: 7,
        children: [
          { name: 'Tongs classiques', slug: 'tongs-classiques', level: 2, order: 1 },
          { name: 'Claquettes', slug: 'claquettes', level: 2, order: 2 }
        ]
      },
      {
        name: 'Mocassins',
        slug: 'mocassins',
        description: 'Mocassins et chaussures de ville',
        level: 1,
        order: 8,
        children: [
          { name: 'Mocassins classiques', slug: 'mocassins-classiques', level: 2, order: 1 },
          { name: 'Chaussures de ville', slug: 'chaussures-ville', level: 2, order: 2 },
          { name: 'Derbies', slug: 'derbies', level: 2, order: 3 }
        ]
      }
    ]
  },
  {
    name: 'Sacs & Accessoires',
    slug: 'sacs-accessoires',
    description: 'Sacs, bijoux et accessoires de mode',
    icon: 'ShoppingBag',
    color: '#8B5CF6',
    level: 0,
    order: 3,
    children: [
      {
        name: 'Sacs à main',
        slug: 'sacs-main',
        description: 'Sacs à main et pochettes',
        level: 1,
        order: 1
      },
      {
        name: 'Sacs à dos',
        slug: 'sacs-dos',
        description: 'Sacs à dos et cartables',
        level: 1,
        order: 2
      },
      {
        name: 'Portefeuille',
        slug: 'portefeuille',
        description: 'Portefeuilles et porte-monnaie',
        level: 1,
        order: 3
      },
      {
        name: 'Portefeuilles',
        slug: 'portefeuilles',
        description: 'Portefeuilles et maroquinerie',
        level: 1,
        order: 4
      },
      {
        name: 'Bijoux',
        slug: 'bijoux',
        description: 'Bijoux et montres',
        level: 1,
        order: 5
      },
      {
        name: 'Montres',
        slug: 'montres',
        description: 'Montres et horlogerie',
        level: 1,
        order: 6
      },
      {
        name: 'Lunettes',
        slug: 'lunettes',
        description: 'Lunettes de soleil et de vue',
        level: 1,
        order: 7
      },
      {
        name: 'Écharpes',
        slug: 'echarpes',
        description: 'Écharpes, foulards et châles',
        level: 1,
        order: 8
      },
      {
        name: 'Ceintures',
        slug: 'ceintures',
        description: 'Ceintures et accessoires',
        level: 1,
        order: 9
      }
    ]
  },
  {
    name: 'Beauté',
    slug: 'beaute',
    description: 'Produits de beauté et cosmétiques',
    icon: 'Sparkles',
    color: '#F59E0B',
    level: 0,
    order: 4,
    children: [
      {
        name: 'Maquillage',
        slug: 'maquillage',
        description: 'Maquillage et cosmétiques',
        level: 1,
        order: 1
      },
      {
        name: 'Parfums',
        slug: 'parfums',
        description: 'Parfums et eaux de toilette',
        level: 1,
        order: 2
      },
      {
        name: 'Soins visage',
        slug: 'soins-visage',
        description: 'Soins du visage et anti-âge',
        level: 1,
        order: 3
      },
      {
        name: 'Soins corps',
        slug: 'soins-corps',
        description: 'Soins du corps et hydratation',
        level: 1,
        order: 4
      },
      {
        name: 'Cheveux',
        slug: 'cheveux',
        description: 'Soins capillaires et coiffure',
        level: 1,
        order: 5
      },
      {
        name: 'Vernis à ongles',
        slug: 'vernis-ongles',
        description: 'Vernis et soins des ongles',
        level: 1,
        order: 6
      },
      {
        name: 'Accessoires beauté',
        slug: 'accessoires-beaute',
        description: 'Pinceaux, éponges et accessoires',
        level: 1,
        order: 7
      }
    ]
  }
]

async function seedCategories() {
  console.log('🌱 Starting category seeding...')

  try {
    // Clear existing categories
    await prisma.category.deleteMany({})
    console.log('🗑️  Cleared existing categories')

    // Create main categories and their subcategories
    for (const categoryData of categoriesData) {
      const { children, ...mainCategoryData } = categoryData

      // Create main category
      const mainCategory = await prisma.category.create({
        data: mainCategoryData
      })

      console.log(`✅ Created main category: ${mainCategory.name}`)

      // Create subcategories
      if (children && children.length > 0) {
        for (const childData of children) {
          const { children: subChildren, ...subcategoryData } = childData

          const subcategory = await prisma.category.create({
            data: {
              ...subcategoryData,
              parentId: mainCategory.id
            }
          })
          console.log(`  ✅ Created subcategory: ${subcategory.name}`)

          // Create sub-subcategories if they exist
          if (subChildren && subChildren.length > 0) {
            for (const subChildData of subChildren) {
              const subSubcategory = await prisma.category.create({
                data: {
                  ...subChildData,
                  parentId: subcategory.id,
                  level: 2
                }
              })
              console.log(`    ✅ Created sub-subcategory: ${subSubcategory.name}`)
            }
          }
        }
      }
    }

    console.log('🎉 Category seeding completed successfully!')

  } catch (error) {
    console.error('❌ Error seeding categories:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeding
if (require.main === module) {
  seedCategories()
    .then(() => {
      console.log('✨ Categories seeded successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Category seeding failed:', error)
      process.exit(1)
    })
}

export { seedCategories }
