import { useTranslation } from 'react-i18next'
import './PaymentConfirmation.css'

function PaymentConfirmation({ orderNumber, total, onFinish }) {
  const { t } = useTranslation()

  return (
    <div className="confirmation-overlay" role="dialog" aria-modal="true">
      <div className="confirmation-modal">
        {/* Ícono de éxito animado */}
        <div className="success-icon-container">
          <div className="success-circle-pulse" />
          <svg
            className="success-checkmark"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <span className="confirmation-badge">{t('confirmation.badge')}</span>
        <h2 className="confirmation-title">{t('confirmation.title')}</h2>
        <p className="confirmation-desc">{t('confirmation.description')}</p>

        {/* Detalles del pedido */}
        <div className="confirmation-details-box">
          <div className="detail-item">
            <span className="detail-label">{t('confirmation.orderNumber')}:</span>
            <span className="detail-value">#{orderNumber}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">{t('cart.total')}:</span>
            <span className="detail-value total-highlight">${total.toFixed(2)}</span>
          </div>
          <div className="detail-pickup">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pickup-icon"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{t('confirmation.pickupDetails')}</span>
          </div>
        </div>

        {/* Botón de acción */}
        <button
          type="button"
          className="btn-back-catalog"
          onClick={onFinish}
        >
          {t('confirmation.backToCatalog')}
        </button>
      </div>
    </div>
  )
}

export default PaymentConfirmation

