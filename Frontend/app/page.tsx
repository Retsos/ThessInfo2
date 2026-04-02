import { CTASection } from './components/home/cta-section'
import { FAQSection } from './components/home/faq-section'
import { FeatureGrid } from  './components/home/feature-grid'
import { HeroSection } from   './components/home/hero-section'
import { TrustSection } from './components/home/trust-section'

export default function HomePage() {
  return (
    <div className="overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#f7fdfd_38%,#ffffff_100%)]">
      <HeroSection />
      <FeatureGrid />
      <TrustSection />
      <FAQSection />
      <CTASection />
    </div>
  )
}