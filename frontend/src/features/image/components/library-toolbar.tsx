"use client"

import { Search, Upload } from "lucide-react"
import { useCallback, useRef } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface LibraryToolbarProps {
  search: string
  order: string
  onSearchChange: (value: string) => void
  onOrderChange: (value: string) => void
  onUpload: () => void
}

export function LibraryToolbar({
  search,
  order,
  onSearchChange,
  onOrderChange,
  onUpload,
}: LibraryToolbarProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const debouncedSearch = useCallback(
    (value: string) => {
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        onSearchChange(value || "")
      }, 300)
    },
    [onSearchChange],
  )

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
        <Input
          type="text"
          defaultValue={search}
          onChange={(e) => debouncedSearch(e.target.value)}
          placeholder="Cari berdasar alt..."
          className="pl-9"
        />
      </div>
      <Select value={order} onValueChange={onOrderChange}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Urutan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">Terbaru</SelectItem>
          <SelectItem value="asc">Terlama</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={onUpload}>
        <Upload />
        Upload
      </Button>
    </div>
  )
}
