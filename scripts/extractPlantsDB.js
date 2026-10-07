import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PERENUAL_API_KEY = 'sk-w5cv6ac53333a8f8020155'
const BASE_URL = 'https://perenual.com/api'

// Rutas a archivos de datos
const plantsJsonPath = path.resolve(__dirname, '../src/data/plants.json')
const plantsDbJsonPath = path.resolve(__dirname, '../src/data/PlantsDB.json')

// Determinador de precios uniforme y realista
const calculatePrice = (id) => {
  const base = 12 + ((id * 7) % 28)
  const cents = [0.0, 0.5, 0.99][id % 3]
  return Number((base + cents).toFixed(2))
}

// Asignador inteligente de categoría según características botánicas
const assignCategory = (item) => {
  const name = (item.common_name || '').toLowerCase()
  const scientific = (item.scientific_name?.[0] || '').toLowerCase()
  const combined = `${name} ${scientific}`

  if (
    combined.includes('aloe') ||
    combined.includes('aeonium') ||
    combined.includes('cactus') ||
    combined.includes('succulent') ||
    combined.includes('sedum') ||
    combined.includes('crassula') ||
    combined.includes('echeveria')
  ) {
    return { id: 'suculentas', es: 'Suculentas', en: 'Succulents' }
  }

  if (
    combined.includes('lavender') ||
    combined.includes('rosemary') ||
    combined.includes('mint') ||
    combined.includes('basil') ||
    combined.includes('thyme') ||
    combined.includes('sage') ||
    combined.includes('herb')
  ) {
    return { id: 'aromaticas', es: 'Aromáticas', en: 'Aromatic' }
  }

  if (
    combined.includes('fern') ||
    combined.includes('evergreen') ||
    combined.includes('palm') ||
    combined.includes('spathiphyllum') ||
    combined.includes('snake') ||
    combined.includes('pothos') ||
    combined.includes('lily') ||
    combined.includes('ivy')
  ) {
    return { id: 'purificadoras', es: 'Purificadoras', en: 'Air Purifying' }
  }

  return { id: 'interior', es: 'Interior', en: 'Indoor' }
}

const assignBadge = (index) => {
  if (index % 7 === 0) return 'bestseller'
  if (index % 5 === 0) return 'new'
  if (index % 3 === 0) return 'popular'
  return null
}

async function extractPlants() {
  console.log('🌱 Iniciando extracción de base de datos botánica desde Perenual API...')

  // 1. Cargar las 24 plantas base esenciales que garantizan la rúbrica de Coursera
  let basePlants = []
  if (fs.existsSync(plantsJsonPath)) {
    const raw = fs.readFileSync(plantsJsonPath, 'utf8')
    basePlants = JSON.parse(raw)
    console.log(`📦 Se cargaron ${basePlants.length} plantas base curadas de plants.json`)
  }

  // Inicializar todas las plantas base con stock de 10 unidades
  const formattedBasePlants = basePlants.map((plant) => ({
    ...plant,
    stock: 10,
    initialStock: 10,
    apiSource: 'curated-local',
  }))

  const existingIds = new Set(formattedBasePlants.map((p) => p.id))
  const extractedPlants = []

  // 2. Extraer 3 páginas de Perenual API (solo 3 requests de la cuota diaria de 100)
  const pagesToFetch = [1, 2, 3]

  for (const page of pagesToFetch) {
    console.log(`📡 Consultando página ${page} de Perenual API (indoor=1)...`)
    try {
      const url = `${BASE_URL}/species-list?key=${PERENUAL_API_KEY}&indoor=1&page=${page}`
      const response = await fetch(url)
      if (!response.ok) {
        console.warn(`⚠️ Error HTTP ${response.status} en página ${page}`)
        continue
      }

      const json = await response.json()
      const speciesList = json.data || []

      for (let i = 0; i < speciesList.length; i++) {
        const item = speciesList[i]
        const imgUrl =
          item.default_image?.regular_url ||
          item.default_image?.medium_url ||
          item.default_image?.original_url ||
          ''

        // Filtrar items sin imagen o con imagen de restricción de pago ("upgrade_access.jpg")
        if (!imgUrl || imgUrl.includes('upgrade_access.jpg') || !item.common_name) {
          continue
        }

        const plantId = `perenual-${item.id}`
        if (existingIds.has(plantId)) continue
        existingIds.add(plantId)

        const commonName = item.common_name.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())
        const scientificName = item.scientific_name?.[0] || ''
        const category = assignCategory(item)
        const price = calculatePrice(item.id)

        extractedPlants.push({
          id: plantId,
          perenualId: item.id,
          name: {
            es: commonName,
            en: commonName,
          },
          scientificName,
          category,
          price,
          stock: 10, // Stock inicial requerido de 10 unidades
          initialStock: 10,
          badge: assignBadge(extractedPlants.length),
          description: {
            es: `Especie botánica ${scientificName || commonName}. Ideal para el hogar u oficina con un cuidado sencillo y follaje natural.`,
            en: `Botanical species ${scientificName || commonName}. Ideal indoor specimen with vibrant natural foliage and straightforward care.`,
          },
          image: imgUrl,
          cycle: item.cycle || 'Perennial',
          watering: item.watering || 'Average',
          sunlight: Array.isArray(item.sunlight) ? item.sunlight.join(', ') : item.sunlight || 'Indirect light',
          apiSource: 'perenual-api',
        })
      }
    } catch (err) {
      console.error(`❌ Error extrayendo página ${page}:`, err.message)
    }
  }

  console.log(`✨ Extraídas ${extractedPlants.length} plantas válidas desde Perenual API.`)

  // 3. Unir catálogo curado + plantas de API
  const fullCatalog = [...formattedBasePlants, ...extractedPlants]

  fs.writeFileSync(plantsDbJsonPath, JSON.stringify(fullCatalog, null, 2), 'utf8')
  console.log(
    `✅ Base de datos PlantsDB.json guardada exitosamente con ${fullCatalog.length} plantas en total.`,
  )
}

extractPlants()

