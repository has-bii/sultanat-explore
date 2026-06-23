import type { Metadata } from "next"

import { NotFoundClient } from "./not-found-client"

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return <NotFoundClient />
}
