import localPlantsData from '../data/plants.json'

const PERENUAL_API_KEY = 'sk-w5cv6ac53333a8f8020155'
const BASE_URL = 'https://perenual.com/api'

// Asignador determinista de precios para productos comerciales
const calculatePrice = (id) => {
  const base = 12 + ((id * 7) % 28)
  const cents = [0.0, 0.5, 0.99][id % 3]
  return Number((base + cents).toFixed(2))
}

// Asignador de categorías botánicas
const assignCategory = (item) => {
  const name = (item.common_name || '').toLowerCase()
  const scientific = (item.scientific_name?.[0] || '').toLowerCase()
  const combined = `${name} ${scientific}`

  if (combined.includes('aloe') || combined.includes('aeonium') || combined.includes('cactus') || combined.includes('succulent')) {
    return { id: 'suculentas', es: 'Suculentas', en: 'Succulents' }
  }
  if (combined.includes('fern') || combined.includes('evergreen') || combined.includes('ear') || combined.includes('lily')) {
    return { id: 'purificadoras', es: 'Purificadoras', en: 'Air Purifying' }
  }
  return { id: 'interior', es: 'Interior', en: 'Indoor' }
}

const assignBadge = (index) => {
  if (index === 0 || index === 4) return 'bestseller'
  if (index === 1 || index === 6) return 'new'
  if (index === 2 || index === 8) return 'popular'
  return null
}

/**
 * Obtiene la lista de plantas desde la API de Perenual con fallback automático a plants.json
 */
export async function fetchPerenualPlants({ page = 1, indoor = 1 } = {}) {
  try {
    const url = `${BASE_URL}/species-list?key=${PERENUAL_API_KEY}&indoor=${indoor}&page=${page}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const json = await response.json()
    const rawList = json.data || []

    // Filtrar especies que no tienen imagen o que tienen marca de agua de "upgrade_access"
    const validSpecies = rawList.filter((item) => {
      const imgUrl = item.default_image?.regular_url || item.default_image?.original_url || ''
      return imgUrl && !imgUrl.includes('upgrade_access.jpg') && item.common_name
    })

    if (validSpecies.length === 0) {
      console.warn('Perenual API no devolvió imágenes válidas en esta página. Usando catálogo local.')
      return { source: 'local', plants: localPlantsData }
    }

    // Adaptar al formato requerido por la tienda
    const mappedPlants = validSpecies.map((item, index) => {
      const commonName = item.common_name.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())
      const scientificName = item.scientific_name?.[0] || ''
      const category = assignCategory(item)
      const price = calculatePrice(item.id)
      const image = item.default_image.regular_url || item.default_image.medium_url || item.default_image.original_url

      return {
        id: `perenual-${item.id}`,
        perenualId: item.id,
        name: {
          en: commonName,
          es: commonName, // Enriquecido con nombre botánico común
        },
        scientificName,
        category,
        price,
        badge: assignBadge(index),
        description: {
          en: `Botanical species: ${scientificName || commonName}. Ideal indoor ornamental plant with distinctive natural foliage.`,
          es: `Especie botánica: ${scientificName || commonName}. Planta ornamental ideal para interiores con distintivo follaje natural.`,
        },
        image,
        cycle: item.cycle,
        watering: item.watering,
        sunlight: item.sunlight,
      }
    })

    return { source: 'perenual', plants: mappedPlants }
  } catch (error) {
    console.warn('Error al conectar con Perenual API:', error.message, '- Usando catálogo local.')
    return { source: 'local', plants: localPlantsData }
  }
}

/**
 * Obtiene los detalles específicos de una especie (para la futura vista splitout)
 */
export async function fetchPlantDetails(speciesId) {
  try {
    const url = `${BASE_URL}/species/details/${speciesId}?key=${PERENUAL_API_KEY}`
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error('Error fetching plant details from Perenual:', error)
    return null
  }
}
