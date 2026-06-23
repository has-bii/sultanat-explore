import { Skeleton } from "@/components/ui/skeleton"

export function EditArticlePageSkeleton() {
  return (
    <div className="mt-10 w-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-8 w-64" />
        <div className="inline-flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      {/* Two-column grid */}
      <div className="grid gap-6 lg:grid-cols-[7fr_3fr]">
        {/* Main: Konten */}
        <div className="flex flex-col rounded-lg border">
          <div className="flex flex-col gap-1 border-b p-6">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex flex-col gap-7 p-6">
            {/* Title */}
            <div className="flex w-full flex-col gap-3">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Excerpt */}
            <div className="flex w-full flex-col gap-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-20 w-full" />
            </div>

            {/* Content — Tiptap */}
            <div className="flex w-full flex-col gap-3">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="min-h-[400px] w-full" />
            </div>
          </div>
        </div>

        {/* Sidebar: Pengaturan (sticky shape) */}
        <div className="self-start lg:sticky lg:top-6">
          <div className="flex flex-col rounded-lg border">
            <div className="flex flex-col gap-1 border-b p-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-56" />
            </div>
            <div className="flex flex-col gap-7 p-6">
              {/* Image */}
              <div className="flex w-full flex-col gap-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="aspect-video w-full" />
              </div>

              {/* Category */}
              <div className="flex w-full flex-col gap-3">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Published toggle */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-sm" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-sm" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="border-t p-6">
              <div className="flex justify-end gap-3">
                <Skeleton className="h-10 w-28" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
