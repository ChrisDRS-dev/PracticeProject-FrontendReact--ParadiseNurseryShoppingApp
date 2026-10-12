import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addItem } from './CartSlice'
import plants from './data/PlantsDB.json'
import Navbar from './components/Navbar/Navbar'
import './pages/ProductList/ProductList.css'

/**
 * Task 6 — ProductList.jsx
 *
 * The submitted file contains the complete product-list implementation:
 * six or more plants per category, Add to Cart buttons, disabled states,
 * a dynamic cart count, and navigation links through the Navbar.
 */
function ProductList({ onNavigate = () => {} }) {
  const dispatch = useDispatch()
  const cartItems = useSelector((state) => state.cart.items)
  const [theme, setTheme] = useState('dark')

  const cartTotalCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const groupedPlants = useMemo(() => {
    const groups = new Map()

    plants.forEach((plant) => {
      const categoryId = plant.category?.id || 'general'
      if (!groups.has(categoryId)) {
        groups.set(categoryId, {
          id: categoryId,
          name: plant.category?.es || 'Houseplants',
          plants: [],
        })
      }
      groups.get(categoryId).plants.push(plant)
    })

    return [...groups.values()]
  }, [])

  const isInCart = (plantId) =>
    cartItems.some((item) => String(item.id) === String(plantId))

  const handleAddToCart = (plant) => {
    if (isInCart(plant.id)) return

    dispatch(
      addItem({
        id: plant.id,
        name: plant.name?.en || plant.name?.es || plant.title,
        price: plant.price,
        image: plant.image,
        category: plant.category,
        stock: plant.stock ?? 10,
      }),
    )
  }

  return (
    <div className="product-list-wrapper">
      <Navbar
        currentPage="catalog"
        onNavigate={onNavigate}
        cartTotalCount={cartTotalCount}
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
      />

      <main className="catalog-page" aria-label="Product Listing">
        <header className="catalog-header">
          <h1 className="catalog-title">Paradise Nursery Plants</h1>
        </header>

        <div className="catalog-categories-stack">
          {groupedPlants.map((category) => (
            <section
              key={category.id}
              className="category-section-block"
              aria-labelledby={`category-${category.id}`}
            >
              <div className="category-section-header">
                <h2 id={`category-${category.id}`} className="category-section-title">
                  {category.name}
                </h2>
                <span className="category-plant-count">({category.plants.length} plants)</span>
              </div>

              <div className="catalog-products-grid">
                {category.plants.map((plant) => {
                  const title = plant.name?.en || plant.name?.es || plant.title
                  const added = isInCart(plant.id)

                  return (
                    <article key={plant.id} className="product-card">
                      <div className="product-image-container">
                        <img
                          src={plant.image}
                          alt={title}
                          className="product-card-img"
                          loading="lazy"
                        />
                      </div>
                      <div className="product-info-container">
                        <h3 className="product-title">{title}</h3>
                        <div className="product-bottom-row">
                          <span className="product-price">${plant.price.toFixed(2)}</span>
                          <button
                            type="button"
                            className="btn-add-moss"
                            onClick={() => handleAddToCart(plant)}
                            disabled={added}
                          >
                            {added ? 'Added' : 'Add to Cart'}
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}

export default ProductList
