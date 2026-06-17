import { queryOptions } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType, InferResponseType } from "hono"

const $getUsers = apiClient.api.users.$get
export type GetUsersResponse = InferResponseType<typeof $getUsers, 200>
export type User = NonNullable<GetUsersResponse["data"]>[number]
export type UserFilters = NonNullable<InferRequestType<typeof $getUsers>["query"]>

export const userQueryKeys = {
  all: () => ["users"] as const,
  list: (query: UserFilters) => [...userQueryKeys.all(), query] as const,
}

export const getUsersQueryOptions = (query: UserFilters) =>
  queryOptions({
    queryKey: userQueryKeys.list(query),
    queryFn: async () => {
      const res = await $getUsers({ query })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data
    },
  })
