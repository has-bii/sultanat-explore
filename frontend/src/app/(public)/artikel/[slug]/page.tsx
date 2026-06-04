import { ArticleBody, ArticleHero, AuthorCard, RelatedArticles } from "@/features/articles"
import { articles, getArticleBySlug } from "@/features/articles/data"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return {}

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      images: [{ url: article.thumbnail, width: 1200, height: 630 }],
      type: "article",
      publishedTime: article.date,
      authors: [article.author.name],
    },
  }
}

export default async function ArtikelDetailPage({ params }: Props) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) notFound()

  return (
    <main>
      <ArticleHero article={article} />

      {/* Article content */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <ArticleBody content={article.content} />

          {/* Author */}
          <div className="mt-12 border-t pt-8">
            <AuthorCard author={article.author} />
          </div>
        </div>
      </section>

      <RelatedArticles currentSlug={slug} />
    </main>
  )
}
