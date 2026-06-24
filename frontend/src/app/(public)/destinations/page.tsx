import { CTASection } from "@/components/cta-section"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { CitiesGridSection } from "@/features/city/public/components/cities-grid"
import { FeaturedCities } from "@/features/city/public/components/featured-cities"
import { FeaturedAttractions, HeroSection, WhyTurkey } from "@/features/destinations"
import { SocialProofBar } from "@/features/open-trip/components/social-proof-bar"
import type { Metadata } from "next"
import type { SearchParams } from "nuqs/server"

export const metadata: Metadata = {
  title: "Destinasi Wisata Turki — SultanatExplore",
  description:
    "Jelajahi 11 destinasi wisata Turki terbaik: Istanbul, Cappadocia, Pamukkale, Antalya, Trabzon, dan lainnya. Temukan perjalanan impian Anda.",
}

type Props = {
  searchParams: Promise<SearchParams>
}

export default function DestinasiPage({ searchParams }: Props) {
  return (
    <>
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Featured Cities */}
      <FeaturedCities />

      {/* 3. All Cities Grid (by category) */}
      <CitiesGridSection searchParams={searchParams} />

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
