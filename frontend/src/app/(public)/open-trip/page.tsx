import { Plane } from "lucide-react"

import { CTASection } from "@/components/cta-section"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { HowItWorks } from "@/features/open-trip/public/how-it-works"
import { OpenTripExplanationA as OpenTripExplanation } from "@/features/open-trip/public/open-trip-explanation"
import { PastTripGallery } from "@/features/open-trip/public/past-trip-gallery"
import { TripList } from "@/features/open-trip/public/trip-list"
import { WhyUs } from "@/features/open-trip/public/why-us"
import { openTrips } from "@/features/open-trip/data"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Open Trip Turki — SultanatExplore",
  description:
    "Bergabung dengan open trip ke Turki bersama traveler Indonesia. Jadwal tetap, harga terjangkau, all-inclusive. Istanbul, Cappadocia, Pamukkale, dan lainnya.",
}

export default async function OpenTripPage() {
  return (
    <>
      <section className="bg-background relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 opacity-50">
          <div className="bg-primary/5 absolute top-20 left-10 h-64 w-64 rounded-full blur-3xl" />
          <div className="bg-primary/8 absolute right-20 bottom-10 h-48 w-48 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 text-center lg:px-8">
          <div className="bg-background/80 mx-auto inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm backdrop-blur-sm">
            <Plane className="text-primary h-4 w-4" />
            <span className="font-medium">Open Trip 2026</span>
          </div>
          <h1 className="font-heading mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Jelajahi Turki
            <br />
            <span className="text-primary">Bersama Kami</span>
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
            Pilih trip impian Anda dan bergabunglah dengan traveler Indonesia lainnya. Semua sudah
            kami atur — tinggal berangkat!
          </p>
        </div>
      </section>

      <OpenTripExplanation />

      <HowItWorks />

      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-tight">Trip Tersedia</h2>
            <p className="text-muted-foreground mt-1 text-sm">{openTrips.length} trip tersedia</p>
          </div>
          <div className="mt-8">
            <TripList trips={openTrips} />
          </div>
        </div>
      </section>

      <PastTripGallery />

      <WhyUs />

      <CTASection />

      <FloatingWhatsApp />
    </>
  )
}
