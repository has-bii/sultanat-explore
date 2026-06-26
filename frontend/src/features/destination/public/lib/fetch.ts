import { apiClient } from "@/lib/api-client"

export const fetchFeaturedDestinations = async () => {
  "use cache"

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
