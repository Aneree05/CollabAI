import About from '../components/landing/About'
import Features from '../components/landing/Features'
import Footer from '../components/landing/Footer'
import Hero from '../components/landing/Hero'
import Navbar from '../components/landing/Navbar'

const LandingPage = () => (
  <div className="min-h-screen bg-background text-text">
    <Navbar />
    <main>
      <Hero />
      <Features />
      <About />
    </main>
    <Footer />
  </div>
)

export default LandingPage
