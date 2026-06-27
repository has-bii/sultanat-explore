"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useOpenTripFilters } from "../../hooks/use-open-trip-filters"

export function OpenTripFilters() {
  const { query, methods } = useOpenTripFilters()

  return (
    <div className="flex flex-1 items-center gap-2">
      {/* Status filter */}
      <Select
        value={query.status ?? "_all"}
        onValueChange={(v) =>
          methods.onStatusChange(v === "_all" ? null : (v as "draft" | "published" | "archived"))
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_all">Semua Status</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select
        value={`${query.sort}-${query.order}`}
        onValueChange={(value) => methods.onSortOrderChange(value)}
      >
        <SelectTrigger className="w-44 min-w-fit">
          <SelectValue placeholder="Urutkan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="startAt-asc">Tanggal Mulai (Terawal)</SelectItem>
          <SelectItem value="startAt-desc">Tanggal Mulai (Terbaru)</SelectItem>
          <SelectItem value="price-asc">Harga (Termurah)</SelectItem>
          <SelectItem value="price-desc">Harga (Termahal)</SelectItem>
          <SelectItem value="publishedAt-desc">Terakhir Diterbitkan</SelectItem>
          <SelectItem value="publishedAt-asc">Terawal Diterbitkan</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
