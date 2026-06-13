"use client"

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
import { getDestinationsQueryOptions } from "@/features/destination/queries"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"

import { useAttractionListFilters } from "../hooks/use-attraction-list-filters"

export function AttractionListFilters() {
  const { query, methods } = useAttractionListFilters()

  const [searchLocal, setSearchLocal] = useState(query.search || "")

  useEffect(() => {
    const timeout = setTimeout(() => methods.onSearchChange(searchLocal), 300)

    return () => clearTimeout(timeout)
  }, [methods, searchLocal])

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
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

      {/* Destination filter */}
      <Suspense fallback={<div className="h-9 w-48 animate-pulse rounded-md bg-muted" />}>
        <DestinationSelect
          value={query.destinationId}
          onChange={methods.onDestinationChange}
        />
      </Suspense>

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

function DestinationSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { data } = useSuspenseInfiniteQuery(getDestinationsQueryOptions({ limit: "100" }))
  const destinations = data.pages.flatMap((p) => p.data)

  return (
    <Select value={value || "all"} onValueChange={(v) => onChange(v === "all" ? "" : v)}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Semua Destinasi" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Semua Destinasi</SelectItem>
        {destinations.map((d) => (
          <SelectItem key={d.id} value={d.id}>
            {d.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
