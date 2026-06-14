import { Skeleton } from "@/components/ui/skeleton"
import { TiptapEditorSkeleton } from "@/components/tiptap"

export function EditArticlePageSkeleton() {
  return (
    <div className="mx-auto mt-10 w-full max-w-3xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-8 w-64" />
        <div className="inline-flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      {/* Card */}
      <div className="flex w-full flex-col gap-0 rounded-lg border">
        <div className="flex flex-col gap-1 border-b p-6">
          <Skeleton className="h-6 w-36" />
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
            <TiptapEditorSkeleton />
          </div>

          {/* Image + Category grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex w-full flex-col gap-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="aspect-video w-full" />
            </div>
            <div className="flex w-full flex-col gap-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Published toggle */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded-sm" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-3 w-64" />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      </div>
    </div>
  )
}
