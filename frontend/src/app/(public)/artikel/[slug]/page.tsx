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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sultanatexplore.com"

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

  const canonical = `${siteUrl}/artikel/${slug}`
  const imageUrl = article.image.url.startsWith("http")
    ? article.image.url
    : `${siteUrl}${article.image.url}`

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: [imageUrl],
    datePublished: article.publishedAt ?? undefined,
    dateModified: article.updatedAt ?? article.publishedAt ?? undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    ...(article.author ? { author: { "@type": "Person", name: article.author.name } } : {}),
    // TODO: replace /logo.png with a real brand logo asset path once available.
    publisher: {
      "@type": "Organization",
      name: "SultanatExplore",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Artikel", item: `${siteUrl}/artikel` },
      { "@type": "ListItem", position: 3, name: article.title, item: canonical },
    ],
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleLd, breadcrumbLd]),
        }}
      />

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
