import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react"

import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { renderArticleContent } from "@/features/article/public/lib/render-content"
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}
import { InclusionSection } from "@/features/open-trip/public/inclusion-section"
import { ItinerarySection } from "@/features/open-trip/public/itinerary-section"
import { computeDuration, fetchOpenTripBySlug } from "@/features/open-trip/public/lib/fetch"
import type { JSONContent } from "@tiptap/core"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const trip = await fetchOpenTripBySlug(slug)
  if (!trip) return {}
  return {
    title: `${trip.title} — Open Trip SultanatExplore`,
    description: trip.excerpt,
  }
}

export default async function OpenTripDetailPage({ params }: Props) {
  const { slug } = await params
  const trip = await fetchOpenTripBySlug(slug)
  if (!trip) notFound()

  const duration = computeDuration(trip.startAt, trip.endAt)
  const destinations = trip.cities.map((c) => c.city.name).join(", ")
  const descriptionHtml = renderArticleContent(trip.description as JSONContent)

  return (
    <>
      {/* Header */}
      <section className="relative">
        <div className="relative h-[40vh] min-h-[320px] overflow-hidden lg:h-[50vh]">
          <Image
            fill
            src={trip.coverImage.url}
            alt={trip.coverImage.alt ?? trip.title}
            className="object-cover"
            sizes="100vw"
          />
          <div className="from-background via-background/60 absolute inset-0 bg-linear-to-t to-transparent" />
        </div>

        <div className="absolute right-0 bottom-0 left-0">
          <div className="mx-auto max-w-6xl px-6 pb-8 lg:px-8">
            <Link
              href="/open-trip"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Open Trip
            </Link>

            <h1 className="font-heading mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {trip.title}
            </h1>

            <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5">
                <MapPin className="text-primary h-4 w-4" />
                {destinations}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="text-primary h-4 w-4" />
                {formatDate(trip.startAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="text-primary h-4 w-4" />
                {duration}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl space-y-16 px-6 py-16 lg:px-8 lg:py-20">
        {descriptionHtml && (
          <div className="prose-article" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
        )}
        <ItinerarySection cities={trip.cities} />
        <InclusionSection
          inclusions={trip.inclusions}
          title={trip.title}
          price={trip.price}
          startAt={trip.startAt}
          endAt={trip.endAt}
        />
      </section>

      <FloatingWhatsApp />
    </>
  )
}
