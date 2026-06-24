import { fetchAllPublishedArticles } from "@/features/article/public/lib/fetch"
import { fetchAllCitySlugs } from "@/features/city/public/lib/fetch"
import { parseISO } from "date-fns"
import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sultanatexplore.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let articles: Awaited<ReturnType<typeof fetchAllPublishedArticles>> = []
  let cities: Awaited<ReturnType<typeof fetchAllCitySlugs>> = []

  try {
    ;[articles, cities] = await Promise.all([
      fetchAllPublishedArticles(),
      fetchAllCitySlugs(),
    ])
  } catch {
    // During build, API may be unavailable — return static entries only
  }

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${siteUrl}/artikel/${a.slug}`,
    lastModified: parseISO(a.updatedAt),
    priority: 0.7,
  }))

  const cityEntries: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${siteUrl}/destinations/${c.slug}`,
    lastModified: c.updatedAt ? parseISO(c.updatedAt) : new Date(),
    priority: 0.8,
  }))

  return [
    { url: `${siteUrl}/`, lastModified: new Date(), priority: 1.0 },
    { url: `${siteUrl}/destinations`, lastModified: new Date(), priority: 0.9 },
    ...cityEntries,
    { url: `${siteUrl}/artikel`, lastModified: new Date(), priority: 0.6 },
    ...articleEntries,
  ]
}
