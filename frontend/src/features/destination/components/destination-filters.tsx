"use client"

import { SearchIcon, X } from "lucide-react"
import { useEffect, useState } from "react"

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

import { useDestinationFilters } from "../hooks/use-destination-filters"

export function DestinationFilters() {
  const { query, methods } = useDestinationFilters()

  const [searchLocal, setSearchLocal] = useState(query.search || "")

  useEffect(() => {
    const timeout = setTimeout(() => methods.onSearchChange(searchLocal), 300)

    return () => clearTimeout(timeout)
  }, [methods, searchLocal])

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      {/* Search */}
      <InputGroup className="flex-1">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Cari destinasi..."
          value={searchLocal}
          onChange={(e) => setSearchLocal(e.target.value)}
        />
        {query.search && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton onClick={() => setSearchLocal("")}>
              <X />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>

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
          <SelectItem value="true">Unggulan</SelectItem>
          <SelectItem value="false">Tidak Unggulan</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select
        value={`${query.sort}-${query.order}`}
        onValueChange={(value) => methods.onSortOrderChange(value)}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Urutkan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt-desc">Terbaru</SelectItem>
          <SelectItem value="createdAt-asc">Terlama</SelectItem>
          <SelectItem value="name-asc">Nama A-Z</SelectItem>
          <SelectItem value="name-desc">Nama Z-A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
