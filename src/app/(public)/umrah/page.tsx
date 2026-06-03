import { CTASection } from "@/components/cta-section"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import {
  Gallery,
  InclusionGrid,
  ProcessTimeline,
  Testimonials,
  TravelAdvisor,
  UmrahExplanation,
  UmrahFAQ,
} from "@/features/umrah"
import { Moon } from "lucide-react"
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
      <section className="relative overflow-hidden bg-muted py-20 lg:py-28">
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-10 right-20 h-48 w-48 rounded-full bg-primary/8 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 lg:px-8 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-sm backdrop-blur-sm">
            <Moon className="h-4 w-4 text-primary" />
            <span className="font-medium">Private Umrah</span>
          </div>
          <h1 className="mt-6 font-heading text-4xl text-balance font-bold tracking-tight sm:text-5xl">
            Ibadah Lebih Nyaman Tanpa Ribet
            <br />
            <span className="text-primary">Tanpa Khawatir</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Paket Umrah private dengan muthawwif berpengalaman, fasilitas dan layanan spesial.
          </p>
        </div>
      </section>

      {/* 2. Social Proof */}
      {/* <SocialProofBar /> */}

      {/* 3. Explanation */}
      <UmrahExplanation />

      {/* 4. Packages */}
      {/* <PackageCards /> */}

      {/* 5. Inclusions */}
      <InclusionGrid />

      {/* 6. Itinerary */}
      {/* <ItineraryPreview /> */}

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
