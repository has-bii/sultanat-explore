import {
  ArticleBody,
  ArticleHero,
  RelatedArticles,
} from "@/features/article/public/components/article-detail"
import { fetchArticleBySlug, fetchRelatedArticles } from "@/features/article/public/lib/fetch"
import type { JSONContent } from "@tiptap/core"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await fetchArticleBySlug(slug)
  if (!article) return {}

  const title = article.title
  const description = article.excerpt
  const url = `/artikel/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [{ url: article.image.url, width: 1200, height: 630 }],
      publishedTime: article.publishedAt ?? undefined,
      authors: article.author ? [article.author.name] : undefined,
    },
  }
}

export default async function ArtikelDetailPage({ params }: Props) {
  const { slug } = await params
  const article = await fetchArticleBySlug(slug)

  if (!article) notFound()

  const related = await fetchRelatedArticles(slug, 3)

  return (
    <main>
      <ArticleHero article={article} />

      {/* Article content */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <ArticleBody content={article.content as JSONContent} />
        </div>
      </section>

      <RelatedArticles articles={related} />
    </main>
  )
}
