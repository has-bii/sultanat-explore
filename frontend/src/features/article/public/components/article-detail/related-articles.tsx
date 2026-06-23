import { ArrowRight } from "lucide-react"

import { format } from "date-fns"
import { id } from "date-fns/locale"
import Image from "next/image"
import Link from "next/link"

import type { RelatedArticle } from "../../lib/fetch"

type Props = { articles: RelatedArticle[] }

export function RelatedArticles({ articles }: Props) {
  if (articles.length === 0) return null

  return (
    <section className="bg-muted py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-primary text-sm font-medium tracking-wider uppercase">
              Baca Juga
            </span>
            <h2 className="font-heading text-subheading md:text-heading mt-2 font-bold tracking-tight">
              Artikel Terkait
            </h2>
          </div>
          <Link
            href="/artikel"
            className="text-primary hidden items-center gap-1.5 text-sm font-medium hover:underline sm:inline-flex"
          >
            Semua artikel
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/artikel/${article.slug}`}
              className="group bg-card shadow-uber-sm hover:shadow-uber-md overflow-hidden rounded-xl transition-shadow"
            >
              <div className="relative aspect-16/10 overflow-hidden">
                <Image
                  fill
                  src={article.image.url}
                  alt={article.image.alt ?? article.title}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                {article.category && (
                  <div className="absolute bottom-3 left-3">
                    <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                      {article.category.name}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="text-muted-foreground flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    {format(article.publishedAt || article.createdAt, "d MMM yyyy", {
                      locale: id,
                    })}
                  </span>
                </div>
                <h3 className="font-heading group-hover:text-primary mt-2 line-clamp-2 text-base leading-snug font-bold transition-colors">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
