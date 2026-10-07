import { useTranslation } from 'react-i18next'
import './CartItemList.css'

function CartItemList({
  items,
  onUpdateQuantity,
  onRemoveItem,
  subtotal,
  tax,
  total,
  onContinueShopping,
}) {
  const { t } = useTranslation()

  if (items.length === 0) {
    return (
      <div className="cart-empty-state">
        <div className="empty-cart-icon-wrapper">
          <svg
            className="empty-cart-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </div>
        <h2 className="empty-cart-title">{t('cart.emptyTitle')}</h2>
        <p className="empty-cart-subtitle">{t('cart.emptySubtitle')}</p>
        <button
          type="button"
          className="btn-start-shopping"
          onClick={onContinueShopping}
        >
          {t('cart.startShopping')}
        </button>
      </div>
    )
  }

  return (
    <div className="cart-items-container">
      {/* Lista de productos seleccionados */}
      <div className="cart-items-list" role="list">
        {items.map((item) => {
          const itemSubtotal = item.price * item.quantity

          return (
            <div key={item.id} className="cart-item-row" role="listitem">
              {/* Imagen bastante pequeña */}
              <div className="cart-item-thumb-wrapper">
                <img
                  src={item.image}
                  alt={item.title}
                  className="cart-item-thumb"
                />
              </div>

              {/* Nombre y categoría */}
              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.title}</h3>
                <span className="cart-item-unit-price">
                  ${item.price.toFixed(2)} / ud.
                </span>
              </div>

              {/* Controles de cantidad */}
              <div className="cart-item-qty-controls">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  aria-label="Disminuir cantidad"
                >
                  -
                </button>
                <span className="qty-value">{item.quantity}</span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>

              {/* Subtotal del item */}
              <div className="cart-item-subtotal">
                <span>${itemSubtotal.toFixed(2)}</span>
              </div>

              {/* Botón eliminar */}
              <button
                type="button"
                className="btn-remove-item"
                onClick={() => onRemoveItem(item.id)}
                title={t('cart.removeItem')}
                aria-label={`${t('cart.removeItem')} ${item.title}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          )
        })}
      </div>

      {/* Resumen de costos e impuestos */}
      <div className="cart-summary-box">
        <h3 className="summary-box-title">{t('cart.orderSummary')}</h3>

        <div className="summary-row">
          <span>{t('cart.subtotal')}</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="summary-row">
          <span>{t('cart.taxes')}</span>
          <span className="tax-amount">${tax.toFixed(2)}</span>
        </div>

        <div className="summary-divider" />

        <div className="summary-row total-row">
          <span>{t('cart.total')}</span>
          <span className="total-amount">${total.toFixed(2)}</span>
        </div>

        <button
          type="button"
          className="btn-continue-shopping"
          onClick={onContinueShopping}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>{t('cart.continueShopping')}</span>
        </button>
      </div>
    </div>
  )
}

export default CartItemList

