import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeItem, updateQuantity } from './CartSlice'
import './components/Cart/CartItem.css'

/**
 * Task 7 — CartItem.jsx
 *
 * Complete Shopping Cart page with thumbnails, unit prices, line totals,
 * quantity controls, Delete, Checkout, and Continue Shopping actions.
 */
function CartItem({ onContinueShopping, onNavigate }) {
  const dispatch = useDispatch()
  const items = useSelector((state) => state.cart.items)
  const [showCheckoutMessage, setShowCheckoutMessage] = useState(false)

  const getPrice = (item) =>
    typeof item.price === 'number'
      ? item.price
      : Number.parseFloat(String(item.cost || item.price || 0).replace('$', '')) || 0

  const totalAmount = items.reduce((total, item) => total + getPrice(item) * item.quantity, 0)

  const continueShopping = () => {
    if (onContinueShopping) {
      onContinueShopping()
    } else if (onNavigate) {
      onNavigate('catalog')
    }
  }

  const changeQuantity = (item, quantity) => {
    dispatch(
      updateQuantity({
        id: item.id,
        name: item.name || item.title,
        quantity,
      }),
    )
  }

  return (
    <main className="cart-item-page" aria-label="Shopping Cart">
      <header className="cart-item-header">
        <h1 className="cart-item-main-title">Shopping Cart</h1>
        <p className="cart-item-count-text">
          Items: <strong>{items.reduce((total, item) => total + item.quantity, 0)}</strong>
        </p>
      </header>

      {items.length === 0 ? (
        <section className="cart-empty-state">
          <h2>Your cart is empty</h2>
          <button type="button" className="btn-start-shopping" onClick={continueShopping}>
            Continue Shopping
          </button>
        </section>
      ) : (
        <div className="cart-content-grid">
          <section className="cart-items-column" aria-label="Cart items">
            <div className="cart-items-list">
              {items.map((item) => {
                const unitPrice = getPrice(item)
                const itemTotal = unitPrice * item.quantity
                const itemName = item.name || item.title

                return (
                  <article key={item.id || itemName} className="cart-card-item">
                    <div className="cart-item-main-row">
                      <div className="cart-thumb-box">
                        <img
                          src={item.image}
                          alt={itemName}
                          className="cart-thumb-img"
                          loading="lazy"
                        />
                      </div>
                      <div className="cart-info-box">
                        <h2 className="cart-item-name">{itemName}</h2>
                        <p className="cart-unit-cost">
                          Unit Price: <span>${unitPrice.toFixed(2)}</span>
                        </p>
                        <p className="cart-total-cost-line">
                          Item Total: <strong>${itemTotal.toFixed(2)}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="cart-card-actions">
                      <div className="cart-qty-box" aria-label={`Quantity for ${itemName}`}>
                        <button
                          type="button"
                          className="qty-action-btn"
                          onClick={() => changeQuantity(item, item.quantity - 1)}
                          aria-label={`Decrease quantity of ${itemName}`}
                        >
                          -
                        </button>
                        <span className="qty-counter-badge">{item.quantity}</span>
                        <button
                          type="button"
                          className="qty-action-btn"
                          onClick={() => changeQuantity(item, item.quantity + 1)}
                          aria-label={`Increase quantity of ${itemName}`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="cart-delete-btn"
                        onClick={() => dispatch(removeItem(item.id || itemName))}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          <aside className="cart-summary-column" aria-label="Cart summary">
            <div className="cart-summary-card">
              <h2 className="summary-title">Cart Total</h2>
              <p className="summary-stat-row">
                <span>Total Amount</span>
                <strong className="grand-total-amount">${totalAmount.toFixed(2)}</strong>
              </p>
              <div className="summary-actions-stack">
                <button
                  type="button"
                  className="btn-checkout-primary"
                  onClick={() => setShowCheckoutMessage(true)}
                >
                  Checkout
                </button>
                <button type="button" className="btn-continue-secondary" onClick={continueShopping}>
                  Continue Shopping
                </button>
              </div>
              {showCheckoutMessage && <p role="status">Coming Soon</p>}
            </div>
          </aside>
        </div>
      )}
    </main>
  )
}

export default CartItem
