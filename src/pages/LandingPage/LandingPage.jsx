import Hero from '../../components/Hero/Hero'
import AboutUs from '../../components/AboutUs/AboutUs'

function LandingPage({ onNavigate, companyName, ctaLabel }) {
  return (
    <main className="landing-page" aria-label={companyName} data-cta-label={ctaLabel}>
      <div className="landing-hero-wrapper">
        <Hero onGetStarted={() => onNavigate('catalog')} companyName={companyName} ctaLabel={ctaLabel} />
      </div>
      <AboutUs />
    </main>
  )
}

export default LandingPage
