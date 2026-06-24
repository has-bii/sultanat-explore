"use client"

import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { MapPin } from "lucide-react"

import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { getCitiesQueryOptions } from "@/features/city/queries"
import { parseAsString, useQueryState } from "nuqs"

import { CityCard } from "./card"

export function CitiesGrid() {
  const [category] = useQueryState("category")
  const [search] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({ shallow: true }),
  )

  const { data } = useSuspenseInfiniteQuery(
    getCitiesQueryOptions({
      limit: "100",
      sort: "name",
      order: "asc",
      category: category || undefined,
      search: search || undefined,
    }),
  )

  const cities = data.pages.flatMap((p) => p.data)
  const isFiltered = Boolean(category || search)

  if (cities.length === 0) {
    return (
      <div className="mt-8">
        <Empty>
          <EmptyMedia variant="icon">
            <MapPin />
          </EmptyMedia>
          <EmptyTitle>Kota tidak ditemukan</EmptyTitle>
          <EmptyDescription>
            {isFiltered
              ? "Tidak ada kota yang cocok. Coba ubah filter atau kata kunci pencarian Anda."
              : "Kota akan segera hadir. Nantikan kembali nanti."}
          </EmptyDescription>
        </Empty>
      </div>
    )
  }

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cities.map((city, index) => (
        <CityCard key={city.id} data={city} priority={index === 0} />
      ))}
    </div>
  )
}
