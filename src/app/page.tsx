import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { CTASection } from "@/components/cta-section"
import { FAQSection } from "@/components/faq-section"
import {
  AboutSection,
  DestinationsSection,
  HeroSection,
  ServicesSection,
  TestimonialsSection,
} from "@/features/homepage"

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <DestinationsSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <FloatingWhatsApp />
    </>
  )
}
