import { useTranslation } from 'react-i18next'
import './AboutUs.css'

function AboutUs() {
  const { t } = useTranslation()

  return (
    <section className="about-us-container" id="about-us" aria-labelledby="about-us-title">
      <div className="about-us-content">
        <header className="about-us-header">
          <span className="about-us-badge">{t('about.badge', 'Nuestra Esencia')}</span>
          <h2 id="about-us-title" className="about-us-title">
            {t('about.title', 'Bienvenido a Paradise Nursery')}
          </h2>
          <p className="about-us-subtitle">
            {t(
              'about.subtitle',
              'Donde la serenidad de la naturaleza se funde con el diseño de tus espacios.',
            )}
          </p>
        </header>

        <div className="about-us-text-grid">
          <div className="about-us-card">
            <div className="about-card-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
            <h3>{t('about.missionTitle', 'Nuestra Misión')}</h3>
            <p>
              {t(
                'about.missionText',
                'En Paradise Nursery nos apasiona transformar hogares, oficinas y rincones cotidianos en auténticos santuarios verdes. Seleccionamos cuidadosamente cada ejemplar botánico para garantizar vitalidad, durabilidad y armonía visual.',
              )}
            </p>
          </div>

          <div className="about-us-card">
            <div className="about-card-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22v-7" />
                <path d="M9 15c-3-1-5.5-3.5-5.5-6.5C3.5 5 6.5 2 12 2c5.5 0 8.5 3 8.5 6.5 0 3-2.5 5.5-5.5 6.5" />
                <path d="M9 12c1.5 1 3 1.5 3 3" />
                <path d="M15 12c-1.5 1-3 1.5-3 3" />
              </svg>
            </div>
            <h3>{t('about.passionTitle', 'Pasión Botánica')}</h3>
            <p>
              {t(
                'about.passionText',
                'Creemos firmemente en el poder revitalizante de las plantas: desde purificar el aire que respiramos hasta aliviar el estrés diario. Nuestro equipo de apasionados botánicos asesora cada paso para que tu conexión con la naturaleza prospere sin esfuerzo.',
              )}
            </p>
          </div>

          <div className="about-us-card">
            <div className="about-card-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 20h10" />
                <path d="M10 20c0-4 1-7 2-10" />
                <path d="M12 10c2-2.5 5-3 8-3-1 3-2 6-4.5 7.5" />
                <path d="M12 14c-2-1.5-4-2-6-2 .8 2 1.8 4 3.5 5" />
              </svg>
            </div>
            <h3>{t('about.qualityTitle', 'Compromiso y Sostenibilidad')}</h3>
            <p>
              {t(
                'about.qualityText',
                'Cultivamos con prácticas respetuosas del medio ambiente, asegurando que cada planta de interior, suculenta o aromática llegue a tus manos en su máximo esplendor, acompañada de los mejores cuidados expertos.',
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs

