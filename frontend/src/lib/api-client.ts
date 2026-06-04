import type { AppType } from "backend"
import { hc } from "hono/client"

export const apiClient = hc<AppType>(process.env.NEXT_PUBLIC_API_URL!, {
  init: {
    credentials: "include",
  },
})
