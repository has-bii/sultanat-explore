import { ArrowRight, Calendar, Clock } from "lucide-react"

import Image from "next/image"
import Link from "next/link"

import { categoryLabels } from "../data"
import type { Article } from "../types"

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/artikel/${article.slug}`}
      className="group bg-card shadow-uber-sm hover:shadow-uber-md overflow-hidden rounded-xl transition-shadow"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          fill
          src={article.thumbnail}
          alt={article.title}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            {categoryLabels[article.category]}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="text-muted-foreground flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(article.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {article.readingTime} mnt
          </span>
        </div>

        <h4 className="font-heading group-hover:text-primary mt-2 line-clamp-2 text-base leading-snug font-bold transition-colors">
          {article.title}
        </h4>

        <p className="text-muted-foreground mt-1.5 line-clamp-2 text-sm">{article.excerpt}</p>

        <span className="text-primary mt-3 inline-flex items-center text-xs font-medium">
          Baca artikel
          <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}
