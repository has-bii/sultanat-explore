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

import { useAttractionFilters } from "../../hooks/use-attraction-filters"

export function AttractionFilters() {
  const { query, methods } = useAttractionFilters()

  const [searchLocal, setSearchLocal] = useState(query.search || "")

  useEffect(() => {
    const timeout = setTimeout(() => methods.onSearchChange(searchLocal), 300)

    return () => clearTimeout(timeout)
  }, [methods, searchLocal])

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
      <InputGroup className="max-w-sm flex-1">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Cari atraksi..."
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

      {/* Sort */}
      <Select
        value={`${query.sort}-${query.order}`}
        onValueChange={(value) => methods.onSortOrderChange(value)}
      >
        <SelectTrigger className="w-fit">
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
