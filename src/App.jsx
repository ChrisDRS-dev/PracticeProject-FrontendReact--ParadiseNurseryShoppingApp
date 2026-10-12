import { useEffect, useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import LandingPage from './pages/LandingPage/LandingPage'
import ProductList from './pages/ProductList/ProductList'
import CartItem from './components/Cart/CartItem'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const handleNavigate = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleToggleTheme = () => {
    setTheme((previousTheme) => (previousTheme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className="app-container">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Coursera Task 4: Landing page with Paradise Nursery and Get Started. */}
      {currentPage === 'landing' && (
        <LandingPage
          onNavigate={handleNavigate}
          companyName="Paradise Nursery"
          ctaLabel="Get Started"
        />
      )}

      {currentPage === 'catalog' && <ProductList onNavigate={handleNavigate} />}

      {currentPage === 'cart' && (
        <CartItem
          onNavigate={handleNavigate}
          onContinueShopping={() => handleNavigate('catalog')}
        />
      )}

      <Footer onNavigate={handleNavigate} />
    </div>
  )
}

export default App
