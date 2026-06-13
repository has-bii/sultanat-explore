import { queryOptions } from "@tanstack/react-query"

import { authClient } from "@/lib/auth-client"

export const getAuthSessionQueryOptions = () => {
  return queryOptions({
    queryKey: ["auth"],
    queryFn: async () => {
      const { data } = await authClient.getSession()

      if (!data) throw new Error("Unauthorized")

      return data
    },
  })
}
