"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { Undo2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCategoriesQueryOptions } from "@/features/category/queries"
import Link from "next/link"

import type { CreateArticleInput } from "backend/modules/article/article.schema"

import { ArticleForm } from "../components/form"
import { DeleteArticleDialog } from "../components/dialog/delete"
import { useArticleForm } from "../hooks/use-article-form"
import { useUpdateArticle } from "../mutations/update-article.mutation"
import { getArticleQueryOptions } from "../queries"

interface Props {
  articleId: string
}

export function EditArticlePage({ articleId }: Props) {
  const { data: article } = useSuspenseQuery(getArticleQueryOptions(articleId))
  const { data: categories } = useSuspenseQuery(getCategoriesQueryOptions())
  const { mutate, isPending, error } = useUpdateArticle(articleId)

  const form = useArticleForm({
    defaultValues: {
      title: article.title,
      excerpt: article.excerpt,
      content: article.content as Record<string, unknown>,
      imageId: article.imageId,
      categoryId: article.categoryId ?? undefined,
      published: article.published,
    },
    onSubmit: (value: CreateArticleInput) => {
      mutate(value)
    },
  })

  return (
    <div className="mx-auto mt-10 w-full max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="line-clamp-1 text-2xl font-semibold">{article.title}</h1>
        <div className="inline-flex items-center gap-2">
          <DeleteArticleDialog articleId={articleId} articleTitle={article.title} />
          <Button asChild variant="secondary">
            <Link href="/admin/dashboard/article">
              <Undo2 data-icon="inline-start" />
              <span>Kembali</span>
            </Link>
          </Button>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader className="border-b">
          <CardTitle>Edit Artikel</CardTitle>
          <CardDescription>Ubah detail artikel</CardDescription>
        </CardHeader>
        <CardContent>
          <ArticleForm
            form={form}
            mode="edit"
            isPending={isPending}
            error={error}
            categories={categories}
          />
        </CardContent>
      </Card>
    </div>
  )
}
