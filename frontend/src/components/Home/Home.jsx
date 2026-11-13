import { lazy, Suspense } from 'react'
import HeroSection from './HeroSection'
import Navbar from './Navbar'
import AboutUs from './AboutUs'
import Classes from './Classes'
import Services from './Services'
import Process from './Process'
import CTA from './CTA'
import Footer from './Footer'
import SceneBoundary from '../ui/SceneBoundary'
import CursorRing from '../ui/CursorRing'

// three.js + R3F are split into their own chunk so the member and auth pages never load them.
const GymScene = lazy(() => import('../three/GymScene'))

export default function Home() {
  return (
    <div className="relative isolate text-white">
      <div className="scene-backdrop fixed inset-0 -z-20" aria-hidden="true" />
      <SceneBoundary>
        <Suspense fallback={null}>
          <GymScene />
        </Suspense>
      </SceneBoundary>

      <div className="grain pointer-events-none fixed inset-0 z-[60]" aria-hidden="true" />
      <CursorRing />

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
    </div>
  )
}
