import {
  ContactHero,
  ContactCards,
  InquiryForm,
  OperatingHours,
  FaqMini,
} from "@/features/contact"
import { CTASection } from "@/components/cta-section"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Hubungi Kami — SultanatExplore",
  description:
    "Hubungi tim SultanatExplore via WhatsApp, Instagram, atau email. Konsultasi gratis untuk perjalanan impian Anda ke Turki dan Umrah.",
}

export default function ContactPage() {
  return (
    <>
      {/* 1. Hero */}
      <ContactHero />

      {/* 2. Contact Info + Form */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 lg:grid-cols-5">
            {/* Left — Contact cards + Operating hours */}
            <div className="space-y-6 lg:col-span-2">
              <ContactCards />
              <OperatingHours />
            </div>

            {/* Right — Inquiry form */}
            <div className="lg:col-span-3">
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>

      {/* 3. FAQ Mini */}
      <FaqMini />

      {/* 4. CTA */}
      <CTASection />

      <FloatingWhatsApp />
    </>
  )
}
