import { Moon } from "lucide-react"

import { CTASection } from "@/components/cta-section"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import {
  Gallery,
  InclusionGrid,
  ItineraryPreview,
  PackageCards,
  ProcessTimeline,
  Testimonials,
  TravelAdvisor,
  UmrahExplanation,
  UmrahFAQ,
} from "@/features/umrah"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Paket Umrah Privat — SultanatExplore",
  description:
    "Paket Umrah privat untuk jamaah Indonesia. Pembimbing bersertifikat, hotel dekat Masjid, makanan halal, semua inklusif. Standard, Premium, VIP.",
}

export default function UmrahPage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="bg-muted relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 opacity-50">
          <div className="bg-primary/5 absolute top-20 left-10 h-64 w-64 rounded-full blur-3xl" />
          <div className="bg-primary/8 absolute right-20 bottom-10 h-48 w-48 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 text-center lg:px-8">
          <div className="bg-background/80 mx-auto inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm backdrop-blur-sm">
            <Moon className="text-primary h-4 w-4" />
            <span className="font-medium">Private Umrah</span>
          </div>
          <h1 className="font-heading mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Ibadah Lebih Nyaman Tanpa Ribet
            <br />
            <span className="text-primary">Tanpa Khawatir</span>
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
            Paket Umrah private dengan muthawwif berpengalaman, fasilitas dan layanan spesial.
          </p>
        </div>
      </section>

      {/* 2. Social Proof */}
      {/* <SocialProofBar /> */}

      {/* 3. Explanation */}
      <UmrahExplanation />

      {/* 4. Packages */}
      <PackageCards />

      {/* 5. Inclusions */}
      <InclusionGrid />

      {/* 6. Itinerary */}
      <ItineraryPreview />

      {/* 7. Process */}
      <ProcessTimeline />

      {/* 8. Gallery */}
      <Gallery />

      {/* 9. Testimonials */}
      <Testimonials />

      {/* 10. Advisor */}
      <TravelAdvisor />

      {/* 11. FAQ */}
      <UmrahFAQ />

      {/* 12. CTA */}
      <CTASection />

      <FloatingWhatsApp />
    </>
  )
}
