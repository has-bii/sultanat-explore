import type { InferResponseType } from "hono"

import { apiClient } from "@/lib/api-client"

const $getBySlug = apiClient.api["open-trips"]["slug"][":slug"].$get
export type OpenTripDetail = InferResponseType<typeof $getBySlug, 200> extends { data: infer D }
  ? D
  : never
export type OpenTripCityDetail = OpenTripDetail extends { cities: (infer C)[] } ? C : never
export type OpenTripInclusionDetail = OpenTripDetail extends { inclusions: (infer I)[] } ? I : never

export async function fetchOpenTripBySlug(slug: string): Promise<OpenTripDetail | null> {
  try {
    const res = await $getBySlug({ param: { slug } })
    const json = await res.json()
    if (!json.success) return null
    return json.data as OpenTripDetail
  } catch {
    return null
  }
}

export function computeDuration(startAt: string, endAt: string): string {
  const days = Math.ceil(
    (new Date(endAt).getTime() - new Date(startAt).getTime()) / (1000 * 60 * 60 * 24),
  )
  return `${days} Hari`
}

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
