import { CTASection } from "@/components/cta-section"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { FeaturedCities } from "@/features/destination/public/components/featured-cities"
import {
  DestinationsGrid,
  FeaturedAttractions,
  HeroSection,
  WhyTurkey,
} from "@/features/destinations"
import { SocialProofBar } from "@/features/open-trip/components/social-proof-bar"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Destinasi Wisata Turki — SultanatExplore",
  description:
    "Jelajahi 11 destinasi wisata Turki terbaik: Istanbul, Cappadocia, Pamukkale, Antalya, Trabzon, dan lainnya. Temukan perjalanan impian Anda.",
}

export default function DestinasiPage() {
  return (
    <>
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Featured Cities */}
      <FeaturedCities />

      {/* 3. All Destinations Grid (by category) */}
      <DestinationsGrid />

      {/* 4. Featured Attractions */}
      <FeaturedAttractions />

      {/* 5. Why Turkey */}
      <WhyTurkey />

      {/* 6. Social Proof */}
      <SocialProofBar />

      {/* 7. CTA */}
      <CTASection />

      <FloatingWhatsApp />
    </>
  )
}
