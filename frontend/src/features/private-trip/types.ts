export type City = {
  id: string
  name: string
  image: string
  description: string
  basePricePerPersonPerDay: number
}

export type ServiceCategory = "transport" | "akomodasi" | "aktivitas" | "dokumen"

export type Service = {
  id: string
  name: string
  description: string
  category: ServiceCategory
  priceType: "per-person" | "per-group"
  price: number
}

export type ProcessStep = {
  step: number
  title: string
  description: string
}

export type SampleItinerary = {
  title: string
  duration: string
  cities: string[]
  highlights: string[]
  priceRange: string
}

export type Testimonial = {
  name: string
  location: string
  text: string
  trip: string
  avatar: string
}

export type FAQ = {
  question: string
  answer: string
}

export type ComparisonItem = {
  feature: string
  openTrip: string
  privateTrip: string
}

export type Benefit = {
  icon: string
  title: string
  description: string
}

export type AdvisorProfile = {
  name: string
  role: string
  bio: string
  photo: string
  experience: string
  speciality: string
}

export type TrustStat = {
  value: string
  label: string
}


