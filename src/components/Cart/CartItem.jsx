import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { removeItem, updateQuantity, clearCart } from '../../redux/slices/cartSlice'
import { deductStock } from '../../redux/slices/inventorySlice'
import PaymentForm from './PaymentForm'
import PaymentConfirmation from './PaymentConfirmation'
import './CartItem.css'

function CartItem({ onContinueShopping, onNavigate }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const cartItems = useSelector((state) => state.cart.items)

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState(null)

  // 1. Cálculo del monto total del carrito (Task 7.1)
  const calculateTotalAmount = () => {
    return cartItems.reduce((total, item) => {
      const price =
        typeof item.price === 'number'
          ? item.price
          : parseFloat(String(item.cost || item.price || 0).replace('$', '')) || 0
      return total + price * item.quantity
    }, 0)
  }

  // 2. Cálculo del costo total por cada planta (Task 7.2)
  const calculateTotalCost = (item) => {
    const price =
      typeof item.price === 'number'
        ? item.price
        : parseFloat(String(item.cost || item.price || 0).replace('$', '')) || 0
    return price * item.quantity
  }

  // 4. Incrementar cantidad (Task 7.4)
  const handleIncrement = (item) => {
    dispatch(
      updateQuantity({
        id: item.id,
        name: item.name || item.title,
        quantity: item.quantity + 1,
      }),
    )
  }

  // 4. Decrementar cantidad (Task 7.4)
  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      dispatch(
        updateQuantity({
          id: item.id,
          name: item.name || item.title,
          quantity: item.quantity - 1,
        }),
      )
    } else {
      handleRemove(item)
    }
  }

  // 5. Botón eliminar para cada item (Task 7.5)
  const handleRemove = (item) => {
    dispatch(removeItem(item.id || item.name || item.title))
  }

  // 7. Botón Continuar Comprando (Task 7.7)
  const handleContinueShoppingAction = (e) => {
    if (e) e.preventDefault()
    if (onContinueShopping) {
      onContinueShopping(e)
    } else if (onNavigate) {
      onNavigate('catalog')
    }
  }

  // 6. Botón Checkout (Task 7.6)
  const handleCheckout = () => {
    setIsCheckoutOpen(true)
  }

  const subtotal = calculateTotalAmount()
  const tax = subtotal * 0.07 // 7% ITBMS
  const grandTotal = subtotal + tax

  const handlePaymentSuccess = () => {
    // Deducción automática del inventario en logística (descuenta stock comprado)
    dispatch(deductStock(cartItems))

    const orderNumber = Math.floor(100000 + Math.random() * 900000)
    setConfirmedOrder({
      orderNumber,
      total: grandTotal,
    })
    setIsCheckoutOpen(false)
  }

  const handleFinishConfirmation = () => {
    setConfirmedOrder(null)
    dispatch(clearCart())
    if (onContinueShopping) {
      onContinueShopping()
    } else if (onNavigate) {
      onNavigate('catalog')
    }
  }

  return (
    <div className="cart-item-page" aria-label="Carrito de compras">
      <header className="cart-item-header">
        <h1 className="cart-item-main-title">{t('cart.title', 'Carrito de Compras')}</h1>
        <p className="cart-item-count-text">
          {t('cart.itemsCount', 'Total de plantas')}:{' '}
          <strong>{cartItems.reduce((acc, i) => acc + i.quantity, 0)}</strong>
        </p>
      </header>

      {cartItems.length === 0 ? (
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
          <h2 className="empty-cart-title">{t('cart.emptyTitle', 'Tu carrito está vacío')}</h2>
          <p className="empty-cart-subtitle">
            {t(
              'cart.emptySubtitle',
              'Explora nuestra colección y dale vida a tus espacios.',
            )}
          </p>
          <button
            type="button"
            className="btn-start-shopping"
            onClick={handleContinueShoppingAction}
          >
            {t('cart.startShopping', 'Explorar Plantas')}
          </button>
        </div>
      ) : (
        <div className="cart-content-grid">
          {/* Lista de Plantas (Task 7.1, 7.2, 7.3, 7.4, 7.5) */}
          <section className="cart-items-column" aria-label="Lista de artículos">
            <div className="cart-items-list" role="list">
              {cartItems.map((item) => {
                const unitPrice =
                  typeof item.price === 'number'
                    ? item.price
                    : parseFloat(String(item.cost || item.price || 0).replace('$', '')) || 0
                const itemTotal = calculateTotalCost(item)

                return (
                  <article key={item.id || item.name} className="cart-card-item" role="listitem">
                    {/* 3. Thumbnail */}
                    <div className="cart-thumb-box">
                      <img
                        src={item.image}
                        alt={item.name || item.title}
                        className="cart-thumb-img"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80'
                        }}
                      />
                    </div>

                    {/* 3. Nombre y Precio Unitario */}
                    <div className="cart-info-box">
                      <h3 className="cart-item-name">{item.name || item.title}</h3>
                      <p className="cart-unit-cost">
                        {t('cart.price', 'Precio Unitario')}:{' '}
                        <span>${unitPrice.toFixed(2)}</span>
                      </p>
                      {/* 2. Total cost for each plant */}
                      <p className="cart-total-cost-line">
                        {t('cart.subtotal', 'Subtotal')}:{' '}
                        <strong>${itemTotal.toFixed(2)}</strong>
                      </p>
                    </div>

                    {/* 4. Botones para incrementar y decrementar cantidad */}
                    <div className="cart-qty-box">
                      <span className="qty-label">{t('cart.quantity', 'Cantidad')}:</span>
                      <div className="qty-btn-group">
                        <button
                          type="button"
                          className="qty-action-btn"
                          onClick={() => handleDecrement(item)}
                          aria-label={`Disminuir cantidad de ${item.name || item.title}`}
                        >
                          -
                        </button>
                        <span className="qty-counter-badge">{item.quantity}</span>
                        <button
                          type="button"
                          className="qty-action-btn"
                          onClick={() => handleIncrement(item)}
                          aria-label={`Aumentar cantidad de ${item.name || item.title}`}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* 5. Botón Delete */}
                    <div className="cart-delete-box">
                      <button
                        type="button"
                        className="cart-delete-btn"
                        onClick={() => handleRemove(item)}
                        aria-label={`Eliminar ${item.name || item.title} del carrito`}
                        title={t('cart.removeItem', 'Eliminar del carrito')}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                        <span>{t('cart.removeItem', 'Eliminar')}</span>
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          {/* Resumen de Compra y Botones de Acción (Task 7.1, 7.6, 7.7) */}
          <aside className="cart-summary-column" aria-label="Resumen de compra">
            <div className="cart-summary-card">
              <h2 className="summary-title">{t('cart.orderSummary', 'Resumen de Compra')}</h2>

              {/* 1. Total cart amount */}
              <div className="summary-stat-row">
                <span>{t('cart.subtotal', 'Subtotal')}</span>
                <span className="summary-amount">${subtotal.toFixed(2)}</span>
              </div>

              <div className="summary-stat-row">
                <span>{t('cart.taxes', 'ITBMS (7%)')}</span>
                <span className="summary-amount">${tax.toFixed(2)}</span>
              </div>

              <div className="summary-line-divider" />

              <div className="summary-stat-row grand-total-row">
                <span>{t('cart.total', 'Total a Pagar')}</span>
                <span className="grand-total-amount">${grandTotal.toFixed(2)}</span>
              </div>

              <div className="summary-actions-stack">
                {/* 6. Checkout button */}
                <button
                  type="button"
                  className="btn-checkout-primary"
                  onClick={handleCheckout}
                >
                  {t('cart.proceedToCheckout', 'Proceder al Pago')}
                </button>

                {/* 7. Continue Shopping button */}
                <button
                  type="button"
                  className="btn-continue-secondary"
                  onClick={handleContinueShoppingAction}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  <span>{t('cart.continueShopping', 'Seguir Comprando')}</span>
                </button>
              </div>
            </div>

            {/* Pasarela interactiva de pagos cuando se activa Checkout */}
            {isCheckoutOpen && (
              <div className="cart-embedded-checkout">
                <PaymentForm
                  total={grandTotal}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Modal flotante de confirmación de pago */}
      {confirmedOrder && (
        <PaymentConfirmation
          orderNumber={confirmedOrder.orderNumber}
          total={confirmedOrder.total}
          onFinish={handleFinishConfirmation}
        />
      )}
    </div>
  )
}

export default CartItem

