import { CTASection } from "@/components/cta-section"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
// import { FAQSection } from "@/components/faq-section"
import {
  AboutSection,
  CitiesSection,
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
      <CitiesSection />
      <TestimonialsSection />
      {/* <FAQSection /> */}
      <CTASection />
      <FloatingWhatsApp />
    </>
  )
}
