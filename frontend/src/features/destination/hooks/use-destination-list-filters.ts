"use client"

import { createFilterMethods, filterParsers } from "@/hooks/use-list-filters"
import { parseAsString, parseAsStringLiteral } from "nuqs"
import { useQueryStates } from "nuqs"

export function useDestinationListFilters() {
  const [query, setQuery] = useQueryStates({
    ...filterParsers,
    sort: parseAsStringLiteral(["name", "createdAt"] as const).withDefault("createdAt"),
    cityId: parseAsString.withDefault(""),
  })

  const { onSearchChange, onSortOrderChange } = createFilterMethods(setQuery, ["name", "createdAt"])

  const onCityChange = (cityId: string) => {
    setQuery((prev) => ({ ...prev, cityId }))
  }

  const methods = { onSearchChange, onSortOrderChange, onCityChange }

  return { query, methods }
}
