import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useTheme from '../../hooks/useTheme'
import applePayLight from '../../assets/cib--cc-apple-pay.svg'
import applePayDark from '../../assets/cib--cc-apple-pay--dark.svg'
import googlePayLight from '../../assets/cib--google-pay.svg'
import googlePayDark from '../../assets/cib--google-pay--dark.svg'
import paypalLight from '../../assets/cib--cc-paypal.svg'
import paypalDark from '../../assets/cib--cc-paypal--dark.svg'
import './PaymentForm.css'

function PaymentForm({ total, onPaymentSuccess }) {
  const { t } = useTranslation()
  const theme = useTheme()
  const isDark = theme === 'dark'

  const applePayIcon = isDark ? applePayDark : applePayLight
  const googlePayIcon = isDark ? googlePayDark : googlePayLight
  const paypalIcon = isDark ? paypalDark : paypalLight

  const [method, setMethod] = useState('card') // 'card' | 'wallet' | 'cash'
  const [isProcessing, setIsProcessing] = useState(false)

  // Card form state
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  })

  // Wallet form state
  const [walletProvider, setWalletProvider] = useState('apple')

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16)
    val = val.replace(/(.{4})/g, '$1 ').trim()
    setCardData((prev) => ({ ...prev, number: val }))
  }

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4)
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`
    }
    setCardData((prev) => ({ ...prev, expiry: val }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulación de procesamiento de pasarela con feedback visual
    setTimeout(() => {
      setIsProcessing(false)
      onPaymentSuccess({
        method,
        details: method === 'card' ? cardData : { provider: walletProvider },
      })
    }, 1200)
  }

  return (
    <div className="payment-form-container">
      <div className="payment-header">
        <h3 className="payment-title">{t('checkout.title')}</h3>
        <p className="payment-subtitle">{t('checkout.subtitle')}</p>
      </div>

      {/* Selector interactivo de métodos con animación */}
      <div className="payment-methods-selector" role="radiogroup">
        <button
          type="button"
          role="radio"
          aria-checked={method === 'card'}
          className={`method-tab-btn ${method === 'card' ? 'active' : ''}`}
          onClick={() => setMethod('card')}
        >
          <svg
            className="method-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
          <span>{t('checkout.methods.card')}</span>
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={method === 'wallet'}
          className={`method-tab-btn ${method === 'wallet' ? 'active' : ''}`}
          onClick={() => setMethod('wallet')}
        >
          <svg
            className="method-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
            <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
          </svg>
          <span>{t('checkout.methods.wallet')}</span>
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={method === 'cash'}
          className={`method-tab-btn ${method === 'cash' ? 'active' : ''}`}
          onClick={() => setMethod('cash')}
        >
          <svg
            className="method-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="12" x="2" y="6" rx="2" />
            <circle cx="12" cy="12" r="2" />
            <path d="M6 12h.01M18 12h.01" />
          </svg>
          <span>{t('checkout.methods.cash')}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="payment-body-form">
        {/* Flujo: Tarjeta con vista previa animada */}
        {method === 'card' && (
          <div className="method-content method-card-view">
            <div className="card-mockup-preview">
              <div className="card-chip" />
              <div className="card-number-display">
                {cardData.number || '•••• •••• •••• ••••'}
              </div>
              <div className="card-footer-display">
                <div>
                  <span className="card-label">TITULAR</span>
                  <p className="card-name-text">
                    {cardData.name.toUpperCase() || 'NOMBRE TITULAR'}
                  </p>
                </div>
                <div>
                  <span className="card-label">EXP</span>
                  <p className="card-exp-text">{cardData.expiry || 'MM/AA'}</p>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="card-number">
                {t('checkout.cardForm.number')}
              </label>
              <input
                id="card-number"
                type="text"
                placeholder={t('checkout.cardForm.numberPlaceholder')}
                value={cardData.number}
                onChange={handleCardNumberChange}
                required
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="card-name">
                {t('checkout.cardForm.name')}
              </label>
              <input
                id="card-name"
                type="text"
                placeholder={t('checkout.cardForm.namePlaceholder')}
                value={cardData.name}
                onChange={(e) =>
                  setCardData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                className="input-field"
              />
            </div>

            <div className="form-row-two">
              <div className="form-group">
                <label htmlFor="card-expiry">
                  {t('checkout.cardForm.expiry')}
                </label>
                <input
                  id="card-expiry"
                  type="text"
                  placeholder="MM/AA"
                  value={cardData.expiry}
                  onChange={handleExpiryChange}
                  required
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label htmlFor="card-cvv">{t('checkout.cardForm.cvv')}</label>
                <input
                  id="card-cvv"
                  type="password"
                  maxLength="4"
                  placeholder="123"
                  value={cardData.cvv}
                  onChange={(e) =>
                    setCardData((prev) => ({
                      ...prev,
                      cvv: e.target.value.replace(/\D/g, ''),
                    }))
                  }
                  required
                  className="input-field"
                />
              </div>
            </div>
          </div>
        )}

        {/* Flujo: Billetera Digital interactiva */}
        {method === 'wallet' && (
          <div className="method-content method-wallet-view">
            <p className="wallet-select-label">
              {t('checkout.walletForm.selectProvider')}
            </p>
            <div className="wallet-providers-grid">
              <button
                type="button"
                className={`wallet-provider-card ${walletProvider === 'apple' ? 'selected' : ''}`}
                onClick={() => setWalletProvider('apple')}
              >
                <img
                  src={applePayIcon}
                  alt={t('checkout.walletForm.applePay')}
                  className="wallet-svg-icon"
                />
                <span className="wallet-name">{t('checkout.walletForm.applePay')}</span>
              </button>
              <button
                type="button"
                className={`wallet-provider-card ${walletProvider === 'google' ? 'selected' : ''}`}
                onClick={() => setWalletProvider('google')}
              >
                <img
                  src={googlePayIcon}
                  alt={t('checkout.walletForm.googlePay')}
                  className="wallet-svg-icon"
                />
                <span className="wallet-name">{t('checkout.walletForm.googlePay')}</span>
              </button>
              <button
                type="button"
                className={`wallet-provider-card ${walletProvider === 'paypal' ? 'selected' : ''}`}
                onClick={() => setWalletProvider('paypal')}
              >
                <img
                  src={paypalIcon}
                  alt={t('checkout.walletForm.paypal')}
                  className="wallet-svg-icon"
                />
                <span className="wallet-name">{t('checkout.walletForm.paypal')}</span>
              </button>
            </div>
            <div className="wallet-security-hint">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>{t('checkout.walletForm.instantPayment')}</span>
            </div>
          </div>
        )}

        {/* Flujo: Efectivo / Pago al recoger */}
        {method === 'cash' && (
          <div className="method-content method-cash-view">
            <div className="cash-notice-box">
              <div className="cash-icon-large" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <h4 className="cash-notice-title">
                {t('checkout.cashForm.note')}
              </h4>
              <p className="cash-notice-detail">
                {t('checkout.cashForm.prepareAmount')}
              </p>
            </div>
          </div>
        )}

        {/* Botón de Pago interactivo */}
        <button
          type="submit"
          className="btn-pay-submit"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <span className="processing-indicator">
              <span className="spinner" />
              {t('checkout.processing')}
            </span>
          ) : (
            <span>
              {t('checkout.payNow')} • ${total.toFixed(2)}
            </span>
          )}
        </button>
      </form>
    </div>
  )
}

export default PaymentForm

