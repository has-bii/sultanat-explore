import { CTASection } from "@/components/cta-section"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { CitiesGridSection } from "@/features/city/public/components/cities-grid"
import { FeaturedCities } from "@/features/city/public/components/featured-cities"
import { FeaturedDestinations } from "@/features/destination/public/components/featured-destinations"
import { HeroSection, WhyTurkey } from "@/features/destinations"
import type { Metadata } from "next"
import type { SearchParams } from "nuqs/server"

export const metadata: Metadata = {
  title: "Destinasi Wisata Turki — SultanatExplore",
  description:
    "Jelajahi destinasi wisata Turki terbaik: Istanbul, Cappadocia, Pamukkale, Antalya, Trabzon, dan lainnya. Temukan perjalanan impian Anda.",
}

type Props = {
  searchParams: Promise<SearchParams>
}

export default function DestinasiPage({ searchParams }: Props) {
  return (
    <>
      <HeroSection />
      <FeaturedCities />
      <CitiesGridSection searchParams={searchParams} />
      <FeaturedDestinations />
      <WhyTurkey />
      <CTASection />
      <FloatingWhatsApp />
    </>
  )
}
