"use client"

import { SearchIcon, Upload, X } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useImageFilters } from "../hooks/use-image-filters"
import { useUploadImagesDialogStore } from "../stores/upload-images-dialog.store"

export function ImageToolbar() {
  const { query, methods } = useImageFilters()
  const onUpload = useUploadImagesDialogStore((s) => s.onOpen)

  const [searchLocal, setSearchLocal] = useState(query.search || "")

  useEffect(() => {
    const timeout = setTimeout(() => methods.onSearchChange(searchLocal), 300)

    return () => clearTimeout(timeout)
  }, [methods, searchLocal])

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            value={searchLocal}
            onChange={(e) => setSearchLocal(e.target.value)}
            placeholder="Cari berdasarkan deskripsi..."
          />
          {query.search && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton onClick={() => setSearchLocal("")}>
                <X />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
      </div>
      <div className="inline-flex items-center gap-2">
        {/* Featured filter */}
        <Select
          value={query.featured ? query.featured : "all"}
          onValueChange={(value) => {
            if (value === "all") {
              methods.onFeaturedChange(null)
              return
            }
            methods.onFeaturedChange(value as "true" | "false")
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="true">Featured</SelectItem>
            <SelectItem value="false">Non Featured</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={`${query.sort}-${query.order}`}
          onValueChange={(value) => methods.onSortOrderChange(value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Urutan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Terbaru</SelectItem>
            <SelectItem value="createdAt-asc">Terlama</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={onUpload}>
          <Upload data-icon="inline-start" />
          <span>Upload</span>
        </Button>
      </div>
    </div>
  )
}
