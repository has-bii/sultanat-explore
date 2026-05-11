"use client"

import { useState } from "react"
import type { Destination } from "../types"

export function GallerySection({ destination }: { destination: Destination }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const allImages = [destination.image, ...destination.gallery]

  return (
    <section className="bg-muted py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <span className="text-sm font-medium uppercase tracking-wider text-primary">
          Galeri
        </span>
        <h2 className="mt-2 font-heading text-subheading font-bold tracking-tight md:text-heading">
          Foto {destination.name}
        </h2>

        <div className="mt-8">
          {/* Main image */}
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
            <img
              src={allImages[activeIndex]}
              alt={`${destination.name} photo ${activeIndex + 1}`}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`relative aspect-[4/3] w-24 flex-shrink-0 overflow-hidden rounded-xl transition-all ${
                    i === activeIndex
                      ? "opacity-100 border-2 border-primary"
                      : "opacity-60 border-2 border-transparent hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${destination.name} thumbnail ${i + 1}`}
                    className="h-full w-full object-cover"
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
