import { ArticleFeaturedSection } from "@/features/article/public/components/article-featured-section"
import { ArticleListSection } from "@/features/article/public/components/article-list-section"
import { HeroSection } from "@/features/article/public/components/hero-section"
import { articleSearchParamsCache } from "@/features/article/public/search-params"
import type { Metadata } from "next"
import type { SearchParams } from "nuqs/server"

type Props = {
  searchParams: Promise<SearchParams>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category, search } = await articleSearchParamsCache.parse(searchParams)
  const isFiltered = Boolean(category || search)

  const title = "Artikel & Tips Perjalanan Turki & Umrah | SultanatExplore"
  const description =
    "Panduan perjalanan, tips praktis, dan inspirasi untuk petualangan Anda ke Turki dan Tanah Suci. Temukan artikel terbaru dari Tim SultanatExplore."

  return {
    title,
    description,
    alternates: { canonical: "/artikel" },
    robots: isFiltered ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: "/artikel",
      type: "website",
    },
  }
}

export default function ArtikelPage({ searchParams }: Props) {
  return (
    <main>
      <HeroSection />
      <ArticleFeaturedSection />
      <ArticleListSection searchParams={searchParams} />
    </main>
  )
}
