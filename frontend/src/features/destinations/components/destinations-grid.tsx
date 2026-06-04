"use client"

import { ArrowRight, Search } from "lucide-react"
import { useMemo, useState } from "react"

import Image from "next/image"
import Link from "next/link"

import { type DestinationCategory, categoryLabels, categoryOrder, destinations } from "../data"

const ALL = "semua"

const tabs = [
  { value: ALL, label: "Semua" },
  ...categoryOrder.map((cat) => ({ value: cat, label: categoryLabels[cat] })),
]

export function DestinationsGrid() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState(ALL)

  const filtered = useMemo(() => {
    let items = destinations

    if (activeTab !== ALL) {
      items = items.filter((d) => d.categories.includes(activeTab as DestinationCategory))
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.tagline.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.highlights.some((h) => h.toLowerCase().includes(q)),
      )
    }

    return items
  }, [search, activeTab])

  return (
    <section className="bg-muted py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mb-12 lg:mb-16">
          <span className="text-primary text-sm font-medium tracking-wider uppercase">
            Semua Destinasi
          </span>
          <h2 className="font-heading text-subheading md:text-heading mt-2 font-bold tracking-tight">
            Jelajahi Berdasarkan Kategori
          </h2>
          <p className="text-body text-muted-foreground mt-3 max-w-lg">
            Temukan destinasi yang sesuai dengan minat Anda — budaya, alam, atau pantai.
          </p>
        </div>

        {/* Search + Tabs */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari destinasi..."
              className="bg-background placeholder:text-muted-foreground focus:border-primary focus:ring-primary h-11 w-full rounded-xl border pr-4 pl-10 text-sm transition-colors outline-none focus:ring-1"
            />
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:text-foreground border"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((dest) => (
              <Link
                key={dest.id}
                href={`/destinations/${dest.slug}`}
                className="group bg-card shadow-uber-sm hover:shadow-uber-md overflow-hidden rounded-xl transition-shadow"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    fill
                    src={dest.image}
                    alt={dest.name}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                    {dest.categories.map((cat) => (
                      <span
                        key={cat}
                        className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm"
                      >
                        {categoryLabels[cat]}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="font-heading group-hover:text-primary text-base font-bold transition-colors">
                    {dest.name}
                  </h4>
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{dest.tagline}</p>
                  <span className="text-primary mt-3 inline-flex items-center text-xs font-medium">
                    Lihat detail
                    <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">
              Destinasi tidak ditemukan untuk &ldquo;{search}&rdquo;
            </p>
            <button
              onClick={() => {
                setSearch("")
                setActiveTab(ALL)
              }}
              className="text-primary mt-2 text-sm font-medium hover:underline"
            >
              Reset filter
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
