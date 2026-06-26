import { CTASection } from "@/components/cta-section"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { CitiesGridSection } from "@/features/city/public/components/cities-grid"
import { FeaturedCities } from "@/features/city/public/components/featured-cities"
import { fetchAllCitySlugs } from "@/features/city/public/lib/fetch"
import { destinationSearchParamsCache } from "@/features/city/public/search-params"
import { FeaturedDestinations } from "@/features/destination/public/components/featured-destinations"
import { HeroSection, WhyTurkey } from "@/features/destinations"
import {
  citiesItemListJsonLd,
  destinationsBreadcrumbJsonLd,
} from "@/features/destinations/lib/structured-data"
import type { Metadata } from "next"
import type { SearchParams } from "nuqs/server"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sultanatexplore.com"

type Props = {
  searchParams: Promise<SearchParams>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category } = await destinationSearchParamsCache.parse(searchParams)
  const hasFilters = Boolean(category)

  return {
    title: "Destinasi Wisata Turki",
    description:
      "Jelajahi destinasi wisata Turki terbaik: Istanbul, Cappadocia, Pamukkale, Antalya, Trabzon, dan lainnya. Temukan perjalanan impian Anda.",
    alternates: { canonical: "/destinations" },
    robots: hasFilters ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: "Destinasi Wisata Turki | SultanatExplore",
      description:
        "Jelajahi destinasi wisata Turki terbaik: Istanbul, Cappadocia, Pamukkale, Antalya, Trabzon, dan lainnya.",
      url: `${siteUrl}/destinations`,
      images: [
        {
          url: "/og/destinations.svg",
          width: 1200,
          height: 630,
          alt: "Destinasi Wisata Turki — SultanatExplore",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Destinasi Wisata Turki | SultanatExplore",
      description:
        "Jelajahi destinasi wisata Turki terbaik: Istanbul, Cappadocia, Pamukkale, Antalya, Trabzon, dan lainnya.",
    },
  }
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
