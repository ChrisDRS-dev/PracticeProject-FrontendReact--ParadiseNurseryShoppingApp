import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import heroBackground from '../../assets/hero-background.png'
import heroFront from '../../assets/hero-front.png'
import heroLight from '../../assets/hero-light.png'
import './Hero.css'

function Hero({ onGetStarted }) {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const rafId = useRef(null)

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()

    // Normalizado de -1 a 1
    const rawX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const rawY = ((e.clientY - rect.top) / rect.height - 0.5) * 2

    // Sensibilidad muy baja para un movimiento ultra suave y ligero
    const x = Math.max(-1, Math.min(1, rawX))
    const y = Math.max(-1, Math.min(1, rawY))

    if (rafId.current) cancelAnimationFrame(rafId.current)
    rafId.current = requestAnimationFrame(() => {
      if (containerRef.current) {
        containerRef.current.style.setProperty('--mx', x.toFixed(3))
        containerRef.current.style.setProperty('--my', y.toFixed(3))
      }
    })
  }

  const handleMouseLeave = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current)
    if (containerRef.current) {
      containerRef.current.style.setProperty('--mx', '0')
      containerRef.current.style.setProperty('--my', '0')
    }
  }

  return (
    <section
      ref={containerRef}
      className="hero-section"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Presentación principal"
      style={{ '--mx': '0', '--my': '0' }}
    >
      {/* Capa 1: Fondo de plantas */}
      <div className="hero-layer hero-layer-bg">
        <img
          src={heroBackground}
          alt="Plantas y naturaleza de fondo"
          className="hero-image"
          fetchPriority="high"
        />
      </div>

      {/* Capa 2: Iluminación ambiental */}
      <div className="hero-layer hero-layer-light">
        <img
          src={heroLight}
          alt=""
          aria-hidden="true"
          className="hero-image"
        />
      </div>

      {/* Capa 3: Contenido textual (Título, Subtítulo, Descripción y Botón) */}
      <div className="hero-content">
        <div className="hero-text-wrapper">
          <h1 className="hero-title">{t('hero.title')}</h1>
          <h2 className="hero-subtitle">
            <em>{t('hero.subtitle')}</em>
          </h2>
          <p className="hero-description">{t('hero.description')}</p>
          <div className="hero-action">
            <button
              type="button"
              className="hero-cta-btn"
              onClick={onGetStarted}
            >
              <span>{t('hero.getStarted')}</span>
              <svg
                className="hero-btn-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Capa 4: Plantas en primer plano (superpuestas al texto) */}
      <div className="hero-layer hero-layer-front">
        <img
          src={heroFront}
          alt=""
          aria-hidden="true"
          className="hero-image"
        />
      </div>

      {/* Capa 5: Overlay inferior suave */}
      <div className="hero-gradient-bottom" aria-hidden="true" />
    </section>
  )
}

export default Hero
