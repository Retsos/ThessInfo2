import { CTASection } from './components/home/cta-section'
import { FAQSection } from './components/home/faq-section'
import { FeatureGrid } from  './components/home/feature-grid'
import { HeroSection } from   './components/home/hero-section'
import { AreaPreviewSection } from './components/home/preview-section'
import { RevealSection } from './components/home/reveal-section'
import { TrustSection } from './components/home/trust-section'

export default function HomePage() {
  return (
    <div className="overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#f7fdfd_38%,#ffffff_100%)]">
      <RevealSection>
        <HeroSection />
      </RevealSection>
      <RevealSection delay={0.05}>
        <FeatureGrid />
      </RevealSection>
      <RevealSection delay={0.1}>
        <AreaPreviewSection />
      </RevealSection>
      <RevealSection delay={0.15}>
        <TrustSection />
      </RevealSection>
      <RevealSection delay={0.2}>
        <FAQSection />
      </RevealSection>
      <RevealSection delay={0.25}>
        <CTASection />
      </RevealSection>
    </div>
  )
}
