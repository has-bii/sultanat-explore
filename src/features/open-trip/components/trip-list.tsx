import type { OpenTrip } from "../types"
import { TripCard } from "./trip-card"
import { CalendarX } from "lucide-react"

export function TripList({ trips }: { trips: OpenTrip[] }) {
  if (trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <CalendarX className="h-12 w-12 text-muted-foreground/40" />
        <h3 className="mt-4 font-heading text-lg font-semibold">
          Belum ada trip yang cocok
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Coba ubah filter atau reset pencarian Anda.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => (
        <TripCard key={trip.slug} trip={trip} />
      ))}
    </div>
  )
}
