import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import CartItemList from '../../components/Cart/CartItemList'
import PaymentForm from '../../components/Cart/PaymentForm'
import PaymentConfirmation from '../../components/Cart/PaymentConfirmation'
import './CartPage.css'

function CartPage({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigate,
}) {
  const { t } = useTranslation()
  const [confirmedOrder, setConfirmedOrder] = useState(null)

  // Cálculos de subtotal, impuestos ITBMS 7% y total
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  )
  const tax = subtotal * 0.07 // 7% ITBMS
  const total = subtotal + tax

  const handlePaymentSuccess = () => {
    // Generar un número de orden aleatorio único
    const orderNumber = Math.floor(100000 + Math.random() * 900000)
    setConfirmedOrder({
      orderNumber,
      total,
    })
  }

  const handleFinishConfirmation = () => {
    setConfirmedOrder(null)
    onClearCart()
    onNavigate('catalog')
  }

  return (
    <div className="cart-page">
      <header className="cart-header">
        <h1 className="cart-title">{t('cart.title')}</h1>
      </header>

      <div className={`cart-layout ${cart.length === 0 ? 'empty' : ''}`}>
        {/* Componente 1: Lista de items con desglose y subtotal */}
        <section className="cart-items-section">
          <CartItemList
            items={cart}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
            subtotal={subtotal}
            tax={tax}
            total={total}
            onContinueShopping={() => onNavigate('catalog')}
          />
        </section>

        {/* Componente 2: Forma de pago interactiva */}
        {cart.length > 0 && (
          <section className="cart-payment-section">
            <PaymentForm
              total={total}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </section>
        )}
      </div>

      {/* Componente 3: Confirmación de pago con animación por encima */}
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

export default CartPage

