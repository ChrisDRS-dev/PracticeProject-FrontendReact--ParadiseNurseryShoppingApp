import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { updateQuantity, removeItem } from '../../redux/slices/cartSlice'
import './PlantDetailDrawer.css'

export default function PlantDetailDrawer({
  plant,
  onClose,
  onAddToCart,
  isInCart: propIsInCart = false,
}) {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language.startsWith('es') ? 'es' : 'en'

  const dispatch = useDispatch()
  const cartItems = useSelector((state) => state.cart.items)

  // Cerrar al pulsar Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (plant) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [plant, onClose])

  if (!plant) return null

  const plantName =
    plant.name?.[currentLang] || plant.name?.es || plant.name || plant.title
  const categoryName =
    plant.category?.[currentLang] ||
    plant.category?.es ||
    plant.category?.name ||
    plant.category ||
    'Plantas'
  const descriptionText =
    plant.description?.[currentLang] ||
    plant.description?.es ||
    plant.description ||
    ''
  const stock = plant.stock ?? 10
  const isOutOfStock = stock <= 0

  // Estado del producto en el carrito desde Redux
  const cartItem = cartItems.find(
    (item) => item.id === plant.id || item.name === plantName || item.title === plantName,
  )
  const cartQuantity = cartItem ? cartItem.quantity : 0
  const isItemInCart = cartQuantity > 0 || propIsInCart

  const handleDecrement = () => {
    if (cartQuantity > 1) {
      dispatch(
        updateQuantity({
          id: plant.id,
          name: plantName,
          quantity: cartQuantity - 1,
        }),
      )
    } else {
      dispatch(removeItem({ id: plant.id, name: plantName }))
    }
  }

  const handleIncrement = () => {
    if (cartQuantity < stock) {
      dispatch(
        updateQuantity({
          id: plant.id,
          name: plantName,
          quantity: cartQuantity + 1,
        }),
      )
    }
  }

  return (
    <AnimatePresence>
      <div className="plant-drawer-overlay" onClick={onClose} aria-hidden="true">
        <motion.div
          className="plant-drawer-container"
          role="dialog"
          aria-modal="true"
          aria-labelledby="plant-detail-name"
          onClick={(e) => e.stopPropagation()}
          initial={{ x: '100%', opacity: 0.7 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        >
          {/* Header con botón de cierre */}
          <div className="drawer-header">
            <span className="drawer-category-pill">{categoryName}</span>
            <button
              type="button"
              className="drawer-close-btn"
              onClick={onClose}
              aria-label={t('catalog.closeDetails', 'Cerrar detalles')}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="drawer-scrollable-body">
            {/* Imagen Principal */}
            <div className="drawer-image-wrapper">
              {plant.badge && (
                <span className={`drawer-badge badge-${plant.badge}`}>
                  {t(`catalog.badges.${plant.badge}`, plant.badge)}
                </span>
              )}
              <img
                src={plant.image}
                alt={plantName}
                loading="eager"
                referrerPolicy="no-referrer"
                className="drawer-plant-img"
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80'
                }}
              />
            </div>

            {/* Datos Principales */}
            <div className="drawer-main-info">
              <div className="drawer-title-row">
                <div>
                  <h2 id="plant-detail-name" className="drawer-plant-name">
                    {plantName}
                  </h2>
                  {plant.scientificName && (
                    <p className="drawer-scientific-name">
                      <em>{plant.scientificName}</em>
                    </p>
                  )}
                </div>
                <div className="drawer-price-tag">
                  ${plant.price.toFixed(2)}
                </div>
              </div>

              {/* Guía Botánica y Cuidados */}
              <div className="drawer-care-section">
                <h3 className="drawer-section-heading">
                  {t('catalog.careGuide', 'Guía de cuidados')}
                </h3>
                <div className="care-specs-grid">
                  <div className="care-spec-card">
                    <span className="care-icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      </svg>
                    </span>
                    <div className="care-meta">
                      <span className="care-label">
                        {t('catalog.watering', 'Riego')}
                      </span>
                      <strong className="care-val">
                        {plant.watering || (currentLang === 'es' ? 'Moderado' : 'Moderate')}
                      </strong>
                    </div>
                  </div>

                  <div className="care-spec-card">
                    <span className="care-icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2" />
                        <path d="M12 20v2" />
                        <path d="m4.93 4.93 1.41 1.41" />
                        <path d="m17.66 17.66 1.41 1.41" />
                        <path d="M2 12h2" />
                        <path d="M20 12h2" />
                        <path d="m6.34 17.66-1.41 1.41" />
                        <path d="m19.07 4.93-1.41 1.41" />
                      </svg>
                    </span>
                    <div className="care-meta">
                      <span className="care-label">
                        {t('catalog.sunlight', 'Luz solar')}
                      </span>
                      <strong className="care-val">
                        {plant.sunlight || (currentLang === 'es' ? 'Luz indirecta' : 'Indirect light')}
                      </strong>
                    </div>
                  </div>

                  <div className="care-spec-card">
                    <span className="care-icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                      </svg>
                    </span>
                    <div className="care-meta">
                      <span className="care-label">
                        {t('catalog.cycle', 'Ciclo')}
                      </span>
                      <strong className="care-val">
                        {plant.cycle || (currentLang === 'es' ? 'Perenne' : 'Perennial')}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Descripción detallada */}
              <div className="drawer-description-section">
                <h3 className="drawer-section-heading">
                  {currentLang === 'es' ? 'Descripción botánica' : 'Botanical Description'}
                </h3>
                <p className="drawer-desc-p">
                  {descriptionText ||
                    (currentLang === 'es'
                      ? 'Especie botánica seleccionada de nuestra colección de Paradise Nursery.'
                      : 'Botanical specimen curated from our Paradise Nursery collection.')}
                </p>

                {/* Cantidad de unidades disponibles: compacto, debajo de la descripción */}
                <div
                  className={`drawer-available-units-compact ${
                    isOutOfStock ? 'depleted' : stock <= 3 ? 'low-units' : 'healthy-units'
                  }`}
                >
                  <span className="units-compact-dot" />
                  <span className="units-compact-label">
                    {t('catalog.availableUnits', 'Cantidad de unidades disponibles')}:
                  </span>
                  <strong className="units-compact-number">
                    {isOutOfStock
                      ? t('catalog.outOfStock', 'Agotado (0)')
                      : `${stock} ${currentLang === 'es' ? 'unidades' : 'units'}`}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Footer de acción */}
          <div className="drawer-footer-actions">
            {/* Control selector de cantidad cuando el producto está en el carrito */}
            {isItemInCart && !isOutOfStock && (
              <div className="drawer-quantity-selector-box">
                <span className="drawer-qty-label">
                  {t('catalog.selectQuantity', 'Seleccionar cantidad')}
                </span>
                <div className="drawer-qty-stepper">
                  <button
                    type="button"
                    className="drawer-stepper-btn"
                    onClick={handleDecrement}
                    aria-label={t('catalog.decreaseQuantity', 'Disminuir cantidad')}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                  <span className="drawer-qty-value">{cartQuantity}</span>
                  <button
                    type="button"
                    className="drawer-stepper-btn"
                    disabled={cartQuantity >= stock}
                    onClick={handleIncrement}
                    aria-label={t('catalog.increaseQuantity', 'Aumentar cantidad')}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              className={`drawer-btn-add ${
                isOutOfStock
                  ? 'out-of-stock-disabled'
                  : isItemInCart
                    ? 'in-cart-active'
                    : ''
              }`}
              disabled={isOutOfStock}
              onClick={() => {
                if (!isItemInCart) {
                  onAddToCart(plant)
                }
              }}
            >
              {isOutOfStock ? (
                t('catalog.outOfStock', 'Agotado')
              ) : isItemInCart ? (
                <span className="btn-in-cart-content">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {t('catalog.added', 'Añadido al carrito')}
                </span>
              ) : (
                t('catalog.addToCart', 'Añadir al carrito')
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
