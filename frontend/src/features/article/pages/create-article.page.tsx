"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useSuspenseQuery } from "@tanstack/react-query"

import { getCategoriesQueryOptions } from "@/features/category/queries"

import { ArticleForm } from "../components/article-form"
import { useArticleForm } from "../hooks/use-article-form"
import { useCreateArticle } from "../mutations/create-article.mutation"
import type { CreateArticleInput } from "backend/modules/article/article.schema"

export function CreateArticlePage() {
  const router = useRouter()
  const { mutate, isPending, error } = useCreateArticle()
  const { data: categories } = useSuspenseQuery(getCategoriesQueryOptions())

  const onSubmit = async (value: CreateArticleInput) => {
    mutate(value, {
      onSuccess: () => {
        router.push("/admin/dashboard/article")
      },
    })
  }

  const form = useArticleForm({
    onSubmit,
  })

  return (
    <div className="mx-auto mt-10 w-full max-w-3xl">
      <Card className="w-full">
        <CardHeader className="border-b">
          <CardTitle>Tambah Artikel</CardTitle>
          <CardDescription>Buat artikel baru untuk blog</CardDescription>
        </CardHeader>
        <CardContent>
          <ArticleForm
            form={form}
            mode="create"
            isPending={isPending}
            error={error}
            categories={categories}
          />
        </CardContent>
      </Card>
    </div>
  )
}
