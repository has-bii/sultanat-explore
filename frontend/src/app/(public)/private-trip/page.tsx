import { Crown } from "lucide-react"

import { CTASection } from "@/components/cta-section"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import {
  BenefitsSection,
  ComparisonTable,
  PrivateFAQ,
  PrivateTripExplanation,
  ProcessTimeline,
  SampleItinerary,
  // SocialProofBar,
  TestimonialsSection,
  TravelAdvisor,
  TripBuilderWizard,
} from "@/features/private-trip"
import { GallerySection } from "@/features/homepage"
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
      <section className="bg-background relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 opacity-50">
          <div className="bg-primary/5 absolute top-20 left-10 h-64 w-64 rounded-full blur-3xl" />
          <div className="bg-primary/8 absolute right-20 bottom-10 h-48 w-48 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 text-center lg:px-8">
          <div className="bg-background/80 mx-auto inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm backdrop-blur-sm">
            <Crown className="text-primary h-4 w-4" />
            <span className="font-medium">Private Trip</span>
          </div>
          <h1 className="font-heading mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Liburan Eksklusif,
            <br />
            <span className="text-primary">Spesial Untuk Anda</span>
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
            Rencanakan liburan private Anda ke Turki. Pilih destinasi, layanan dan dapatkan estimasi
            harga terbaik. Semua bisa di-custom 100%.
          </p>
        </div>
      </section>

      {/* 2. Social Proof */}
      {/* <SocialProofBar /> */}

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
      <GallerySection type="private_trip" title="Galeri Private Trip" subtitle="Momen perjalanan privat bersama traveler kami" />

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
