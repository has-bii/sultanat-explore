"use client"

import {
  ArrowRight,
  CalendarRange,
  Camera,
  Car,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
  Map,
  Sparkles,
  Star,
  Users,
  Utensils,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Image from "next/image"

import type { Facility } from "../data"
import { privateTripService } from "../data"

const iconMap: Record<string, LucideIcon> = {
  map: Map,
  star: Star,
  car: Car,
  users: Users,
  utensils: Utensils,
  calendar: CalendarRange,
  camera: Camera,
  sparkles: Sparkles,
}

function FacilityCard({ facility }: { facility: Facility }) {
  const Icon = iconMap[facility.icon]

  return (
    <div className="group bg-card relative overflow-hidden rounded-2xl border">
      {/* Image */}
      {facility.image && (
        <div className="relative aspect-4/3 overflow-hidden">
          <Image
            src={facility.image}
            alt={facility.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            {Icon && <Icon className="h-4 w-4" />}
          </div>
          <h4 className="text-sm leading-tight font-semibold">{facility.title}</h4>
        </div>
        <p className="text-muted-foreground mt-2 text-xs leading-relaxed">{facility.description}</p>
      </div>
    </div>
  )
}

export function PrivateTripSection() {
  const { title, heading, description, facilities } = privateTripService
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  const onSelect = useCallback(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())
  }, [api])

  useEffect(() => {
    if (!api) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect()
    api.on("select", onSelect)
    api.on("reInit", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api, onSelect])

  return (
    <section className="bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: text content */}
          <div className="flex flex-col justify-center">
            <span className="text-primary text-xs font-semibold tracking-widest uppercase">
              {title}
            </span>
            <h2 className="font-heading text-subheading sm:text-heading mt-2 font-bold tracking-tight">
              {heading}
            </h2>
            <p className="text-body text-muted-foreground mt-4">{description}</p>
            <a
              href={privateTripService.href}
              className="bg-primary text-primary-foreground hover:bg-primary/90 active:shadow-uber-pressed mt-8 inline-flex w-fit items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
            >
              {privateTripService.ctaText}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Right: facility carousel */}
          <div className="flex min-w-0 flex-col gap-4">
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-3">
                {facilities.map((facility) => (
                  <CarouselItem key={facility.title} className="basis-full pl-3 sm:basis-1/2">
                    <FacilityCard facility={facility} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Navigation: prev/next + dots */}
            <div className="flex items-center justify-center gap-3 sm:justify-start">
              <button
                onClick={() => api?.scrollPrev()}
                className="bg-background hover:bg-muted flex h-8 w-8 items-center justify-center rounded-full border transition-colors disabled:opacity-40"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex gap-1.5">
                {Array.from({ length: count }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => api?.scrollTo(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === current ? "bg-primary w-6" : "bg-primary/25 hover:bg-primary/40 w-1.5"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => api?.scrollNext()}
                className="bg-background hover:bg-muted flex h-8 w-8 items-center justify-center rounded-full border transition-colors disabled:opacity-40"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
