import { HeroSection, FeaturedArticle, ArticleGrid } from "@/features/articles"
import { getFeaturedArticles } from "@/features/articles/data"

export default function ArtikelPage() {
  const featured = getFeaturedArticles()

  return (
    <main>
      <HeroSection />
      {featured.length > 0 && <FeaturedArticle article={featured[0]} />}
      <ArticleGrid />
    </main>
  )
}
