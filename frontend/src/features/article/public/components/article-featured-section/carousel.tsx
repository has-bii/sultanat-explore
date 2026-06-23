/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { ArrowRight, Calendar } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { GetArticlesResponse } from "@/features/article/queries"
import { formatDateId } from "@/lib/date"
import Image from "next/image"
import Link from "next/link"

type FeaturedArticle = GetArticlesResponse["data"]["data"][number]

export function FeaturedCarousel({ articles }: { articles: FeaturedArticle[] }) {
  const [api, setApi] = useState<CarouselApi | undefined>(undefined)
  const [current, setCurrent] = useState(1)
  const [count, setCount] = useState(articles.length)

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return
    setCurrent(api.selectedScrollSnap() + 1)
    setCount(api.scrollSnapList().length)
  }, [])

  useEffect(() => {
    if (!api) return
    onSelect(api)
    api.on("select", onSelect)
    api.on("reInit", onSelect)
    return () => {
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api, onSelect])

  return (
    <div className="mt-6">
      <Carousel opts={{ align: "start", loop: false }} setApi={setApi} className="w-full">
        <CarouselContent>
          {articles.map((article) => (
            <CarouselItem key={article.slug}>
              <Link
                href={`/artikel/${article.slug}`}
                className="group bg-card border-border block h-full overflow-hidden rounded-2xl border transition-colors"
              >
                <div className="grid lg:grid-cols-2">
                  {/* Image */}
                  <div className="relative aspect-16/10 overflow-hidden lg:aspect-auto">
                    <Image
                      fill
                      src={article.image.url}
                      alt={article.image.alt ?? article.title}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent lg:bg-linear-to-r lg:from-transparent lg:to-black/10" />
                    {article.category && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-medium">
                          {article.category.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center p-6 lg:p-10">
                    <div className="text-muted-foreground flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDateId(article.publishedAt || new Date())}
                      </span>
                    </div>

                    <h2 className="font-heading group-hover:text-primary mt-4 line-clamp-2 text-2xl font-bold tracking-tight transition-colors lg:text-3xl">
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
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Nav row: prev / counter / next */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <CarouselPrevious className="static translate-0" />
          <span className="text-muted-foreground min-w-16 text-center text-sm tabular-nums">
            {current} / {count}
          </span>
          <CarouselNext className="static translate-0" />
        </div>
      </Carousel>
    </div>
  )
}
