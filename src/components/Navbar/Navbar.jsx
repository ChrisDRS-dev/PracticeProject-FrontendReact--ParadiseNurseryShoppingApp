import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ThemeToggleButton3 from './ThemeToggleButton3'
import LanguageToggleButton from './LanguageToggleButton'
import cartIcon from '../../assets/el--shopping-cart-sign.svg'
import './Navbar.css'

function Navbar({
  currentPage,
  onNavigate,
  cartTotalCount,
  theme,
  onToggleTheme,
}) {
  const { t, i18n } = useTranslation()
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
            <svg
              className="navbar-brand-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 20h10" />
              <path d="M10 20c0-5 3-7 6-8" />
              <path d="M4 14c4.5 0 7-3 8-7C8 7 5.5 9.5 4 14z" />
              <path d="M12 12c1.5-3.5 4-5.5 8-6-1 4.5-3.5 7-8 6z" />
            </svg>
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
                src={cartIcon}
                alt=""
                className="cart-asset-icon"
                aria-hidden="true"
              />
              <span className="cart-badge">{cartTotalCount}</span>
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
              <svg
                className="navbar-brand-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7 20h10" />
                <path d="M10 20c0-5 3-7 6-8" />
                <path d="M4 14c4.5 0 7-3 8-7C8 7 5.5 9.5 4 14z" />
                <path d="M12 12c1.5-3.5 4-5.5 8-6-1 4.5-3.5 7-8 6z" />
              </svg>
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
                  <span className="drawer-item-icon">🌱</span>
                  <span>{t('nav.home')}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`drawer-nav-item ${currentPage === 'catalog' ? 'active' : ''}`}
                  onClick={() => handleNavClick('catalog')}
                >
                  <span className="drawer-item-icon">🪴</span>
                  <span>{t('nav.plants')}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`drawer-nav-item ${currentPage === 'cart' ? 'active' : ''}`}
                  onClick={() => handleNavClick('cart')}
                >
                  <span className="drawer-item-icon">🛒</span>
                  <span>{t('nav.cart')}</span>
                  {cartTotalCount > 0 && (
                    <span className="drawer-cart-badge">{cartTotalCount}</span>
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
