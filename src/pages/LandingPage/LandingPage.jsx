import Hero from '../../components/Hero/Hero'

function LandingPage({ onNavigate }) {
  return (
    <main className="landing-page">
      <Hero onGetStarted={() => onNavigate('catalog')} />
    </main>
  )
}

export default LandingPage
