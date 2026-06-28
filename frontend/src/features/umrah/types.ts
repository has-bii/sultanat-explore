export type PackageTier = {
  id: string
  name: string
  subtitle: string
  duration: string
  hotelStars: number
  price: number
  priceLabel: string
  highlights: string[]
  inclusions: string[]
  popular?: boolean
}

export type Inclusion = {
  icon: string
  title: string
  description: string
}

export type ItineraryDay = {
  day: number
  title: string
  location: string
  description: string
}

export type ProcessStep = {
  step: number
  title: string
  description: string
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

export type TrustStat = {
  value: string
  label: string
}


export type AdvisorProfile = {
  name: string
  role: string
  bio: string
  photo: string
  experience: string
  speciality: string
}
