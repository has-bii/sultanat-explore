"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"

import { privateFaqs } from "../data"

export function PrivateFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="bg-muted/30 py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="text-center">
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">FAQ</span>
          <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight">
            Pertanyaan Seputar Private Trip
          </h2>
        </div>

        <div className="mt-10 space-y-2">
          {privateFaqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className="bg-background hover:shadow-uber-sm overflow-hidden rounded-2xl border transition-shadow"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold">{faq.question}</span>
                  <ChevronDown
                    className={`text-muted-foreground h-4 w-4 flex-shrink-0 transition-transform ${
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
