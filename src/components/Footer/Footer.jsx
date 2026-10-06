import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SocialCloud } from './SocialCloud'
import './Footer.css'

const ParadiseLogo = ({ className = '' }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 64 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M0 20.1032L39.8387 20.1032C44.7808 20.1032 48.7871 24.1095 48.7871 29.0516C48.7871 33.9937 44.7808 38 39.8387 38L1.56459e-06 38L0 20.1032Z"
        fill="currentColor"
      />
      <path
        d="M63.4968 17.8968L23.6581 17.8968C18.716 17.8968 14.7097 13.8904 14.7097 8.94839C14.7097 4.00633 18.716 0 23.6581 0L63.4968 0V17.8968Z"
        fill="currentColor"
      />
    </svg>
  )
}

function Footer({ onNavigate }) {
  const { t } = useTranslation()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
      },
    },
  }

  const navItems = [
    { id: 'home', label: t('footer.links.home'), action: () => onNavigate && onNavigate('landing') },
    { id: 'plants', label: t('footer.links.plants'), action: () => onNavigate && onNavigate('catalog') },
    { id: 'about', label: t('footer.links.about'), action: null },
    { id: 'blog', label: t('footer.links.blog'), action: null },
    { id: 'terms', label: t('footer.links.terms'), action: null },
    { id: 'privacy', label: t('footer.links.privacy'), action: null },
  ]

  return (
    <footer className="footer-root">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '0px 0px -100px 0px' }}
        variants={containerVariants}
        className="footer-content-container"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="footer-logo-row">
          <button
            type="button"
            className="footer-brand-btn"
            onClick={() => onNavigate && onNavigate('landing')}
          >
            <ParadiseLogo className="footer-logo-svg" />
            <span className="footer-brand-text">Paradise Nursery</span>
          </button>
        </motion.div>

        {/* Navigation Links */}
        <motion.nav
          variants={itemVariants}
          className="footer-nav-links"
          aria-label="Navegación del pie de página"
        >
          {navItems.map((item) => (
            <motion.a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                if (item.action) {
                  e.preventDefault()
                  item.action()
                }
              }}
              className="footer-nav-anchor"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="footer-anchor-text">{item.label}</span>
              <motion.span
                className="footer-anchor-hover-pill"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            </motion.a>
          ))}
        </motion.nav>

        {/* Social Media Icons */}
        <motion.div variants={itemVariants} className="footer-social-wrapper">
          <SocialCloud />
        </motion.div>
      </motion.div>

      {/* Animated Patterned Divider */}
      <motion.div
        className="footer-pattern-divider"
        initial={{ backgroundPositionX: '0%' }}
        whileInView={{ backgroundPositionX: '100%' }}
        viewport={{ once: true }}
        transition={{
          ease: 'linear',
          duration: 20,
        }}
      />

      {/* Copyright */}
      <motion.div
        className="footer-copyright-wrapper"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={itemVariants}
      >
        <p className="footer-copyright-text">
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </p>
      </motion.div>
    </footer>
  )
}

export default Footer

