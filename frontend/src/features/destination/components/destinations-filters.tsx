"use client"

import { Search, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DestinationsFiltersProps {
  search: string
  onSearchChange: (val: string) => void
  featured: string
  onFeaturedChange: (val: string) => void
  sort: string
  onSortChange: (val: string) => void
  onClearSearch: () => void
}

export function DestinationsFilters({
  search,
  onSearchChange,
  featured,
  onFeaturedChange,
  sort,
  onSortChange,
  onClearSearch,
}: DestinationsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
      <div className="relative max-w-sm min-w-[200px] flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input
          placeholder="Cari destinasi..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pr-8 pl-8"
        />
        {search && (
          <button
            onClick={onClearSearch}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Featured filter */}
      <Select value={featured} onValueChange={onFeaturedChange}>
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="Semua" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua</SelectItem>
          <SelectItem value="true">Unggulan</SelectItem>
          <SelectItem value="false">Tidak Unggulan</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select value={sort} onValueChange={onSortChange}>
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="Urutkan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt">Terbaru</SelectItem>
          <SelectItem value="name">Nama A-Z</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
