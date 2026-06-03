import { CTASection } from "@/components/cta-section"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import {
  BenefitsSection,
  ComparisonTable,
  PastTripGallery,
  PrivateFAQ,
  PrivateTripExplanation,
  ProcessTimeline,
  SampleItinerary,
  SocialProofBar,
  TestimonialsSection,
  TravelAdvisor,
  TripBuilderWizard,
} from "@/features/private-trip"
import { Crown } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Private Trip Turki — SultanatExplore",
  description:
    "Bangun perjalanan privat ke Turki sesuai keinginan Anda. Custom itinerary, privasi penuh, halal terjamin. Istanbul, Cappadocia, Pamukkale, dan lainnya.",
}

export default function PrivateTripPage() {
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
            <Crown className="h-4 w-4 text-primary" />
            <span className="font-medium">Private Trip</span>
          </div>
          <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Perjalanan Eksklusif,
            <br />
            <span className="text-primary">Dirancang untuk Anda</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Bangun trip impian Anda ke Turki. Pilih kota, layanan, dan dapatkan estimasi harga —
            semua bisa dicustom 100%.
          </p>
        </div>
      </section>

      {/* 2. Social Proof */}
      <SocialProofBar />

      {/* 3. Explanation */}
      <PrivateTripExplanation />

      {/* 4. Comparison */}
      <ComparisonTable />

      {/* 5. Benefits */}
      <BenefitsSection />

      {/* 6. Process */}
      <ProcessTimeline />

      {/* 7. Trip Builder */}
      <TripBuilderWizard />

      {/* 8. Sample Itinerary */}
      <SampleItinerary />

      {/* 9. Gallery */}
      <PastTripGallery />

      {/* 10. Testimonials */}
      <TestimonialsSection />

      {/* 11. Advisor */}
      <TravelAdvisor />

      {/* 12. FAQ */}
      <PrivateFAQ />

      {/* 13. CTA */}
      <CTASection />

      <FloatingWhatsApp />
    </>
  )
}
