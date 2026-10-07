import { useState, useMemo, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { addItem } from '../../redux/slices/cartSlice'
import {
  selectInventoryItems,
  selectInventoryMetrics,
  setRestocking,
  replenishStock,
} from '../../redux/slices/inventorySlice'
import { syncRestockFromAPI } from '../../services/perenualApi'
import Navbar from '../../components/Navbar/Navbar'
import CartItem from '../../components/Cart/CartItem'
import PlantDetailDrawer from '../../components/PlantDetail/PlantDetailDrawer'
import './ProductList.css'

function ProductList({
  onNavigate,
  standaloneNavbar = false,
  theme = 'dark',
  onToggleTheme,
}) {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language.startsWith('es') ? 'es' : 'en'

  const dispatch = useDispatch()
  const cartItems = useSelector((state) => state.cart.items)

  // 8. Total dinámico de items en el carrito para el icono/badge
  const cartTotalCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  // Inventario en vivo y métricas de logística
  const inventoryPlants = useSelector(selectInventoryItems)
  const logistics = useSelector(selectInventoryMetrics)

  // Estado para alternar internamente entre catálogo y carrito (si se usa de modo autónomo)
  const [showCart, setShowCart] = useState(false)

  // Filtros y ordenamiento
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPriceRange, setSelectedPriceRange] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [selectedPlantForDetails, setSelectedPlantForDetails] = useState(null)

  // Función ejecutora del reabastecimiento logístico en segundo plano
  const handlePerformRestock = useCallback(async () => {
    dispatch(setRestocking(true))
    const result = await syncRestockFromAPI()
    dispatch(replenishStock({ amount: result.amount || 10, source: result.source }))
  }, [dispatch])

  // Verificación reactiva del umbral logístico (50% sin stock)
  useEffect(() => {
    let isSubscribed = true
    if (logistics.isThresholdReached && !logistics.isRestocking) {
      const timer = setTimeout(() => {
        if (isSubscribed) {
          handlePerformRestock()
        }
      }, 50)
      return () => {
        isSubscribed = false
        clearTimeout(timer)
      }
    }
  }, [logistics.isThresholdReached, logistics.isRestocking, handlePerformRestock])

  // 4. Función para agregar producto al carrito (Task 6.4)
  const handleAddToCart = (plant) => {
    const currentStock = plant.stock ?? 10
    if (currentStock <= 0) return

    const plantTitle = plant.name?.[currentLang] || plant.name?.es || plant.name || plant.title
    const plantCategory =
      plant.category?.[currentLang] || plant.category?.es || plant.category || 'Houseplants'

    dispatch(
      addItem({
        id: plant.id,
        name: plantTitle,
        title: plantTitle,
        price: plant.price,
        cost: plant.price,
        image: plant.image,
        category: plantCategory,
        stock: currentStock,
      }),
    )
  }

  // 5. Verificar si una planta ya está en el carrito para deshabilitar botón (Task 6.5)
  const isItemInCart = (plant) => {
    if (!plant) return false
    return cartItems.some((item) => String(item.id) === String(plant.id))
  }

  // Extraer categorías dinámicamente desde el inventario
  const categories = useMemo(() => {
    const list = []
    const seen = new Set()
    for (const p of inventoryPlants) {
      const catId = p.category?.id || (typeof p.category === 'string' ? p.category : null)
      if (catId && !seen.has(catId)) {
        seen.add(catId)
        const catName =
          typeof p.category === 'object'
            ? p.category[currentLang] || p.category.es
            : p.category
        list.push({ id: catId, name: catName })
      }
    }
    return list
  }, [inventoryPlants, currentLang])

  // Filtrado y Ordenamiento
  const processedPlants = useMemo(() => {
    let list = [...inventoryPlants]

    // Filtro por categoría seleccionada
    if (selectedCategory !== 'all') {
      list = list.filter((p) => {
        const catId = p.category?.id || (typeof p.category === 'string' ? p.category : null)
        return catId === selectedCategory
      })
    }

    // Filtro por precio
    if (selectedPriceRange === 'under15') {
      list = list.filter((p) => p.price < 15)
    } else if (selectedPriceRange === '15to25') {
      list = list.filter((p) => p.price >= 15 && p.price <= 25)
    } else if (selectedPriceRange === 'over25') {
      list = list.filter((p) => p.price > 25)
    }

    // Ordenamiento rápido
    if (sortBy === 'priceAsc') {
      list.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'priceDesc') {
      list.sort((a, b) => b.price - a.price)
    }

    return list
  }, [inventoryPlants, selectedCategory, selectedPriceRange, sortBy])

  // 2. Agrupación por categorías (Task 6.2: al menos 3 categorías con al menos 6 plantas por categoría)
  const groupedByCategory = useMemo(() => {
    const groups = {}
    for (const plant of processedPlants) {
      const catId =
        plant.category?.id || (typeof plant.category === 'string' ? plant.category : 'general')
      const catName =
        typeof plant.category === 'object'
          ? plant.category[currentLang] || plant.category.es
          : plant.category || 'General'

      if (!groups[catId]) {
        groups[catId] = { id: catId, name: catName, plants: [] }
      }
      groups[catId].plants.push(plant)
    }
    return Object.values(groups)
  }, [processedPlants, currentLang])

  // Manejo de navegación para navbar
  const handleNav = (target) => {
    if (target === 'cart') {
      setShowCart(true)
    } else {
      setShowCart(false)
    }
    if (onNavigate) {
      onNavigate(target)
    }
  }

  const handleResetFilters = () => {
    setSelectedCategory('all')
    setSelectedPriceRange('all')
    setSortBy('featured')
  }

  const hasActiveFilters =
    selectedCategory !== 'all' || selectedPriceRange !== 'all' || sortBy !== 'featured'

  if (showCart && standaloneNavbar) {
    return (
      <div className="product-list-wrapper">
        <Navbar
          currentPage="cart"
          onNavigate={handleNav}
          cartTotalCount={cartTotalCount}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />
        <CartItem
          onContinueShopping={() => setShowCart(false)}
          onNavigate={handleNav}
        />
      </div>
    )
  }

  return (
    <div className="product-list-wrapper">
      {/* 7. Navbar con links a Home, Plants, Cart (Task 6.7) */}
      {standaloneNavbar && (
        <Navbar
          currentPage="catalog"
          onNavigate={handleNav}
          cartTotalCount={cartTotalCount}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />
      )}


      <div className="catalog-page">
        {/* Encabezado limpio de la colección */}
        <header className="catalog-header">
          <div className="catalog-header-top">
            <h1 className="catalog-title">{t('catalog.title', 'Colección de nuestras plantas')}</h1>
          </div>
        </header>

        {/* Acordeón para filtros en móviles */}
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
                aria-hidden="true"
              >
                <line x1="4" x2="20" y1="21" y2="21" />
                <line x1="4" x2="20" y1="14" y2="14" />
                <line x1="4" x2="20" y1="7" y2="7" />
                <circle cx="14" cy="7" r="2" />
                <circle cx="8" cy="14" r="2" />
                <circle cx="16" cy="21" r="2" />
              </svg>
              <span>{t('catalog.filterAccordion', 'Filtros y orden')}</span>
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
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>

        <div className="catalog-main-layout">
          {/* Sidebar de Filtros */}
          <aside
            className={`catalog-sidebar ${isMobileFiltersOpen ? 'mobile-expanded' : ''}`}
            aria-label="Filtros del catálogo"
          >
            {/* Categorías */}
            <div className="filter-group">
              <h2 className="filter-group-title">{t('catalog.categoryTitle', 'Categoría')}</h2>
              <div className="category-list" role="tablist">
                <button
                  type="button"
                  className={`category-item-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('all')}
                >
                  {t('catalog.allCategories', 'Todas las plantas')}
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
              <h2 className="filter-group-title">
                {t('catalog.priceRangeTitle', 'Rango de precio')}
              </h2>
              <div className="price-range-options">
                <label className="checkbox-label">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={selectedPriceRange === 'all'}
                    onChange={() => setSelectedPriceRange('all')}
                  />
                  <span>{t('catalog.allPrices', 'Todos los precios')}</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={selectedPriceRange === 'under15'}
                    onChange={() => setSelectedPriceRange('under15')}
                  />
                  <span>{t('catalog.under15', 'Menos de $15')}</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={selectedPriceRange === '15to25'}
                    onChange={() => setSelectedPriceRange('15to25')}
                  />
                  <span>{t('catalog.from15to25', '$15 - $25')}</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={selectedPriceRange === 'over25'}
                    onChange={() => setSelectedPriceRange('over25')}
                  />
                  <span>{t('catalog.over25', 'Más de $25')}</span>
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
                {t('catalog.clearFilters', 'Restablecer filtros')}
              </button>
            )}
          </aside>

          {/* Área Principal de Productos */}
          <section className="catalog-content-area" aria-label="Listado de plantas">
            {/* Barra superior con selector de ordenamiento */}
            <div className="catalog-top-bar">
              <div className="sort-by-wrapper">
                <label htmlFor="catalog-sort-select" className="sort-label">
                  {t('catalog.sortBy', 'Ordenar por:')}
                </label>
                <select
                  id="catalog-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="featured">
                    {t('catalog.sortFeatured', 'Destacados')}
                  </option>
                  <option value="priceAsc">
                    {t('catalog.sortPriceAsc', 'Precio - Menor a mayor')}
                  </option>
                  <option value="priceDesc">
                    {t('catalog.sortPriceDesc', 'Precio - Mayor a menor')}
                  </option>
                </select>
              </div>
            </div>

            {processedPlants.length === 0 ? (
              <div className="catalog-no-results">
                <p>
                  {t(
                    'catalog.noResults',
                    'No se encontraron plantas con los filtros seleccionados.',
                  )}
                </p>
                <button
                  type="button"
                  className="btn-clear-filters"
                  onClick={handleResetFilters}
                >
                  {t('catalog.clearFilters', 'Restablecer filtros')}
                </button>
              </div>
            ) : (
              <div className="catalog-categories-stack">
                {/* 2. Categorías agrupadas (Task 6.1 & 6.2: Mínimo 3 categorías, 6 plantas cada una) */}
                {groupedByCategory.map((categoryGroup) => (
                  <section
                    key={categoryGroup.id}
                    className="category-section-block"
                    aria-labelledby={`cat-title-${categoryGroup.id}`}
                  >
                    <div className="category-section-header">
                      <h2
                        id={`cat-title-${categoryGroup.id}`}
                        className="category-section-title"
                      >
                        {categoryGroup.name}
                      </h2>
                      <span className="category-plant-count">
                        ({categoryGroup.plants.length} plantas)
                      </span>
                    </div>

                    <div className="catalog-products-grid">
                      {categoryGroup.plants.map((plant) => {
                        const plantTitle =
                          plant.name?.[currentLang] ||
                          plant.name?.es ||
                          plant.name ||
                          plant.title
                        const addedToCart = isItemInCart(plant)
                        const stock = plant.stock ?? 10
                        const isOutOfStock = stock <= 0

                        return (
                          <article
                            key={plant.id}
                            className="product-card"
                            onClick={() => setSelectedPlantForDetails(plant)}
                            role="button"
                            tabIndex={0}
                            aria-label={`${plantTitle} - ${t('catalog.viewDetails', 'Ver detalles')}`}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                setSelectedPlantForDetails(plant)
                              }
                            }}
                          >
                            {/* 1. Thumbnail con Badges de estado */}
                            <div className="product-image-container">
                              {plant.badge && (
                                <span className={`product-badge badge-${plant.badge}`}>
                                  {t(`catalog.badges.${plant.badge}`, plant.badge)}
                                </span>
                              )}

                              {/* Solo mostrar etiqueta de Agotado si stock llega a 0 */}
                              {isOutOfStock && (
                                <span className="product-stock-tag out">
                                  {t('catalog.outOfStock', 'Agotado')}
                                </span>
                              )}

                              <span className="product-quick-detail-hint">
                                {t('catalog.viewDetails', 'Ver detalles')}
                              </span>

                              <img
                                src={plant.image}
                                alt={plantTitle}
                                loading="lazy"
                                referrerPolicy="no-referrer"
                                className={`product-card-img ${isOutOfStock ? 'dimmed' : ''}`}
                                onError={(e) => {
                                  e.target.src =
                                    'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80'
                                }}
                              />
                            </div>

                            {/* 1. Nombre y Precio */}
                            <div className="product-info-container">
                              <h3 className="product-title">{plantTitle}</h3>
                              {plant.scientificName && (
                                <p className="product-scientific-name">
                                  <em>{plant.scientificName}</em>
                                </p>
                              )}

                              <div className="product-bottom-row">
                                <span className="product-price">
                                  ${plant.price.toFixed(2)}
                                </span>

                                {/* 3, 4, 5. Botón Add to Cart con deshabilitación por stock o por estar en carrito */}
                                <button
                                  type="button"
                                  className={`btn-add-moss ${
                                    isOutOfStock
                                      ? 'stock-depleted-disabled'
                                      : addedToCart
                                        ? 'added-disabled'
                                        : ''
                                  }`}
                                  disabled={isOutOfStock || addedToCart}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleAddToCart(plant)
                                  }}
                                  aria-label={
                                    isOutOfStock
                                      ? `${plantTitle} está agotado`
                                      : addedToCart
                                        ? `${plantTitle} ya está en el carrito`
                                        : `Añadir ${plantTitle} al carrito`
                                  }
                                >
                                  {isOutOfStock
                                    ? t('catalog.outOfStock', 'Agotado')
                                    : addedToCart
                                      ? t('catalog.added', 'Añadido')
                                      : t('catalog.addToCart', 'Añadir al carrito')}
                                </button>
                              </div>
                            </div>
                          </article>
                        )
                      })}
                    </div>
                  </section>
                ))}

                {/* Conteo de productos al final del catálogo */}
                <div className="catalog-bottom-footer-info">
                  <span className="products-count-text">
                    {t('catalog.showingCount', {
                      count: processedPlants.length,
                      defaultValue: `Mostrando ${processedPlants.length} productos`,
                    })}
                  </span>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Drawer de Vista Detallada de la Planta */}
      <PlantDetailDrawer
        plant={selectedPlantForDetails}
        onClose={() => setSelectedPlantForDetails(null)}
        onAddToCart={handleAddToCart}
        isInCart={selectedPlantForDetails ? isItemInCart(selectedPlantForDetails) : false}
      />
    </div>
  )
}

export default ProductList

