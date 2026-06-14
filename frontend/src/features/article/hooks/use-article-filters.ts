"use client"

import { createFilterMethods, filterParsers } from "@/hooks/use-list-filters"
import { BooleanString } from "@/types"
import { parseAsString, parseAsStringLiteral } from "nuqs"
import { useQueryStates } from "nuqs"

export function useArticleFilters() {
  const [query, setQuery] = useQueryStates({
    ...filterParsers,
    sort: parseAsStringLiteral(["createdAt", "publishedAt"]).withDefault("createdAt"),
    published: parseAsStringLiteral(["true", "false"]),
    category: parseAsString.withDefault(""),
  })

  const baseMethods = createFilterMethods(setQuery, ["createdAt", "publishedAt"])

  const onPublishedChange = (value: BooleanString | null) => {
    setQuery((prev) => ({ ...prev, published: value }))
  }

  const onCategoryChange = (value: string | null) => {
    setQuery({ category: value ?? "" })
  }

  return {
    query,
    methods: {
      ...baseMethods,
      onPublishedChange,
      onCategoryChange,
    },
  }
}
