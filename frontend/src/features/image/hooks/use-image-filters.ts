"use client"

import { parseAsStringLiteral } from "nuqs"
import { useQueryStates } from "nuqs"

import { createFilterMethods, featuredParser, filterParsers } from "@/hooks/use-list-filters"

export function useImageFilters() {
  const [query, setQuery] = useQueryStates({
    ...filterParsers,
    ...featuredParser,
    sort: parseAsStringLiteral(["createdAt"] as const).withDefault("createdAt"),
  })

  const methods = createFilterMethods(setQuery, ["createdAt"])

  return { query, methods }
}