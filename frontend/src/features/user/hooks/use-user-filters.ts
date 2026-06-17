"use client"

import { createFilterMethods } from "@/hooks/use-list-filters"
import { parseAsStringLiteral } from "nuqs"
import { useQueryStates } from "nuqs"

export function useUserFilters() {
  const [query, setQuery] = useQueryStates({
    sort: parseAsStringLiteral(["createdAt", "name"] as const).withDefault("createdAt"),
    order: parseAsStringLiteral(["asc", "desc"] as const).withDefault("desc"),
  })

  const { onSortOrderChange } = createFilterMethods(setQuery, ["createdAt", "name"])

  return { query, methods: { onSortOrderChange } }
}
