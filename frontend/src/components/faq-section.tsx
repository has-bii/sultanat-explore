"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "Apakah saya perlu visa untuk ke Turki?",
    answer:
      "Warga Indonesia memerlukan visa Turki. Namun, prosesnya cukup mudah dan bisa dilakukan online (e-Visa). Tim kami akan membantu dan mendampingi proses pengurusan visa Anda.",
  },
  {
    question: "Bagaimana sistem pembayarannya?",
    answer:
      "DP 30% untuk booking, pelunasan 2 minggu sebelum keberangkatan. Kami menerima transfer bank dan metode pembayaran digital. Detail akan dikirim setelah konfirmasi via WhatsApp.",
  },
  {
    question: "Berapa minimal peserta untuk trip jalan?",
    answer:
      "Trip berjalan dengan minimal 10 peserta. Jika belum mencapai minimal, kami akan menghubungi Anda untuk opsi reschedule atau refund penuh.",
  },
  {
    question: "Apakah bisa refund jika membatalkan diri?",
    answer:
      "DP tidak bisa dikembalikan. Untuk pelunasan, refund 50% jika pembatalan dilakukan minimal 14 hari sebelum keberangkatan. Setelah itu, tidak ada refund.",
  },
  {
    question: "Apa yang tidak termasuk dalam harga?",
    answer:
      "Visa, tip guide & driver, pengeluaran pribadi (souvenir, dll), dan asuransi perjalanan tidak termasuk. Semua yang termasuk sudah dicantumkan di detail masing-masing trip.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="text-center">
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">FAQ</span>
          <h2 className="font-heading text-subheading sm:text-heading mt-2 font-bold tracking-tight">
            Pertanyaan yang Sering Ditanyakan
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div key={i} className="bg-card rounded-xl border transition-colors">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "text-muted-foreground h-4 w-4 flex-shrink-0 transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-200",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="text-muted-foreground px-5 pb-4 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
