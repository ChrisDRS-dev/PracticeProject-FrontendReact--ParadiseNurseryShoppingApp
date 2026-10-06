import { useState, useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import LandingPage from './pages/LandingPage/LandingPage'
import PlantCatalog from './pages/PlantCatalog/PlantCatalog'
import CartPage from './pages/Cart/CartPage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('landing') // 'landing' | 'catalog' | 'cart'
  const [cart, setCart] = useState([])
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  // Contador total de plantas para el badge del Navbar
  const cartTotalCount = cart.reduce((total, item) => total + item.quantity, 0)

  // Navegación fluida con scroll automático al inicio
  const handleNavigate = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Lógica del Carrito
  const handleAddToCart = (plant) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === plant.id)
      if (existing) {
        return prevCart.map((item) =>
          item.id === plant.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }
      return [
        ...prevCart,
        {
          id: plant.id,
          title: plant.title,
          price: plant.price,
          image: plant.image,
          category: plant.category,
          quantity: 1,
        },
      ]
    })
  }

  const handleUpdateQuantity = (plantId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === plantId) {
            const nextQty = item.quantity + delta
            return nextQty > 0 ? { ...item, quantity: nextQty } : null
          }
          return item
        })
        .filter(Boolean),
    )
  }

  const handleRemoveItem = (plantId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== plantId))
  }

  const handleClearCart = () => {
    setCart([])
  }

  return (
    <div className="app-container">
      {/* Navbar global */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartTotalCount={cartTotalCount}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Páginas */}
      {currentPage === 'landing' && (
        <LandingPage onNavigate={handleNavigate} />
      )}

      {currentPage === 'catalog' && (
        <PlantCatalog
          cart={cart}
          onAddToCart={handleAddToCart}
        />
      )}

      {currentPage === 'cart' && (
        <CartPage
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onNavigate={handleNavigate}
        />
      )}

      {/* Footer con animaciones motion y SocialCloud */}
      <Footer onNavigate={handleNavigate} />
    </div>
  )
}

export default App
