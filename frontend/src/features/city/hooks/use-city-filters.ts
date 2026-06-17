"use client"

import { createFilterMethods, featuredParser, filterParsers } from "@/hooks/use-list-filters"
import { parseAsStringLiteral } from "nuqs"
import { useQueryStates } from "nuqs"

export function useCityFilters() {
  const [query, setQuery] = useQueryStates({
    ...filterParsers,
    ...featuredParser,
    sort: parseAsStringLiteral(["name", "createdAt"] as const).withDefault("createdAt"),
  })

  const methods = createFilterMethods(setQuery, ["name", "createdAt"])

  return { query, methods }
}
