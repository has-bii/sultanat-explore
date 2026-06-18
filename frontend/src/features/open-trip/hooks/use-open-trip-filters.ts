"use client"

import { createFilterMethods, filterParsers } from "@/hooks/use-list-filters"
import { parseAsStringLiteral } from "nuqs"
import { useQueryStates } from "nuqs"

export function useOpenTripFilters() {
  const [query, setQuery] = useQueryStates({
    ...filterParsers,
    sort: parseAsStringLiteral(["startAt", "price", "publishedAt"] as const).withDefault("startAt"),
    status: parseAsStringLiteral(["draft", "published", "archived"] as const),
  })

  const { onSearchChange, onSortOrderChange } = createFilterMethods(setQuery, [
    "startAt",
    "price",
    "publishedAt",
  ])

  const onStatusChange = (value: "draft" | "published" | "archived" | null) => {
    setQuery((prev) => ({ ...prev, status: value }))
  }

  return {
    query,
    methods: { onSearchChange, onSortOrderChange, onStatusChange },
  }
}
