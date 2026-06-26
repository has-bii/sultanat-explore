import { apiClient } from "@/lib/api-client"
import { cacheLife } from "next/cache"

export const fetchFeaturedDestinations = async () => {
  "use cache"
  cacheLife("hours")

  try {
    const res = await apiClient.api.destinations.$get({
      query: {
        limit: "6",
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

export const fetchCityDestinations = async (cityId: string) => {
  "use cache"
  cacheLife("hours")

  try {
    const res = await apiClient.api.destinations.$get({
      query: {
        limit: "100",
        order: "asc",
        sort: "name",
        cityId,
      },
    })
    const resData = await res.json()
    if (!resData.success) return []
    return resData.data.data
  } catch {
    return []
  }
}
