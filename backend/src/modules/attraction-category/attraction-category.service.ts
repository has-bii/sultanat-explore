import { HTTPException } from "hono/http-exception"

import { db } from "backend/lib/db"
import { toSlug } from "backend/lib/slug"
import type {
  CreateAttractionCategoryInput,
  UpdateAttractionCategoryInput,
} from "backend/modules/attraction-category/attraction-category.schema"

const include = { _count: { select: { attractions: true } } } as const

export async function listAttractionCategories() {
  return db.attractionCategory.findMany({
    include,
    orderBy: { name: "asc" },
  })
}

export async function getAttractionCategory(id: string) {
  const category = await db.attractionCategory.findUnique({ where: { id }, include })
  if (!category) throw new HTTPException(404, { message: "Kategori tidak ditemukan" })
  return category
}

export async function createAttractionCategory(input: CreateAttractionCategoryInput) {
  const slug = toSlug(input.name)

  const existing = await db.attractionCategory.findUnique({ where: { slug } })
  if (existing) throw new HTTPException(409, { message: "Slug sudah digunakan" })

  return db.attractionCategory.create({
    data: { name: input.name, slug },
    include,
  })
}

export async function updateAttractionCategory(id: string, input: UpdateAttractionCategoryInput) {
  const existing = await db.attractionCategory.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Kategori tidak ditemukan" })

  if (input.name) {
    const slug = toSlug(input.name)
    const slugTaken = await db.attractionCategory.findFirst({
      where: { slug, id: { not: id } },
    })
    if (slugTaken) throw new HTTPException(409, { message: "Slug sudah digunakan" })

    return db.attractionCategory.update({
      where: { id },
      data: { name: input.name, slug },
      include,
    })
  }

  return db.attractionCategory.update({
    where: { id },
    data: {},
    include,
  })
}

export async function deleteAttractionCategory(id: string) {
  const existing = await db.attractionCategory.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Kategori tidak ditemukan" })

  await db.attractionCategory.delete({ where: { id } })
}
