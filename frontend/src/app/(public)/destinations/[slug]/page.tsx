import { CTASection } from "@/components/cta-section"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { AboutSection } from "@/features/city/public/components/about-section"
import { DetailHero } from "@/features/city/public/components/detail-hero"
import { GallerySection } from "@/features/city/public/components/gallery-section"
import { OtherCities } from "@/features/city/public/components/other-cities"
import {
  fetchCityBySlug,
  fetchCityGallery,
  fetchRelatedCities,
} from "@/features/city/public/lib/fetch"
import { CityDestinations } from "@/features/destination/public/components/city-destinations"
import { fetchCityDestinations } from "@/features/destination/public/lib/fetch"
import { RelatedOpenTrips } from "@/features/open-trip/public/components/related-open-trips"
import { fetchOpenTripsByCitySlug } from "@/features/open-trip/public/lib/fetch"
import { notFound } from "next/navigation"

type Props = { params: Promise<{ slug: string }> }

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params
  const city = await fetchCityBySlug(slug)
  if (!city) notFound()

  const [gallery, relatedCities, destinations, openTrips] = await Promise.all([
    fetchCityGallery(city.id),
    fetchRelatedCities(slug),
    fetchCityDestinations(city.id),
    fetchOpenTripsByCitySlug(slug),
  ])

  return (
    <>
      {/* 1. Hero with cover image */}
      <DetailHero data={city} />

      {/* 2. About + Highlights */}
      <AboutSection data={city} />

      {/* 3. Gallery */}
      <GallerySection cityName={city.name} cityImage={city.image} data={gallery} />

      <CityDestinations data={destinations} />

      {/* 4. Related Open Trips */}
      <RelatedOpenTrips data={openTrips} cityName={city.name} />

      {/* 5. Other Destinations */}
      <OtherCities data={relatedCities} />

      {/* 6. CTA */}
      <CTASection />

      <FloatingWhatsApp />
    </>
  )
}
