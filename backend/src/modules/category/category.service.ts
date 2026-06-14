import { HTTPException } from "hono/http-exception"

import { db } from "backend/lib/db"
import { toSlug } from "backend/lib/slug"
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "backend/modules/category/category.schema"

export async function listCategories() {
  return db.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { articles: true } },
    },
  })
}

export async function getCategory(id: string) {
  const category = await db.category.findUnique({ where: { id } })
  if (!category) throw new HTTPException(404, { message: "Kategori tidak ditemukan" })
  return category
}

export async function getCategoryBySlug(slug: string) {
  const category = await db.category.findUnique({ where: { slug } })
  if (!category) throw new HTTPException(404, { message: "Kategori tidak ditemukan" })
  return category
}

export async function createCategory(input: CreateCategoryInput) {
  const slug = toSlug(input.name)

  const existingSlug = await db.category.findUnique({ where: { slug } })
  if (existingSlug) throw new HTTPException(409, { message: "Slug sudah digunakan" })

  return db.category.create({
    data: {
      name: input.name,
      slug,
    },
  })
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
  const existing = await db.category.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Kategori tidak ditemukan" })

  const data: { name?: string; slug?: string } = {}

  if (input.name !== undefined) {
    const slug = toSlug(input.name)
    const slugTaken = await db.category.findFirst({
      where: { slug, id: { not: id } },
    })
    if (slugTaken) throw new HTTPException(409, { message: "Slug sudah digunakan" })
    data.name = input.name
    data.slug = slug
  }

  return db.category.update({
    where: { id },
    data,
  })
}

export async function deleteCategory(id: string) {
  const existing = await db.category.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Kategori tidak ditemukan" })

  await db.category.delete({ where: { id } })
}
