export type Inclusion = {
  icon: string
  label: string
}

export type ItineraryDay = {
  day: number
  title: string
  description: string
}

export type OpenTrip = {
  slug: string
  name: string
  destination: string
  image: string
  images?: string[]
  departureDate: string
  duration: string
  durationDays: number
  price: number
  totalSeats: number
  availableSeats: number
  inclusions: Inclusion[]
  exclusions: string[]
  itinerary: ItineraryDay[]
  highlights: string[]
}

export type TrustBadge = {
  icon: string
  title: string
  description: string
}
