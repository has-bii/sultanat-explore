"use client"

import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { CalendarX } from "lucide-react"

import { ButtonLoading } from "@/components/button-loading"

import { getPublicOpenTripsQueryOptions } from "../../queries"
import { TripCard } from "./trip-card"

export function TripList() {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    getPublicOpenTripsQueryOptions({
      limit: "12",
      status: "published",
      sort: "startAt",
      order: "desc",
    }),
  )

  const trips = data.pages.flatMap((p) => p.data)

  if (trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <CalendarX className="text-muted-foreground/40 h-12 w-12" />
        <h3 className="font-heading mt-4 text-lg font-semibold">Belum ada trip tersedia</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Silakan cek kembali nanti atau hubungi kami via WhatsApp.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {trips.map((trip) => (
          <TripCard key={trip.slug} trip={trip} />
        ))}
      </div>
      {hasNextPage && (
        <ButtonLoading
          size="lg"
          className="mx-auto w-fit"
          onClick={() => fetchNextPage()}
          isLoading={isFetchingNextPage}
        >
          Muat lebih banyak
        </ButtonLoading>
      )}
    </div>
  )
}
