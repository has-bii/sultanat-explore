"use client"

import { useState } from "react"

import { fetchCityBySlug } from "@/features/city/public/lib/fetch"
import { GetCityGalleryResponse } from "@/features/city/queries"
import Image from "next/image"

interface Props {
  cityName: string
  data: GetCityGalleryResponse["data"]
  cityImage: NonNullable<Awaited<ReturnType<typeof fetchCityBySlug>>>["image"]
}

export function GallerySection({ cityName, data, cityImage }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const allImages = [cityImage, ...data.map((i) => i.image)]

  const activeImage = allImages[activeIndex]

  return (
    <section className="bg-muted py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <span className="text-primary text-sm font-medium tracking-wider uppercase">Galeri</span>
        <h2 className="font-heading text-subheading md:text-heading mt-2 font-bold tracking-tight">
          Foto {cityName}
        </h2>

        <div className="mt-8">
          {/* Main image */}
          <div className="relative aspect-16/10 overflow-hidden rounded-2xl">
            {activeImage && (
              <Image
                fill
                src={activeImage.url}
                alt={activeImage.alt || cityName}
                className="object-cover"
                sizes="100vw"
                priority
                loading="eager"
              />
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`relative aspect-4/3 w-24 shrink-0 overflow-hidden rounded-xl transition-all ${
                    i === activeIndex
                      ? "border-primary border-2 opacity-100"
                      : "border-2 border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    fill
                    src={img.url}
                    alt={img.alt || cityName}
                    className="object-cover"
                    sizes="96px"
                    loading="eager"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
