import { Loader } from "lucide-react"
import React from "react"

export default function Loading() {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center gap-2">
      <Loader className="size-6 animate-spin" />
      <p className="text-lg font-medium">Loading....</p>
    </div>
  )
}
