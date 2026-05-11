import Link from "next/link"
import { ArrowRight, Calendar, Clock } from "lucide-react"
import type { Article } from "../types"
import { categoryLabels } from "../data"

export function FeaturedArticle({ article }: { article: Article }) {
  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <span className="text-sm font-medium uppercase tracking-wider text-primary">
          Artikel Pilihan
        </span>

        <Link
          href={`/artikel/${article.slug}`}
          className="group mt-6 block overflow-hidden rounded-2xl bg-card shadow-uber-md transition-shadow hover:shadow-uber-lg"
        >
          <div className="grid lg:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
              <img
                src={article.thumbnail}
                alt={article.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/10" />
              <div className="absolute top-4 left-4">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  {categoryLabels[article.category]}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center p-6 lg:p-10">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(article.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {article.readingTime} menit baca
                </span>
              </div>

              <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight group-hover:text-primary transition-colors lg:text-3xl">
                {article.title}
              </h2>

              <p className="mt-3 text-muted-foreground leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>

              <span className="mt-6 inline-flex items-center text-sm font-medium text-primary">
                Baca selengkapnya
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}
