import { use } from "react"

import { fetchFeaturedArticles } from "../../lib/fetch"
import { FeaturedCarousel } from "./carousel"
import { FeaturedEmpty } from "./empty"

interface Props {
  dataPromise: ReturnType<typeof fetchFeaturedArticles>
}

export function Featured({ dataPromise }: Props) {
  const articles = use(dataPromise)

  if (articles.length === 0) {
    return <FeaturedEmpty />
  }

  return <FeaturedCarousel articles={articles} />
}
