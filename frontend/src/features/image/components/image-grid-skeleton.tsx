import { Card, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Props {
  count?: number
}

export function ImageGridSkeleton({ count = 10 }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 @lg/main:grid-cols-4 @xl/main:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="gap-4 pt-0 pb-4">
          <Skeleton className="aspect-square w-full rounded-b-none" />
          <CardHeader className="px-4">
            <Skeleton className="h-6 w-full" />
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
