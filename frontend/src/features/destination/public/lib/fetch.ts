import { cache } from "react"

import { apiClient } from "@/lib/api-client"

export const fetchFeaturedDestinations = cache(async () => {
  const res = await apiClient.api.destinations.$get({
    query: {
      limit: "6",
      featured: "true",
      sort: "createdAt",
      order: "desc",
    },
  })

  const resData = await res.json()

  if (!resData.success) throw new Error(resData.message)

  return resData.data.data
})
