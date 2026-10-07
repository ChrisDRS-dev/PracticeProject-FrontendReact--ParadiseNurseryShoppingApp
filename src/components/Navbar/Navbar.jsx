import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import ThemeToggleButton3 from './ThemeToggleButton3'
import LanguageToggleButton from './LanguageToggleButton'
import logoLight from '../../assets/LOGO--plants-and-animals-svgrepo-com.svg'
import logoDark from '../../assets/LOGO--plants-and-animals-svgrepo-com--dark.svg'
import cartIconLight from '../../assets/el--shopping-cart-sign.svg'
import cartIconDark from '../../assets/el--shopping-cart-sign--dark.svg'
import './Navbar.css'

function Navbar({
  currentPage,
  onNavigate,
  cartTotalCount,
  theme,
  onToggleTheme,
}) {
  const { t, i18n } = useTranslation()
  const reduxCartItems = useSelector((state) => state?.cart?.items || [])
  const reduxCount = reduxCartItems.reduce((acc, item) => acc + item.quantity, 0)
  const effectiveCartCount =
    typeof cartTotalCount === 'number' ? cartTotalCount : reduxCount

  const isDark = theme === 'dark'
  const logoSrc = isDark ? logoDark : logoLight
  const cartIconSrc = isDark ? cartIconDark : cartIconLight

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)



  const currentLang = i18n.language.startsWith('es') ? 'es' : 'en'

  const toggleLanguage = () => {
    const nextLang = currentLang === 'es' ? 'en' : 'es'
    i18n.changeLanguage(nextLang)
  }

  // Prevenir scroll de fondo cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const handleNavClick = (page) => {
    onNavigate(page)
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <header className="navbar-header">
        <nav className="navbar-container" aria-label="Navegación principal">
          {/* Botón Hamburguesa (Mobile & Tablet) */}
          <div className="navbar-mobile-toggle">
            <button
              type="button"
              className="hamburger-btn"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="hamburger-icon"
              >
                {isMobileMenuOpen ? (
                  <path d="M18 6 6 18M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Brand Logo */}
          <button
            type="button"
            className="navbar-brand-btn"
            onClick={() => handleNavClick('landing')}
          >
            <img
              src={logoSrc}
              alt=""
              className="navbar-brand-logo-img"
              aria-hidden="true"
            />
            <span className="navbar-brand-name">{t('nav.brand')}</span>
          </button>

          {/* Links para Desktop */}
          <ul className="navbar-desktop-links">
            <li>
              <button
                type="button"
                className={`nav-link-btn ${currentPage === 'landing' ? 'active' : ''}`}
                onClick={() => handleNavClick('landing')}
              >
                {t('nav.home')}
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-link-btn ${currentPage === 'catalog' ? 'active' : ''}`}
                onClick={() => handleNavClick('catalog')}
              >
                {t('nav.plants')}
              </button>
            </li>
          </ul>

          {/* Acciones: Toggles Skiper UI & Carrito */}
          <div className="navbar-actions">
            {/* Toggle de Tema: Skiper UI ThemeToggleButton3 */}
            <ThemeToggleButton3
              isDark={theme === 'dark'}
              onToggle={onToggleTheme}
            />

            {/* Toggle de Idioma con banderas animadas */}
            <LanguageToggleButton
              currentLang={currentLang}
              onToggle={toggleLanguage}
            />

            {/* Carrito de Compras con ícono de assets */}
            <button
              type="button"
              className={`navbar-cart-btn ${currentPage === 'cart' ? 'active' : ''}`}
              onClick={() => handleNavClick('cart')}
              aria-label={t('nav.cartAria')}
            >
              <img
                src={cartIconSrc}
                alt=""
                className="cart-asset-icon"
                aria-hidden="true"
              />
              <span className="cart-badge">{effectiveCartCount}</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Sidebar Desplegable para Móviles & Tablets */}
      <div
        className={`mobile-drawer-overlay ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden={!isMobileMenuOpen}
      >
        <aside
          className={`mobile-drawer-sidebar ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header del Sidebar */}
          <div className="drawer-header">
            <div className="drawer-brand">
              <img
                src={logoSrc}
                alt=""
                className="drawer-brand-logo-img"
                aria-hidden="true"
              />
              <span>{t('nav.brand')}</span>
            </div>

            <button
              type="button"
              className="drawer-close-btn"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Cerrar menú"
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

          {/* Enlaces de Navegación del Sidebar */}
          <nav className="drawer-nav">
            <ul className="drawer-nav-list">
              <li>
                <button
                  type="button"
                  className={`drawer-nav-item ${currentPage === 'landing' ? 'active' : ''}`}
                  onClick={() => handleNavClick('landing')}
                >
                  <span className="drawer-item-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </span>
                  <span>{t('nav.home')}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`drawer-nav-item ${currentPage === 'catalog' ? 'active' : ''}`}
                  onClick={() => handleNavClick('catalog')}
                >
                  <span className="drawer-item-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                    </svg>
                  </span>
                  <span>{t('nav.plants')}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`drawer-nav-item ${currentPage === 'cart' ? 'active' : ''}`}
                  onClick={() => handleNavClick('cart')}
                >
                  <span className="drawer-item-icon" aria-hidden="true">
                    <img src={cartIconSrc} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />
                  </span>
                  <span>{t('nav.cart')}</span>
                  {effectiveCartCount > 0 && (
                    <span className="drawer-cart-badge">{effectiveCartCount}</span>
                  )}
                </button>
              </li>
            </ul>
          </nav>

          {/* Footer del Sidebar con accesos rápidos */}
          <div className="drawer-footer">
            <div className="drawer-footer-controls">
              <div className="drawer-control-item">
                <span className="drawer-control-label">
                  {theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}
                </span>
                <ThemeToggleButton3
                  isDark={theme === 'dark'}
                  onToggle={onToggleTheme}
                />
              </div>

              <div className="drawer-control-item">
                <span className="drawer-control-label">
                  {currentLang === 'es' ? 'Español' : 'English'}
                </span>
                <LanguageToggleButton
                  currentLang={currentLang}
                  onToggle={toggleLanguage}
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}

export default Navbar
