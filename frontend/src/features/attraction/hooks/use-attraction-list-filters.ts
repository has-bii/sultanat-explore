"use client"

import { createFilterMethods, filterParsers } from "@/hooks/use-list-filters"
import { parseAsString, parseAsStringLiteral } from "nuqs"
import { useQueryStates } from "nuqs"

export function useAttractionListFilters() {
  const [query, setQuery] = useQueryStates({
    ...filterParsers,
    sort: parseAsStringLiteral(["name", "createdAt"] as const).withDefault("createdAt"),
    destinationId: parseAsString.withDefault(""),
  })

  const { onSearchChange, onSortOrderChange } = createFilterMethods(setQuery, ["name", "createdAt"])

  const onDestinationChange = (destinationId: string) => {
    setQuery((prev) => ({ ...prev, destinationId }))
  }

  const methods = { onSearchChange, onSortOrderChange, onDestinationChange }

  return { query, methods }
}
