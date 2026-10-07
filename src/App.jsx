import { useState, useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import LandingPage from './pages/LandingPage/LandingPage'
import ProductList from './pages/ProductList/ProductList'
import CartItem from './components/Cart/CartItem'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('landing') // 'landing' | 'catalog' | 'cart'
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  // Navegación fluida con scroll suave hacia arriba
  const handleNavigate = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-container">
      {/* 7. Navbar global visible en Product Listing y Cart (Tasks 6.7, 6.8) */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Página de Inicio / Landing con Hero, Nombre de Compañía, Botón Get Started y AboutUs (Tasks 2, 3, 4) */}
      {currentPage === 'landing' && (
        <LandingPage onNavigate={handleNavigate} />
      )}

      {/* Página de Catálogo de Productos (Task 6) */}
      {currentPage === 'catalog' && (
        <ProductList onNavigate={handleNavigate} />
      )}

      {/* Página del Carrito de Compras (Task 7) */}
      {currentPage === 'cart' && (
        <CartItem
          onNavigate={handleNavigate}
          onContinueShopping={() => handleNavigate('catalog')}
        />
      )}

      {/* Footer interactivo con animación Motion y enlaces de navegación */}
      <Footer onNavigate={handleNavigate} />
    </div>
  )
}

export default App
