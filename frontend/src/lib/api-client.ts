import { hc } from "hono/client"

import type { AppType } from "backend/app"

export const apiClient = hc<AppType>(process.env.NEXT_PUBLIC_API_URL!, {
  init: {
    credentials: "include",
  },
})
