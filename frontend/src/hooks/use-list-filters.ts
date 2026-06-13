import { parseAsString, parseAsStringLiteral } from "nuqs"
import { useQueryStates } from "nuqs"

/**
 * Shared nuqs parser configs for list filters.
 * Spread into useQueryStates for search, order params.
 * Featured is opt-in — spread `featuredParser` separately.
 */
export const filterParsers = {
  search: parseAsString.withDefault(""),
  order: parseAsStringLiteral(["asc", "desc"] as const).withDefault("desc"),
}

export const featuredParser = {
  featured: parseAsStringLiteral(["true", "false"] as const),
}

/**
 * Shared method factories for list filter hooks.
 *
 * Each feature hook defines its own nuqs schema and passes `setQuery` to these helpers.
 * This avoids duplicating onSearchChange/onSortOrderChange logic across features.
 */
export function createFilterMethods(
  setQuery: ReturnType<typeof useQueryStates>[1],
  sortFields: string[],
) {
  const onSearchChange = (search: string) => {
    setQuery((prev) => ({ ...prev, search }))
  }

  const onSortOrderChange = (value: string) => {
    const [sort, order] = value.split("-")
    if (!sortFields.includes(sort)) return
    if (order !== "asc" && order !== "desc") return
    setQuery((prev) => ({ ...prev, sort, order }))
  }

  const onFeaturedChange = (featured: "true" | "false" | null) => {
    setQuery((prev) => ({ ...prev, featured }))
  }

  return { onSearchChange, onSortOrderChange, onFeaturedChange }
}