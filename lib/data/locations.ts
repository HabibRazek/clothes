export interface Country {
  code: string
  name: string
  cities: string[]
}

export const countries: Country[] = [
  {
    code: 'FR',
    name: 'France',
    cities: [
      'Paris',
      'Marseille',
      'Lyon',
      'Toulouse',
      'Nice',
      'Nantes',
      'Montpellier',
      'Strasbourg',
      'Bordeaux',
      'Lille',
      'Rennes',
      'Reims',
      'Saint-Étienne',
      'Le Havre',
      'Toulon',
      'Grenoble',
      'Dijon',
      'Angers',
      'Nîmes',
      'Villeurbanne',
      'Clermont-Ferrand',
      'Le Mans',
      'Aix-en-Provence',
      'Brest',
      'Tours',
      'Amiens',
      'Limoges',
      'Annecy',
      'Perpignan',
      'Boulogne-Billancourt'
    ]
  },
  {
    code: 'BE',
    name: 'Belgique',
    cities: [
      'Bruxelles',
      'Anvers',
      'Gand',
      'Charleroi',
      'Liège',
      'Bruges',
      'Namur',
      'Louvain',
      'Mons',
      'Aalst',
      'Malines',
      'La Louvière',
      'Courtrai',
      'Hasselt',
      'Saint-Nicolas',
      'Ostende',
      'Tournai',
      'Genk',
      'Seraing',
      'Roulers'
    ]
  },
  {
    code: 'CH',
    name: 'Suisse',
    cities: [
      'Zurich',
      'Genève',
      'Bâle',
      'Lausanne',
      'Berne',
      'Winterthour',
      'Lucerne',
      'Saint-Gall',
      'Lugano',
      'Bienne',
      'Thoune',
      'Köniz',
      'La Chaux-de-Fonds',
      'Fribourg',
      'Schaffhouse',
      'Chur',
      'Neuchâtel',
      'Uster',
      'Sion',
      'Emmen'
    ]
  },
  {
    code: 'LU',
    name: 'Luxembourg',
    cities: [
      'Luxembourg',
      'Esch-sur-Alzette',
      'Differdange',
      'Dudelange',
      'Ettelbruck',
      'Diekirch',
      'Strassen',
      'Bertrange',
      'Bettembourg',
      'Schifflange',
      'Pétange',
      'Sanem',
      'Hesperange',
      'Sandweiler',
      'Echternach'
    ]
  },
  {
    code: 'MC',
    name: 'Monaco',
    cities: [
      'Monaco-Ville',
      'Monte-Carlo',
      'La Condamine',
      'Fontvieille'
    ]
  }
]

export const productSizes = {
  clothing: [
    'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
    '32', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54'
  ],
  shoes: [
    '35', '35.5', '36', '36.5', '37', '37.5', '38', '38.5', '39', '39.5',
    '40', '40.5', '41', '41.5', '42', '42.5', '43', '43.5', '44', '44.5',
    '45', '45.5', '46', '46.5', '47', '47.5', '48', '48.5', '49', '50'
  ],
  accessories: [
    'Unique', 'XS', 'S', 'M', 'L', 'XL'
  ]
}

export const productColors = [
  'Noir', 'Blanc', 'Gris', 'Beige', 'Marron', 'Rouge', 'Rose', 'Orange',
  'Jaune', 'Vert', 'Bleu', 'Violet', 'Multicolore', 'Doré', 'Argenté',
  'Bordeaux', 'Marine', 'Kaki', 'Camel', 'Crème', 'Écru', 'Nude'
]

export const productMaterials = [
  'Coton', 'Polyester', 'Laine', 'Soie', 'Lin', 'Cachemire', 'Viscose',
  'Élasthanne', 'Nylon', 'Acrylique', 'Cuir', 'Cuir synthétique',
  'Daim', 'Velours', 'Denim', 'Jersey', 'Satin', 'Dentelle', 'Fourrure',
  'Fourrure synthétique', 'Mohair', 'Alpaga', 'Bambou', 'Modal'
]

export const productStyles = [
  'Casual', 'Chic', 'Élégant', 'Sportif', 'Vintage', 'Bohème', 'Classique',
  'Moderne', 'Romantique', 'Rock', 'Preppy', 'Minimaliste', 'Glamour',
  'Décontracté', 'Formel', 'Streetwear', 'Boho', 'Grunge', 'Punk',
  'Gothique', 'Hippie', 'Rétro', 'Avant-garde'
]

export const productTags = [
  'Tendance', 'Nouveauté', 'Soldes', 'Vintage', 'Éco-responsable', 'Bio',
  'Fait main', 'Édition limitée', 'Designer', 'Luxe', 'Basique', 'Intemporel',
  'Confortable', 'Pratique', 'Élégant', 'Sexy', 'Mignon', 'Cool', 'Unique',
  'Rare', 'Collection', 'Authentique', 'Original', 'Exclusif'
]

export const productConditions = [
  { value: 'NEW_WITH_TAGS', label: 'Neuf avec étiquettes' },
  { value: 'NEW_WITHOUT_TAGS', label: 'Neuf sans étiquettes' },
  { value: 'VERY_GOOD', label: 'Très bon état' },
  { value: 'GOOD', label: 'Bon état' },
  { value: 'SATISFACTORY', label: 'État satisfaisant' }
]

export function getCitiesByCountry(countryCode: string): string[] {
  const country = countries.find(c => c.code === countryCode)
  return country ? country.cities : []
}

export function getCountryName(countryCode: string): string {
  const country = countries.find(c => c.code === countryCode)
  return country ? country.name : countryCode
}
