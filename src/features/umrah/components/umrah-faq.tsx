"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { umrahFaqs } from "../data"

export function UmrahFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="bg-muted/30 py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">FAQ</span>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">
            Pertanyaan Seputar Umrah
          </h2>
        </div>

        <div className="mt-10 space-y-2">
          {umrahFaqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border bg-background transition-shadow hover:shadow-uber-sm"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold">{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
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
