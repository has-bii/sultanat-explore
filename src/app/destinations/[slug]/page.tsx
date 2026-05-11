import { notFound } from "next/navigation"
import {
  getDestinationBySlug,
  destinations,
  getAttractionsByDestinationId,
} from "@/features/destinations/data"
import {
  DetailHero,
  AboutSection,
  GallerySection,
  RelatedTrips,
  OtherDestinations,
} from "@/features/destinations"
import { openTrips } from "@/features/open-trip/data"
import { CTASection } from "@/components/cta-section"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import type { Metadata } from "next"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const dest = getDestinationBySlug(slug)
  if (!dest) return {}
  return {
    title: `${dest.name} — Destinasi SultanatExplore`,
    description: `Jelajahi ${dest.name}: ${dest.tagline}. ${dest.highlights.join(", ")}.`,
    openGraph: {
      title: `${dest.name} — Destinasi SultanatExplore`,
      description: dest.tagline,
      images: [dest.image],
    },
  }
}

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params
  const dest = getDestinationBySlug(slug)
  if (!dest) notFound()

  // Related trips: match open trips whose destination includes this city name
  const relatedTrips = openTrips.filter((t) =>
    t.destination.toLowerCase().includes(dest.name.toLowerCase()),
  )

  return (
    <>
      {/* 1. Hero with cover image */}
      <DetailHero destination={dest} />

      {/* 2. About + Highlights */}
      <AboutSection destination={dest} />

      {/* 3. Gallery */}
      <GallerySection destination={dest} />

      {/* 4. Related Open Trips */}
      <RelatedTrips trips={relatedTrips} />

      {/* 5. Other Destinations */}
      <OtherDestinations destinations={destinations} currentSlug={slug} />

      {/* 6. CTA */}
      <CTASection />

      <FloatingWhatsApp />
    </>
  )
}
