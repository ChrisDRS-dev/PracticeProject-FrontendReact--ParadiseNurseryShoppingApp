import Hero from '../../components/Hero/Hero'
import AboutUs from '../../components/AboutUs/AboutUs'

function LandingPage({ onNavigate }) {
  return (
    <main className="landing-page">
      <div className="landing-hero-wrapper">
        <Hero onGetStarted={() => onNavigate('catalog')} />
      </div>
      <AboutUs />
    </main>
  )
}

export default LandingPage
