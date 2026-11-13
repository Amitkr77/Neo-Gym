import HeroSection from './HeroSection'
import Navbar from './Navbar'
import AboutUs from './AboutUs'
import Classes from './Classes'
import Services from './Services'
import Process from './Process'
import CTA from './CTA'
import Footer from './Footer'

export default function Home() {
  return (
    <>
      <Navbar overlay />
      <main>
        <HeroSection />
        <AboutUs />
        <Classes />
        <Services />
        <Process />
        {/* Testimonials hidden until real member reviews (with consent) are available: AUDIT_REPORT CT-02.
            Restore with: import Testimonials from './Testinomials' and <Testimonials /> */}
        <CTA />
      </main>
      <Footer />
    </>
  )
}
