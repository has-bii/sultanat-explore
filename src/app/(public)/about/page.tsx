import { CTASection } from "@/components/cta-section"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import {
  AboutHero,
  AboutTestimonials,
  CompanyStory,
  TeamSection,
  ValuesSection,
  WhyTurkey,
} from "@/features/about-us"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tentang Kami — SultanatExplore",
  description:
    "Cerita di balik SultanatExplore — travel agent berbasis Turki untuk traveler Indonesia. Tim profesional, jaringan lokal kuat, layanan halal-first.",
}

export default function AboutPage() {
  return (
    <>
      {/* 1. Hero */}
      <AboutHero />

      {/* 2. Company Story */}
      <CompanyStory />

      {/* 3. Why Turkey-Based */}
      <WhyTurkey />

      {/* 4. Team */}
      <TeamSection />

      {/* 5. Values */}
      <ValuesSection />

      {/* 6. Testimonials */}
      <AboutTestimonials />

      {/* 7. CTA */}
      <CTASection />

      <FloatingWhatsApp />
    </>
  )
}
