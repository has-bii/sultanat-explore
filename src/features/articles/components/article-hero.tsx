import { ArrowLeft, Calendar, Clock, User } from "lucide-react"

import Image from "next/image"
import Link from "next/link"

import { categoryLabels } from "../data"
import type { Article } from "../types"

export function ArticleHero({ article }: { article: Article }) {
  return (
    <section className="relative">
      <div className="relative h-[45vh] min-h-[360px] overflow-hidden lg:h-[55vh]">
        <Image
          fill
          src={article.thumbnail}
          alt={article.title}
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="from-background via-background/50 absolute inset-0 bg-gradient-to-t to-transparent" />
      </div>

      <div className="absolute right-0 bottom-0 left-0">
        <div className="mx-auto max-w-4xl px-6 pb-10 lg:px-8">
          <Link
            href="/artikel"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Artikel
          </Link>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
              {categoryLabels[article.category]}
            </span>
          </div>

          <h1 className="font-heading mt-3 text-3xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-4 text-sm">
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
