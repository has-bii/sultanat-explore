"use client"

import { createFilterMethods, filterParsers } from "@/hooks/use-list-filters"
import { parseAsStringLiteral } from "nuqs"
import { useQueryStates } from "nuqs"

export function useAttractionFilters() {
  const [query, setQuery] = useQueryStates({
    ...filterParsers,
    sort: parseAsStringLiteral(["name", "createdAt"] as const).withDefault("createdAt"),
  })

  const { onSearchChange, onSortOrderChange } = createFilterMethods(setQuery, ["name", "createdAt"])

  const methods = { onSearchChange, onSortOrderChange }

  return { query, methods }
}
