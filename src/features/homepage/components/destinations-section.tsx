"use client"

import { ArrowLeft, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Image from "next/image"

import { destinationItems } from "../data"

export interface Gallery4Item {
  id: string
  title: string
  description: string
  href: string
  image: string
}

export interface DestinationsSectionProps {
  title?: string
  description?: string
}

export function DestinationsSection({
  title = "Destinasi Populer",
  description = "Explore destinasi wisata Turki paling wajib Anda kunjungi",
}: DestinationsSectionProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (!carouselApi) {
      return
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev())
      setCanScrollNext(carouselApi.canScrollNext())
      setCurrentSlide(carouselApi.selectedScrollSnap())
    }
    updateSelection()
    carouselApi.on("select", updateSelection)
    return () => {
      carouselApi.off("select", updateSelection)
    }
  }, [carouselApi])

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex items-end justify-between md:mb-14 lg:mb-16">
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-subheading md:text-heading lg:text-card-title font-bold tracking-tight">
              {title}
            </h2>
            <p className="text-body text-muted-foreground max-w-lg">{description}</p>
          </div>
          <div className="hidden shrink-0 gap-2 md:flex">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollPrev()
              }}
              disabled={!canScrollPrev}
              className="disabled:pointer-events-auto"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollNext()
              }}
              disabled={!canScrollNext}
              className="disabled:pointer-events-auto"
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl mask-x-from-98% mask-x-to-100%">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              "(max-width: 768px)": {
                dragFree: true,
              },
            },
          }}
        >
          <CarouselContent className="ml-0">
            {destinationItems.map((item) => (
              <CarouselItem
                key={item.id}
                className="max-w-[320px] pl-[20px] last:pr-[20px] lg:max-w-[360px]"
              >
                <a href={item.href} className="group rounded-xl">
                  <div className="group relative h-full min-h-[27rem] max-w-full overflow-hidden rounded-xl md:aspect-[5/4] lg:aspect-[16/9]">
                    <Image
                      fill
                      src={item.image}
                      alt={item.title}
                      className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 320px, 360px"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 h-full bg-linear-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="text-primary-foreground absolute inset-x-0 bottom-0 flex flex-col items-start p-6 md:p-8">
                      <div className="mb-2 pt-4 text-xl font-semibold md:mb-3 md:pt-4 lg:pt-4">
                        {item.title}
                      </div>
                      <div className="mb-8 line-clamp-2 md:mb-12 lg:mb-9">{item.description}</div>
                      <div className="flex items-center text-sm">
                        Selengkapnya{" "}
                        <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="mt-8 flex justify-center gap-2">
          {destinationItems.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                currentSlide === index ? "bg-primary" : "bg-primary/20"
              }`}
              onClick={() => carouselApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
