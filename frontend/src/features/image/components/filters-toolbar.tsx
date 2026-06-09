"use client"

import { SearchIcon, Upload } from "lucide-react"
import { useCallback, useRef } from "react"

import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useUploadImagesDialogStore } from "../stores/upload-images-dialog.store"

interface Props {
  search: string
  order: string
  onSearchChange: (value: string) => void
  onOrderChange: (value: "asc" | "desc") => void
}

export function FiltersToolbar({ search, order, onSearchChange, onOrderChange }: Props) {
  const onUpload = useUploadImagesDialogStore((s) => s.onOpen)

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
    <div className="flex items-center justify-between gap-3">
      <div className="flex-1">
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            defaultValue={search}
            onChange={(e) => debouncedSearch(e.target.value)}
            placeholder="Cari berdasarkan deskripsi..."
          />
        </InputGroup>
      </div>
      <div className="inline-flex items-center gap-2">
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
    </div>
  )
}
