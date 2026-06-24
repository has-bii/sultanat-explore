import { HTTPException } from "hono/http-exception"

import { db } from "backend/lib/db"
import { toSlug } from "backend/lib/slug"
import type {
  CreateCityCategoryInput,
  UpdateCityCategoryInput,
} from "backend/modules/city-category/city-category.schema"

export async function listCityCategories() {
  return db.cityCategory.findMany({
    orderBy: { name: "asc" },
  })
}

export async function getCityCategory(id: string) {
  const category = await db.cityCategory.findUnique({ where: { id } })
  if (!category) throw new HTTPException(404, { message: "Kategori kota tidak ditemukan" })
  return category
}

export async function getCityCategoryBySlug(slug: string) {
  const category = await db.cityCategory.findUnique({ where: { slug } })
  if (!category) throw new HTTPException(404, { message: "Kategori kota tidak ditemukan" })
  return category
}

export async function createCityCategory(input: CreateCityCategoryInput) {
  const slug = toSlug(input.name)

  const existingSlug = await db.cityCategory.findUnique({ where: { slug } })
  if (existingSlug) throw new HTTPException(409, { message: "Slug sudah digunakan" })

  return db.cityCategory.create({
    data: {
      name: input.name,
      slug,
    },
  })
}

export async function updateCityCategory(id: string, input: UpdateCityCategoryInput) {
  const existing = await db.cityCategory.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Kategori kota tidak ditemukan" })

  const data: { name?: string; slug?: string } = {}

  if (input.name !== undefined) {
    const slug = toSlug(input.name)
    const slugTaken = await db.cityCategory.findFirst({
      where: { slug, id: { not: id } },
    })
    if (slugTaken) throw new HTTPException(409, { message: "Slug sudah digunakan" })
    data.name = input.name
    data.slug = slug
  }

  return db.cityCategory.update({
    where: { id },
    data,
  })
}

export async function deleteCityCategory(id: string) {
  const existing = await db.cityCategory.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Kategori kota tidak ditemukan" })

  await db.cityCategory.delete({ where: { id } })
}