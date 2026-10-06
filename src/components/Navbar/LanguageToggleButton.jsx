import { motion, AnimatePresence } from 'framer-motion'
import flagSpain from '../../assets/emojione--flag-for-spain.svg'
import flagUS from '../../assets/emojione--flag-for-united-states.svg'
import './LanguageToggleButton.css'

function LanguageToggleButton({ currentLang, onToggle, className = '' }) {
  const isSpanish = currentLang.startsWith('es')

  return (
    <button
      type="button"
      className={`lang-toggle-btn-skiper ${className}`}
      onClick={onToggle}
      aria-label={`Cambiar idioma. Idioma actual: ${isSpanish ? 'Español' : 'English'}`}
      title={isSpanish ? 'Switch to English' : 'Cambiar a Español'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isSpanish ? 'es' : 'en'}
          className="lang-flag-wrapper"
          initial={{ rotateY: -90, opacity: 0, scale: 0.8 }}
          animate={{ rotateY: 0, opacity: 1, scale: 1 }}
          exit={{ rotateY: 90, opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.28, ease: 'easeInOut' }}
        >
          <img
            src={isSpanish ? flagSpain : flagUS}
            alt={isSpanish ? 'Bandera de España' : 'United States flag'}
            className="lang-flag-img"
          />
        </motion.div>
      </AnimatePresence>
    </button>
  )
}

export default LanguageToggleButton

