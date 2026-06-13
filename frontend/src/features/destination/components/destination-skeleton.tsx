import { Loader } from "lucide-react"

export function DestinationSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
      <div className="inline-flex items-center gap-2">
        <Loader className="size-7 animate-spin" />
        <p className="text-lg font-medium">Memuat...</p>
      </div>
    </div>
  )
}
