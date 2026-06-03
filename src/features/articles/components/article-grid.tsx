"use client"

import { Search } from "lucide-react"
import { useMemo, useState } from "react"

import { type ArticleCategory, articles, categoryLabels } from "../data"
import { ArticleCard } from "./article-card"
import { CategoryFilter } from "./category-filter"

const ALL = "semua"

export function ArticleGrid() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState(ALL)

  // Exclude featured article from grid
  const nonFeatured = articles.filter((a) => !a.featured)

  const filtered = useMemo(() => {
    let items = nonFeatured

    if (activeTab !== ALL) {
      items = items.filter((a) => a.category === (activeTab as ArticleCategory))
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          categoryLabels[a.category].toLowerCase().includes(q),
      )
    }

    return items
  }, [search, activeTab, nonFeatured])

  return (
    <section className="pb-16 lg:pb-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-primary text-sm font-medium tracking-wider uppercase">
              Semua Artikel
            </span>
            <h2 className="font-heading text-subheading md:text-heading mt-1 font-bold tracking-tight">
              Jelajahi Artikel Kami
            </h2>
          </div>

          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari artikel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-background placeholder:text-muted-foreground focus:border-primary w-full rounded-full border py-2 pr-4 pl-10 text-sm transition-colors outline-none"
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="mt-6">
          <CategoryFilter active={activeTab} onChange={setActiveTab} />
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="mt-8 py-16 text-center">
            <p className="text-muted-foreground">
              Artikel tidak ditemukan untuk &ldquo;{search}&rdquo;
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
