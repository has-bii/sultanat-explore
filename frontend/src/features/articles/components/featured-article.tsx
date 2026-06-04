import { ArrowRight, Calendar, Clock } from "lucide-react"

import Image from "next/image"
import Link from "next/link"

import { categoryLabels } from "../data"
import type { Article } from "../types"

export function FeaturedArticle({ article }: { article: Article }) {
  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <span className="text-primary text-sm font-medium tracking-wider uppercase">
          Artikel Pilihan
        </span>

        <Link
          href={`/artikel/${article.slug}`}
          className="group bg-card shadow-uber-md hover:shadow-uber-lg mt-6 block overflow-hidden rounded-2xl transition-shadow"
        >
          <div className="grid lg:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
              <Image
                fill
                src={article.thumbnail}
                alt={article.title}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/10" />
              <div className="absolute top-4 left-4">
                <span className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-medium">
                  {categoryLabels[article.category]}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center p-6 lg:p-10">
              <div className="text-muted-foreground flex items-center gap-4 text-sm">
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

              <h2 className="font-heading group-hover:text-primary mt-4 text-2xl font-bold tracking-tight transition-colors lg:text-3xl">
                {article.title}
              </h2>

              <p className="text-muted-foreground mt-3 line-clamp-3 leading-relaxed">
                {article.excerpt}
              </p>

              <span className="text-primary mt-6 inline-flex items-center text-sm font-medium">
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
