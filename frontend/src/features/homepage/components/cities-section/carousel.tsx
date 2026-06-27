"use client"

import { ArrowLeft, ArrowRight } from "lucide-react"
import { use, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { fetchFeaturedCities } from "@/features/city/public/lib/fetch"
import Image from "next/image"
import Link from "next/link"

interface Props {
  dataPromise: ReturnType<typeof fetchFeaturedCities>
}

export function CitiesCarousel({ dataPromise }: Props) {
  const cities = use(dataPromise)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  useEffect(() => {
    if (!carouselApi) return
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev())
      setCanScrollNext(carouselApi.canScrollNext())
    }
    updateSelection()
    carouselApi.on("select", updateSelection)
    return () => {
      carouselApi.off("select", updateSelection)
    }
  }, [carouselApi])

  if (cities.length === 0) return null

  return (
    <div className="mx-auto max-w-6xl mask-x-from-98% mask-x-to-100%">
      <div className="mb-4 flex justify-end gap-2 pe-6 md:mb-0 md:pe-0">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => carouselApi?.scrollPrev()}
          disabled={!canScrollPrev}
          className="disabled:pointer-events-auto"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => carouselApi?.scrollNext()}
          disabled={!canScrollNext}
          className="disabled:pointer-events-auto"
        >
          <ArrowRight className="size-5" />
        </Button>
      </div>
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
          {cities.map((city) => (
            <CarouselItem
              key={city.id}
              className="max-w-[320px] pl-[20px] last:pr-[20px] lg:max-w-[360px]"
            >
              <Link href={`/destinations/${city.slug}`} className="group rounded-xl">
                <div className="group relative h-full min-h-[27rem] max-w-full overflow-hidden rounded-xl md:aspect-5/4 lg:aspect-video">
                  <Image
                    fill
                    src={city.image.url}
                    alt={city.image.alt || city.name}
                    className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 h-full bg-linear-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="text-primary-foreground absolute inset-x-0 bottom-0 flex flex-col items-start p-6 md:p-8">
                    <div className="mb-2 pt-4 text-xl font-semibold md:mb-3 md:pt-4 lg:pt-4">
                      {city.name}
                    </div>
                    <div className="mb-8 line-clamp-2 md:mb-12 lg:mb-9">
                      {city.tagline || city.description}
                    </div>
                    <div className="flex items-center text-sm">
                      Selengkapnya{" "}
                      <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
