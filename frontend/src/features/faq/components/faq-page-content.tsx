"use client"

import { ChevronDown, HelpCircle } from "lucide-react"
import { useState } from "react"

import { type FaqCategory, faqCategories } from "@/features/faq"
import { cn } from "@/lib/utils"

function CategoryFilter({
  categories,
  activeSlug,
  onSelect,
}: {
  categories: FaqCategory[]
  activeSlug: string | null
  onSelect: (slug: string | null) => void
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "rounded-full px-4 py-2 text-sm font-medium transition-all",
          activeSlug === null
            ? "bg-primary text-primary-foreground shadow-sm"
            : "bg-accent/50 text-muted-foreground hover:bg-accent hover:text-foreground",
        )}
      >
        Semua
      </button>
      {categories.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => onSelect(cat.slug)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-all",
            activeSlug === cat.slug
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-accent/50 text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          {cat.category}
        </button>
      ))}
    </div>
  )
}

function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="space-y-3">
      {items.map((faq, i) => {
        const isOpen = openIndex === i
        return (
          <div key={i} className="border-border/50 bg-card rounded-xl border transition-colors">
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
  )
}

export function FaqPageContent() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null)

  const filtered = activeSlug ? faqCategories.filter((c) => c.slug === activeSlug) : faqCategories

  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-8">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <div className="bg-primary/5 text-primary mx-auto mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
            <HelpCircle className="h-3.5 w-3.5" />
            FAQ
          </div>
          <h1 className="font-heading text-heading font-bold tracking-tight">
            Pertanyaan yang Sering Ditanyakan
          </h1>
          <p className="text-muted-foreground mx-auto mt-3 max-w-lg">
            Temukan jawaban untuk pertanyaan umum tentang perjalanan ke Turki, pembayaran, visa, dan
            layanan kami.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="pb-4">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <CategoryFilter
            categories={faqCategories}
            activeSlug={activeSlug}
            onSelect={setActiveSlug}
          />
        </div>
      </section>

      {/* FAQ items */}
      <section className="pb-20 lg:pb-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="mt-8 space-y-12">
            {filtered.map((cat) => (
              <div key={cat.slug}>
                <h2 className="font-heading mb-4 text-lg font-bold">{cat.category}</h2>
                <FaqAccordion items={cat.items} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-border/40 bg-muted/30 border-t py-16">
        <div className="mx-auto max-w-2xl px-6 text-center lg:px-8">
          <h2 className="font-heading text-2xl font-bold tracking-tight">
            Masih punya pertanyaan?
          </h2>
          <p className="text-muted-foreground mt-2">
            Tim kami siap membantu Anda. Langsung chat via WhatsApp untuk respons cepat.
          </p>
          <a
            href="https://wa.me/6281234567890?text=Halo%20SultanatExplore%2C%20saya%20ingin%20bertanya"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-primary-foreground active:shadow-uber-pressed mt-6 inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-semibold transition-all hover:opacity-90"
          >
            Chat WhatsApp
          </a>
        </div>
      </section>
    </>
  )
}
