import { cache } from "react"

import { apiClient } from "@/lib/api-client"

export const fetchFeaturedCities = cache(async () => {
  const res = await apiClient.api.cities.$get({
    query: {
      limit: "4",
      featured: "true",
      sort: "createdAt",
      order: "desc",
    },
  })

  const resData = await res.json()

  if (!resData.success) throw new Error(resData.message)

  return resData.data.data
})

export const fetchCityCategories = cache(async () => {
  const res = await apiClient.api["city-categories"].$get()
  const resData = await res.json()
  if (!resData.success) throw new Error(resData.message)
  return resData.data
})

export const fetchAllCitySlugs = cache(async () => {
  const res = await apiClient.api.cities.$get({
    query: { limit: "100", sort: "createdAt", order: "desc" },
  })
  const resData = await res.json()
  if (!resData.success) throw new Error(resData.message)
  return resData.data.data.map((city) => ({
    slug: city.slug,
    name: city.name,
    image: city.image.url,
    updatedAt: city.updatedAt,
  }))
})
