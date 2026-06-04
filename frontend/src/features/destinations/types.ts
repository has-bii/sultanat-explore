export type DestinationCategory = "budaya" | "alam" | "pantai"

export type Destination = {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  image: string
  gallery: string[]
  categories: DestinationCategory[]
  featured: boolean
  highlights: string[]
}

export type Attraction = {
  id: string
  name: string
  description: string
  image: string
  destinationId: string
}

export type WhyTurkeyItem = {
  icon: string
  title: string
  description: string
}
