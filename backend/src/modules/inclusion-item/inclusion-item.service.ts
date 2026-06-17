import { HTTPException } from "hono/http-exception"

import { Prisma } from "backend/generated/prisma/client"
import { db } from "backend/lib/db"
import { cursorArgs, toPage } from "backend/lib/paginate"
import { toSlug } from "backend/lib/slug"
import type {
  CreateInclusionItemInput,
  InclusionItemQueryOutput,
  UpdateInclusionItemInput,
} from "backend/modules/inclusion-item/inclusion-item.schema"

export async function listInclusionItems(query: InclusionItemQueryOutput) {
  const { cursor, limit, search } = query

  const where: Prisma.InclusionItemWhereInput = search
    ? {
        OR: [
          { label: { contains: search, mode: "insensitive" as const } },
          { slug: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {}

  const items = await db.inclusionItem.findMany({
    ...cursorArgs({ cursor, limit }),
    where,
    orderBy: { createdAt: "desc" },
  })

  return toPage(items, limit)
}

export async function getInclusionItem(id: string) {
  const item = await db.inclusionItem.findUnique({ where: { id } })
  if (!item) throw new HTTPException(404, { message: "Inclusion item tidak ditemukan" })
  return item
}

export async function createInclusionItem(input: CreateInclusionItemInput) {
  const slug = toSlug(input.label)
  const slugTaken = await db.inclusionItem.findUnique({ where: { slug } })
  if (slugTaken) throw new HTTPException(400, { message: "Slug sudah digunakan" })

  return db.inclusionItem.create({
    data: { slug, label: input.label },
  })
}

export async function updateInclusionItem(id: string, input: UpdateInclusionItemInput) {
  const existing = await db.inclusionItem.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Inclusion item tidak ditemukan" })

  const data: Prisma.InclusionItemUpdateInput = {}

  if (input.label !== undefined) {
    data.label = input.label
    const slug = toSlug(input.label)
    const slugTaken = await db.inclusionItem.findFirst({
      where: { slug, id: { not: id } },
    })
    if (slugTaken) throw new HTTPException(400, { message: "Slug sudah digunakan" })
    data.slug = slug
  }

  return db.inclusionItem.update({
    where: { id },
    data,
  })
}

export async function deleteInclusionItem(id: string) {
  const existing = await db.inclusionItem.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Inclusion item tidak ditemukan" })

  // Check referential integrity
  const referenced = await db.openTripInclusion.findFirst({
    where: { inclusionItemId: id },
  })
  if (referenced) {
    throw new HTTPException(409, {
      message: "Inclusion item masih digunakan oleh Open Trip. Hapus referensi terlebih dahulu.",
    })
  }

  await db.inclusionItem.delete({ where: { id } })
}
