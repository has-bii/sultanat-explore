import { fetchAllPublishedArticles } from "@/features/article/public/lib/fetch"
import { parseISO } from "date-fns"
import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sultanatexplore.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await fetchAllPublishedArticles()

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${siteUrl}/artikel/${a.slug}`,
    lastModified: parseISO(a.updatedAt),
    priority: 0.7,
  }))

  return [
    { url: `${siteUrl}/`, lastModified: new Date(), priority: 1.0 },
    { url: `${siteUrl}/artikel`, lastModified: new Date(), priority: 0.6 },
    ...articleEntries,
  ]
}
