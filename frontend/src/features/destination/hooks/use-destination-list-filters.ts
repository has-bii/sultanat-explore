"use client"

import { createFilterMethods, featuredParser, filterParsers } from "@/hooks/use-list-filters"
import { parseAsString, parseAsStringLiteral } from "nuqs"
import { useQueryStates } from "nuqs"

export function useDestinationListFilters() {
  const [query, setQuery] = useQueryStates({
    ...filterParsers,
    ...featuredParser,
    sort: parseAsStringLiteral(["name", "createdAt"] as const).withDefault("createdAt"),
    cityId: parseAsString.withDefault(""),
  })

  const methods = createFilterMethods(setQuery, ["name", "createdAt"])

  const onCityChange = (cityId: string) => {
    setQuery((prev) => ({ ...prev, cityId }))
  }

  return { query, methods: { ...methods, onCityChange } }
}
