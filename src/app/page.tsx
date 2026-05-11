import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import {
  AboutSection,
  CtaSection,
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
      <CtaSection />
      <FloatingWhatsApp />
    </>
  )
}
