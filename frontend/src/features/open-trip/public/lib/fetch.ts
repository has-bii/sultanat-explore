import { apiClient } from "@/lib/api-client"

export const fetchOpenTripsByCitySlug = async (citySlug: string) => {
  try {
    const res = await apiClient.api["open-trips"].city[":citySlug"].$get({
      param: { citySlug },
    })
    const resData = await res.json()
    if (!resData.success) return []
    return resData.data
  } catch {
    return []
  }
}
