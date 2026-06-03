"use client"

import { useState } from "react"

import Image from "next/image"

import type { Destination } from "../types"

export function GallerySection({ destination }: { destination: Destination }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const allImages = [destination.image, ...destination.gallery]

  return (
    <section className="bg-muted py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <span className="text-primary text-sm font-medium tracking-wider uppercase">Galeri</span>
        <h2 className="font-heading text-subheading md:text-heading mt-2 font-bold tracking-tight">
          Foto {destination.name}
        </h2>

        <div className="mt-8">
          {/* Main image */}
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
            <Image
              fill
              src={allImages[activeIndex]}
              alt={`${destination.name} photo ${activeIndex + 1}`}
              className="object-cover"
              sizes="100vw"
              priority
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
                      ? "border-primary border-2 opacity-100"
                      : "border-2 border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    fill
                    src={img}
                    alt={`${destination.name} thumbnail ${i + 1}`}
                    className="object-cover"
                    sizes="96px"
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
