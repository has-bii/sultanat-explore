import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import Link from "next/link"
import { categoryLabels } from "../data"
import type { Article } from "../types"

export function ArticleHero({ article }: { article: Article }) {
  return (
    <section className="relative">
      <div className="relative h-[45vh] min-h-[360px] overflow-hidden lg:h-[55vh]">
        <img src={article.thumbnail} alt={article.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 pb-10">
          <Link
            href="/artikel"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Artikel
          </Link>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {categoryLabels[article.category]}
            </span>
          </div>

          <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
            {article.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {article.author.name}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(article.date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {article.readingTime} menit baca
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
