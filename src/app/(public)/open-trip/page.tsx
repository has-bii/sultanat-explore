import { CTASection } from "@/components/cta-section"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import {
  HowItWorks,
  OpenTripExplanation,
  PastTripGallery,
  SocialProofBar,
  TripList,
  WhyUs,
} from "@/features/open-trip"
import { openTrips } from "@/features/open-trip/data"
import { Plane } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Open Trip Turki — SultanatExplore",
  description:
    "Bergabung dengan open trip ke Turki bersama traveler Indonesia. Jadwal tetap, harga terjangkau, all-inclusive. Istanbul, Cappadocia, Pamukkale, dan lainnya.",
}

export default async function OpenTripPage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-muted py-20 lg:py-28">
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-10 right-20 h-48 w-48 rounded-full bg-primary/8 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 lg:px-8 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-sm backdrop-blur-sm">
            <Plane className="h-4 w-4 text-primary" />
            <span className="font-medium">Open Trip 2026</span>
          </div>
          <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Jelajahi Turki
            <br />
            <span className="text-primary">Bersama Kami</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Pilih trip impian Anda dan bergabunglah dengan traveler Indonesia lainnya. Semua sudah
            kami atur — tinggal berangkat!
          </p>
        </div>
      </section>

      {/* 2. Social Proof */}
      <SocialProofBar />

      {/* 3. Explanation */}
      <OpenTripExplanation />

      {/* 4. How It Works */}
      <HowItWorks />

      {/* 5. Trip Listing */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-tight">Trip Tersedia</h2>
            <p className="mt-1 text-sm text-muted-foreground">{openTrips.length} trip tersedia</p>
          </div>
          <div className="mt-8">
            <TripList trips={openTrips} />
          </div>
        </div>
      </section>

      {/* 6. Gallery */}
      <PastTripGallery />

      {/* 7. Why Us */}
      <WhyUs />

      {/* 8. CTA */}
      <CTASection />

      <FloatingWhatsApp />
    </>
  )
}
