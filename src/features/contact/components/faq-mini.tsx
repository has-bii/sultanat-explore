"use client"

import { ChevronDown, HelpCircle } from "lucide-react"
import { useState } from "react"

const FAQS = [
  {
    q: "Berapa lama waktu respons dari SultanatExplore?",
    a: "Kami biasanya merespons dalam 1–2 jam pada jam kerja. Untuk pesan di luar jam kerja, kami akan membalas pada hari kerja berikutnya.",
  },
  {
    q: "Apa cara tercepat menghubungi tim?",
    a: "WhatsApp adalah saluran tercepat. Langsung chat dan tim kami akan merespons dengan penawaran atau informasi yang Anda butuhkan.",
  },
  {
    q: "Apakah bisa konsultasi gratis dulu sebelum booking?",
    a: "Tentu! Kami menyediakan konsultasi gratis via WhatsApp. Tim travel advisor kami siap membantu merencanakan trip impian Anda.",
  },
  {
    q: "Bagaimana cara berkolaborasi dengan SultanatExplore?",
    a: "Hubungi kami via WhatsApp atau email dengan subjek 'Kolaborasi'. Kami terbuka untuk partnership dengan influencer, KOL, dan travel agent.",
  },
]

export function FaqMini() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-10 text-center">
          <div className="bg-primary/5 text-primary mx-auto mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
            <HelpCircle className="h-3.5 w-3.5" />
            FAQ
          </div>
          <h2 className="font-heading text-subheading font-bold tracking-tight">
            Pertanyaan yang Sering Ditanyakan
          </h2>
          <p className="text-muted-foreground mt-2">
            Belum menemukan jawaban? Langsung chat kami di WhatsApp
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-border/50 bg-card rounded-2xl border transition-colors">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
              >
                <span className="leading-snug font-medium">{faq.q}</span>
                <ChevronDown
                  className={`text-muted-foreground h-4 w-4 shrink-0 transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
