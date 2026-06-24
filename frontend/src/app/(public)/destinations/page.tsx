import { CTASection } from "@/components/cta-section"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { fetchAllCitySlugs } from "@/features/city/public/lib/fetch"
import { CitiesGridSection } from "@/features/city/public/components/cities-grid"
import { FeaturedCities } from "@/features/city/public/components/featured-cities"
import { FeaturedDestinations } from "@/features/destination/public/components/featured-destinations"
import { HeroSection, WhyTurkey } from "@/features/destinations"
import {
  citiesItemListJsonLd,
  destinationsBreadcrumbJsonLd,
} from "@/features/destinations/lib/structured-data"
import type { Metadata } from "next"
import type { SearchParams } from "nuqs/server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Destinasi Wisata Turki",
  description:
    "Jelajahi destinasi wisata Turki terbaik: Istanbul, Cappadocia, Pamukkale, Antalya, Trabzon, dan lainnya. Temukan perjalanan impian Anda.",
}

type Props = {
  searchParams: Promise<SearchParams>
}

export default async function DestinasiPage({ searchParams }: Props) {
  const cities = await fetchAllCitySlugs()
  const breadcrumbLd = destinationsBreadcrumbJsonLd()
  const itemListLd = citiesItemListJsonLd(cities)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
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
