"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { Undo2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getCategoriesQueryOptions } from "@/features/category/queries"
import Link from "next/link"
import { useRouter } from "next/navigation"

import type { CreateArticleInput } from "backend/modules/article/article.schema"

import { ArticleForm } from "../components/form"
import { useArticleForm } from "../hooks/use-article-form"
import { useCreateArticle } from "../mutations/create-article.mutation"

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
    <div className="mt-10 w-full">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tambah Artikel</h1>
        <Button asChild variant="secondary">
          <Link href="/admin/dashboard/article">
            <Undo2 data-icon="inline-start" />
            <span>Kembali</span>
          </Link>
        </Button>
      </div>

      <ArticleForm
        form={form}
        mode="create"
        isPending={isPending}
        error={error}
        categories={categories}
      />
    </div>
  )
}
