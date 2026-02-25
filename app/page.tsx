import Header from './components/Header'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import About from './components/About'
import Stats from './components/Stats'
import Services from './components/Services'
import CTA from './components/CTA'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <HowItWorks />
      <About />
      <Stats />
      <Services />
      <CTA />
      <Footer />
    </main>
  )
}
