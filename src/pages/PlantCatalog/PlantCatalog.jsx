import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import localPlantsData from '../../data/plants.json'
import { fetchPerenualPlants } from '../../services/perenualApi'
import './PlantCatalog.css'

function PlantCatalog({ cart, onAddToCart }) {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language.startsWith('es') ? 'es' : 'en'

  // Lista de plantas con conexión a la API de Perenual y fallback a plants.json
  const [plantsList, setPlantsList] = useState(localPlantsData)
  const [dataSource, setDataSource] = useState('local') // 'local' | 'perenual'
  const [isLoading, setIsLoading] = useState(false)

  // Estados de filtrado y ordenamiento
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPriceRange, setSelectedPriceRange] = useState('all') // 'all' | 'under15' | '15to25' | 'over25'
  const [sortBy, setSortBy] = useState('featured') // 'featured' | 'priceAsc' | 'priceDesc'
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  // Carga de datos desde Perenual API
  useEffect(() => {
    let isMounted = true

    fetchPerenualPlants({ indoor: 1, page: 1 })
      .then((result) => {
        if (isMounted && result.plants && result.plants.length > 0) {
          setPlantsList(result.plants)
          setDataSource(result.source)
        }
      })
      .catch((err) => {
        console.error('Error cargando Perenual API:', err)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Extraer categorías únicas dinámicamente con traducción
  const categories = useMemo(() => {
    const unique = []
    const seen = new Set()
    for (const p of plantsList) {
      if (p.category && !seen.has(p.category.id)) {
        seen.add(p.category.id)
        unique.push({
          id: p.category.id,
          name: p.category[currentLang] || p.category.es,
        })
      }
    }
    return unique
  }, [plantsList, currentLang])

  // Filtrado y Ordenamiento
  const filteredAndSortedPlants = useMemo(() => {
    let list = [...plantsList]

    // 1. Filtro por categoría
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category?.id === selectedCategory)
    }

    // 2. Filtro por rango de precio
    if (selectedPriceRange === 'under15') {
      list = list.filter((p) => p.price < 15)
    } else if (selectedPriceRange === '15to25') {
      list = list.filter((p) => p.price >= 15 && p.price <= 25)
    } else if (selectedPriceRange === 'over25') {
      list = list.filter((p) => p.price > 25)
    }

    // 3. Ordenamiento rápido
    if (sortBy === 'priceAsc') {
      list.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'priceDesc') {
      list.sort((a, b) => b.price - a.price)
    }

    return list
  }, [plantsList, selectedCategory, selectedPriceRange, sortBy])

  const getItemQuantityInCart = (plantId) => {
    const item = cart.find((i) => i.id === plantId)
    return item ? item.quantity : 0
  }

  const handleResetFilters = () => {
    setSelectedCategory('all')
    setSelectedPriceRange('all')
    setSortBy('featured')
  }

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedPriceRange !== 'all' ||
    sortBy !== 'featured'

  return (
    <div className="catalog-page">
      {/* Título limpio */}
      <header className="catalog-header">
        <h1 className="catalog-title">{t('catalog.title')}</h1>
      </header>

      {/* Botón acordeón para móviles */}
      <div className="mobile-filter-accordion-toggle">
        <button
          type="button"
          className="mobile-accordion-btn"
          onClick={() => setIsMobileFiltersOpen((prev) => !prev)}
          aria-expanded={isMobileFiltersOpen}
        >
          <div className="accordion-btn-left">
            <svg
              className="filter-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="21" y2="21" />
              <line x1="4" x2="20" y1="14" y2="14" />
              <line x1="4" x2="20" y1="7" y2="7" />
              <circle cx="14" cy="7" r="2" />
              <circle cx="8" cy="14" r="2" />
              <circle cx="16" cy="21" r="2" />
            </svg>
            <span>{t('catalog.filterAccordion')}</span>
            {hasActiveFilters && <span className="active-filter-indicator" />}
          </div>
          <svg
            className={`chevron-icon ${isMobileFiltersOpen ? 'open' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      <div className="catalog-main-layout">
        {/* Sidebar de filtros */}
        <aside
          className={`catalog-sidebar ${isMobileFiltersOpen ? 'mobile-expanded' : ''}`}
        >
          {/* Categorías */}
          <div className="filter-group">
            <h3 className="filter-group-title">{t('catalog.categoryTitle')}</h3>
            <div className="category-list" role="tablist">
              <button
                type="button"
                className={`category-item-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                {t('catalog.allCategories')}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-item-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Rango de precio */}
          <div className="filter-group">
            <h3 className="filter-group-title">
              {t('catalog.priceRangeTitle')}
            </h3>
            <div className="price-range-options">
              <label className="checkbox-label">
                <input
                  type="radio"
                  name="priceRange"
                  checked={selectedPriceRange === 'all'}
                  onChange={() => setSelectedPriceRange('all')}
                />
                <span>{t('catalog.allPrices')}</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="radio"
                  name="priceRange"
                  checked={selectedPriceRange === 'under15'}
                  onChange={() => setSelectedPriceRange('under15')}
                />
                <span>{t('catalog.under15')}</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="radio"
                  name="priceRange"
                  checked={selectedPriceRange === '15to25'}
                  onChange={() => setSelectedPriceRange('15to25')}
                />
                <span>{t('catalog.from15to25')}</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="radio"
                  name="priceRange"
                  checked={selectedPriceRange === 'over25'}
                  onChange={() => setSelectedPriceRange('over25')}
                />
                <span>{t('catalog.over25')}</span>
              </label>
            </div>
          </div>

          {/* Botón reset filtros */}
          {hasActiveFilters && (
            <button
              type="button"
              className="btn-clear-filters"
              onClick={handleResetFilters}
            >
              {t('catalog.clearFilters')}
            </button>
          )}
        </aside>

        {/* Contenido principal: Barra superior y Grid */}
        <section className="catalog-content-area">
          {/* Barra superior de conteo y ordenamiento */}
          <div className="catalog-top-bar">
            <div className="products-count-wrapper">
              <span className="products-count-text">
                {t('catalog.showingCount', { count: filteredAndSortedPlants.length })}
              </span>
              {dataSource === 'perenual' && (
                <span className="api-source-badge" title="Datos sincronizados con Perenual Botanical API">
                  ⚡ Perenual API
                </span>
              )}
            </div>

            <div className="sort-by-wrapper">
              <label htmlFor="catalog-sort-select" className="sort-label">
                {t('catalog.sortBy')}
              </label>
              <select
                id="catalog-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="featured">{t('catalog.sortFeatured')}</option>
                <option value="priceAsc">{t('catalog.sortPriceAsc')}</option>
                <option value="priceDesc">{t('catalog.sortPriceDesc')}</option>
              </select>
            </div>
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="catalog-loading-bar">
              <span className="catalog-loading-spinner" />
              <span>Sincronizando plantas de Perenual...</span>
            </div>
          )}

          {/* Grid de productos */}
          {filteredAndSortedPlants.length === 0 ? (
            <div className="catalog-no-results">
              <p>{t('catalog.noResults')}</p>
              <button
                type="button"
                className="btn-clear-filters"
                onClick={handleResetFilters}
              >
                {t('catalog.clearFilters')}
              </button>
            </div>
          ) : (
            <div className="catalog-products-grid">
              {filteredAndSortedPlants.map((plant) => {
                const qtyInCart = getItemQuantityInCart(plant.id)
                const plantTitle = plant.name[currentLang] || plant.name.es || plant.name.en

                return (
                  <article key={plant.id} className="product-card">
                    {/* Contenedor de Imagen con fondo suave */}
                    <div className="product-image-container">
                      {plant.badge && (
                        <span className={`product-badge badge-${plant.badge}`}>
                          {t(`catalog.badges.${plant.badge}`)}
                        </span>
                      )}
                      <img
                        src={plant.image}
                        alt={plantTitle}
                        loading="lazy"
                        className="product-card-img"
                        onError={(e) => {
                          // Si una URL externa de Perenual falla al cargar, usar imagen de respaldo botánica
                          e.target.src =
                            'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80'
                        }}
                      />
                    </div>

                    {/* Cuerpo del Card con información y precio */}
                    <div className="product-info-container">
                      <h2 className="product-title">{plantTitle}</h2>
                      {plant.scientificName && (
                        <p className="product-scientific-name">
                          <em>{plant.scientificName}</em>
                        </p>
                      )}

                      <div className="product-bottom-row">
                        <span className="product-price">
                          ${plant.price.toFixed(2)}
                        </span>

                        <button
                          type="button"
                          className={`btn-add-moss ${qtyInCart > 0 ? 'added' : ''}`}
                          onClick={() =>
                            onAddToCart({
                              id: plant.id,
                              title: plantTitle,
                              price: plant.price,
                              image: plant.image,
                              category: plant.category?.[currentLang] || plant.category?.es || 'Interior',
                            })
                          }
                          aria-label={`Añadir ${plantTitle} al carrito`}
                        >
                          {qtyInCart > 0
                            ? `${t('catalog.added')} (${qtyInCart})`
                            : t('catalog.addToCart')}
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default PlantCatalog
