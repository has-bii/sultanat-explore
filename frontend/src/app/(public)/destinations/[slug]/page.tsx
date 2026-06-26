import { CTASection } from "@/components/cta-section"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { fetchCityBySlug, fetchCityGallery } from "@/features/city/public/lib/fetch"
import {
  AboutSection,
  DetailHero,
  GallerySection,
  OtherDestinations,
} from "@/features/destinations"
import { destinations } from "@/features/destinations/data"
import { notFound } from "next/navigation"

type Props = { params: Promise<{ slug: string }> }

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params
  const city = await fetchCityBySlug(slug)
  if (!city) notFound()

  const gallery = await fetchCityGallery(city.id)

  return (
    <>
      {/* 1. Hero with cover image */}
      <DetailHero data={city} />

      {/* 2. About + Highlights */}
      <AboutSection data={city} />

      {/* 3. Gallery */}
      <GallerySection cityName={city.name} data={gallery} />

      {/* 4. Related Open Trips */}
      {/* <RelatedTrips trips={relatedTrips} /> */}

      {/* 5. Other Destinations */}
      <OtherDestinations destinations={destinations} currentSlug={slug} />

      {/* 6. CTA */}
      <CTASection />

      <FloatingWhatsApp />
    </>
  )
}
