import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { InclusionSection, ItinerarySection } from "@/features/open-trip"
import { formatDate, formatPrice, getTripBySlug, openTrips } from "@/features/open-trip/data"
import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return openTrips.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const trip = getTripBySlug(slug)
  if (!trip) return {}
  return {
    title: `${trip.name} — Open Trip SultanatExplore`,
    description: `Open trip ${trip.name} ${trip.duration}, mulai ${formatPrice(trip.price)}/orang. Keberangkatan ${formatDate(trip.departureDate)}.`,
  }
}

export default async function OpenTripDetailPage({ params }: Props) {
  const { slug } = await params
  const trip = getTripBySlug(slug)
  if (!trip) notFound()

  return (
    <>
      {/* Header */}
      <section className="relative">
        <div className="relative h-[40vh] min-h-[320px] overflow-hidden lg:h-[50vh]">
          <Image fill src={trip.image} alt={trip.name} className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-auto max-w-6xl px-6 lg:px-8 pb-8">
            <Link
              href="/open-trip"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Open Trip
            </Link>

            <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {trip.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                {trip.destination}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" />
                {formatDate(trip.departureDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                {trip.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-primary" />
                {trip.availableSeats}/{trip.totalSeats} kursi
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-6 lg:px-8 py-16 lg:py-20 space-y-16">
        <ItinerarySection itinerary={trip.itinerary} />
        <InclusionSection trip={trip} />
      </section>

      <FloatingWhatsApp />
    </>
  )
}
