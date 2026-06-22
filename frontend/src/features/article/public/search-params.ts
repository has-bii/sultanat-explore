import { createSearchParamsCache, parseAsString } from "nuqs/server"

export const articleSearchParamsCache = createSearchParamsCache({
  category: parseAsString,
  search: parseAsString,
})
