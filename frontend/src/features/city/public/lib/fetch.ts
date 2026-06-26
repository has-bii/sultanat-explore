import { apiClient } from "@/lib/api-client"

export const fetchFeaturedCities = async () => {
  "use cache"
  try {
    const res = await apiClient.api.cities.$get({
      query: {
        limit: "4",
        featured: "true",
        sort: "createdAt",
        order: "desc",
      },
    })

    const resData = await res.json()
    if (!resData.success) return []

    return resData.data.data
  } catch {
    return []
  }
}

export const fetchCityCategories = async () => {
  "use cache"
  try {
    const res = await apiClient.api["city-categories"].$get()
    const resData = await res.json()
    if (!resData.success) return []
    return resData.data
  } catch {
    return []
  }
}

export const fetchAllCitySlugs = async () => {
  "use cache"
  try {
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
  } catch {
    return []
  }
}

export const fetchCityBySlug = async (slug: string) => {
  "use cache"
  try {
    const res = await apiClient.api.cities.slug[":slug"].$get({ param: { slug } })
    const resData = await res.json()
    if (!resData.success) return null
    return resData.data
  } catch {
    return null
  }
}

export const fetchCityGallery = async (cityId: string) => {
  "use cache"
  try {
    const res = await apiClient.api.cities[":id"].gallery.$get({ param: { id: cityId } })
    const resData = await res.json()
    if (!resData.success) return []
    return resData.data
  } catch {
    return []
  }
}

export const fetchAllCities = async (category: string | undefined) => {
  "use cache"
  try {
    const res = await apiClient.api.cities.$get({
      query: { limit: "100", sort: "name", order: "asc", category },
    })
    const resData = await res.json()
    if (!resData.success) throw new Error(resData.message)
    return resData.data
  } catch {
    return {
      data: [],
      nextCursor: null,
    }
  }
}
