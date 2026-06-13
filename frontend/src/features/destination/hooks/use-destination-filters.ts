"use client"

import { parseAsStringLiteral } from "nuqs"
import { useQueryStates } from "nuqs"

import { createFilterMethods, featuredParser, filterParsers } from "@/hooks/use-list-filters"

export function useDestinationFilters() {
  const [query, setQuery] = useQueryStates({
    ...filterParsers,
    ...featuredParser,
    sort: parseAsStringLiteral(["name", "createdAt"] as const).withDefault("createdAt"),
  })

  const methods = createFilterMethods(setQuery, ["name", "createdAt"])

  return { query, methods }
}