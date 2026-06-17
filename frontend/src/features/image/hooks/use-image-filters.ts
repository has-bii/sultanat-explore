"use client"

import { createFilterMethods, filterParsers } from "@/hooks/use-list-filters"
import { parseAsStringLiteral } from "nuqs"
import { useQueryStates } from "nuqs"

export function useImageFilters() {
  const [query, setQuery] = useQueryStates({
    ...filterParsers,
    sort: parseAsStringLiteral(["createdAt"] as const).withDefault("createdAt"),
  })

  const methods = createFilterMethods(setQuery, ["createdAt"])

  return { query, methods }
}
