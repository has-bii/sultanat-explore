import { createSearchParamsCache, parseAsString } from "nuqs/server"

export const destinationSearchParamsCache = createSearchParamsCache({
  category: parseAsString,
  search: parseAsString,
})