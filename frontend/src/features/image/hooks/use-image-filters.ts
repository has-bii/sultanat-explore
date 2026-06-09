"use client"

import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs"

export function useImageFilters() {
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""))
  const [order, setOrder] = useQueryState(
    "order",
    parseAsStringLiteral(["asc", "desc"]).withDefault("desc"),
  )

  return {
    search,
    setSearch,
    order,
    setOrder,
  }
}
