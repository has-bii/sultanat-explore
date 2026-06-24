"use client"

import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { SearchIcon, X } from "lucide-react"
import { Suspense, useEffect, useState } from "react"

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
import { Skeleton } from "@/components/ui/skeleton"
import { getCitiesQueryOptions } from "@/features/city/queries"

import { useDestinationListFilters } from "../../hooks/use-destination-list-filters"

export function DestinationListFilters() {
  const { query, methods } = useDestinationListFilters()

  const [searchLocal, setSearchLocal] = useState(query.search || "")

  useEffect(() => {
    const timeout = setTimeout(() => methods.onSearchChange(searchLocal), 300)

    return () => clearTimeout(timeout)
  }, [methods, searchLocal])

  return (
    <div className="flex flex-1 items-center gap-2">
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

      {/* Destination filter */}
      <Suspense fallback={<Skeleton className="h-9 w-48" />}>        
        <CitySelect value={query.cityId} onChange={methods.onCityChange} />
      </Suspense>

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

function CitySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { data } = useSuspenseInfiniteQuery(getCitiesQueryOptions({ limit: "100" }))
  const destinations = data.pages.flatMap((p) => p.data)

  return (
    <Select value={value || "all"} onValueChange={(v) => onChange(v === "all" ? "" : v)}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Semua Kota" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Semua Kota</SelectItem>
        {destinations.map((d) => (
          <SelectItem key={d.id} value={d.id}>
            {d.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
