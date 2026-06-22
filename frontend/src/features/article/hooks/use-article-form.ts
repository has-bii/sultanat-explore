"use client"

import { useAppForm } from "@/lib/form"

import {
  type CreateArticleInput,
  createArticleSchema,
} from "backend/modules/article/article.schema"

interface Props {
  defaultValues?: Partial<CreateArticleInput>
  onSubmit: (value: CreateArticleInput) => Promise<void> | void
}

export function useArticleForm({ defaultValues, onSubmit }: Props) {
  const formValues: CreateArticleInput = {
    title: defaultValues?.title ?? "",
    excerpt: defaultValues?.excerpt ?? "",
    content: defaultValues?.content ?? null,
    imageId: defaultValues?.imageId ?? "",
    categoryId: defaultValues?.categoryId ?? "_none",
    published: defaultValues?.published ?? false,
    featured: defaultValues?.featured ?? false,
  }

  const form = useAppForm({
    defaultValues: formValues,
    validators: {
      onChange: createArticleSchema,
    },
    onSubmit: async ({ value }) => {
      // Convert _none sentinel to undefined for optional categoryId
      const cleaned = {
        ...value,
        categoryId: value.categoryId === "_none" ? undefined : value.categoryId,
      }
      await onSubmit(cleaned)
    },
  })

  return form
}
