"use client"

import { Search } from "lucide-react"
import { useMemo, useState } from "react"
import { articles, categoryLabels, type ArticleCategory } from "../data"
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
  }, [search, activeTab])

  return (
    <section className="pb-16 lg:pb-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-sm font-medium uppercase tracking-wider text-primary">
              Semua Artikel
            </span>
            <h2 className="mt-1 font-heading text-subheading font-bold tracking-tight md:text-heading">
              Jelajahi Artikel Kami
            </h2>
          </div>

          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari artikel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border bg-background py-2 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
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
              className="mt-2 text-sm font-medium text-primary hover:underline"
            >
              Reset filter
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
