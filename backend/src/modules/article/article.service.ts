import { HTTPException } from "hono/http-exception"

import { Prisma } from "backend/generated/prisma/client"
import { db } from "backend/lib/db"
import { cursorArgs, toPage } from "backend/lib/paginate"
import { imageCardSelect } from "backend/lib/prisma-fragments"
import { toSlug } from "backend/lib/slug"
import { assertImageExists } from "backend/modules/image/image.service"
import type {
  ArticleQueryOutput,
  CreateArticleInput,
  UpdateArticleInput,
} from "backend/modules/article/article.schema"

const authorSelect = {
  id: true,
  name: true,
  image: true,
} as const

const categorySelect = {
  id: true,
  slug: true,
  name: true,
} as const

const includeList = {
  image: { select: imageCardSelect },
  author: { select: authorSelect },
  category: { select: categorySelect },
} as const

// Detail uses same include — content is a column on the row
const includeDetail = includeList

export async function listArticles(params: ArticleQueryOutput) {
  const { cursor, limit, search, category, sort, order } = params

  let categoryId: string | undefined
  if (category) {
    const cat = await db.category.findUnique({ where: { slug: category } })
    if (!cat) {
      return toPage([], limit)
    }
    categoryId = cat.id
  }

  const where: Prisma.ArticleWhereInput = {
    published: true,
    ...(categoryId ? { categoryId } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { excerpt: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  }

  const articles = await db.article.findMany({
    ...cursorArgs({ cursor, limit }),
    where,
    orderBy: { [sort]: order },
    include: includeList,
  })

  return toPage(articles, limit)
}

export async function getArticleBySlug(slug: string) {
  const article = await db.article.findUnique({
    where: { slug },
    include: includeDetail,
  })
  if (!article) throw new HTTPException(404, { message: "Artikel tidak ditemukan" })
  return article
}

export async function getArticle(id: string) {
  const article = await db.article.findUnique({
    where: { id },
    include: includeDetail,
  })
  if (!article) throw new HTTPException(404, { message: "Artikel tidak ditemukan" })
  return article
}

export async function getRelatedArticles(slug: string, limit: number) {
  const current = await db.article.findUnique({
    where: { slug },
    select: { id: true, categoryId: true },
  })
  if (!current) throw new HTTPException(404, { message: "Artikel tidak ditemukan" })

  // Same category first (excluding self), then others (excluding self)
  const sameCategory = current.categoryId
    ? await db.article.findMany({
        where: {
          published: true,
          id: { not: current.id },
          categoryId: current.categoryId,
        },
        orderBy: { publishedAt: "desc" },
        take: limit,
        include: includeList,
      })
    : []

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit)
  }

  const remaining = limit - sameCategory.length
  const others = await db.article.findMany({
    where: {
      published: true,
      id: { not: current.id },
      ...(current.categoryId ? { categoryId: { not: current.categoryId } } : {}),
    },
    orderBy: { publishedAt: "desc" },
    take: remaining,
    include: includeList,
  })

  return [...sameCategory, ...others]
}

export async function createArticle(input: CreateArticleInput) {
  const slug = toSlug(input.title)

  const existingSlug = await db.article.findUnique({ where: { slug } })
  if (existingSlug) throw new HTTPException(409, { message: "Slug sudah digunakan" })

  await assertImageExists(input.imageId)

  if (input.categoryId) {
    const category = await db.category.findUnique({ where: { id: input.categoryId } })
    if (!category) throw new HTTPException(400, { message: "Kategori tidak ditemukan" })
  }

  const author = await db.user.findUnique({ where: { id: input.authorId } })
  if (!author) throw new HTTPException(400, { message: "Penulis tidak ditemukan" })

  return db.article.create({
    data: {
      title: input.title,
      slug,
      excerpt: input.excerpt,
      content: input.content as Prisma.InputJsonValue,
      imageId: input.imageId,
      categoryId: input.categoryId ?? null,
      authorId: input.authorId,
      date: new Date(input.date),
      published: input.published,
      publishedAt: input.published ? new Date() : null,
    },
    include: includeList,
  })
}

export async function updateArticle(id: string, input: UpdateArticleInput) {
  const existing = await db.article.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Artikel tidak ditemukan" })

  const data: Prisma.ArticleUpdateInput = {}

  if (input.title !== undefined) {
    const slug = toSlug(input.title)
    const slugTaken = await db.article.findFirst({
      where: { slug, id: { not: id } },
    })
    if (slugTaken) throw new HTTPException(409, { message: "Slug sudah digunakan" })
    data.title = input.title
    data.slug = slug
  }

  if (input.excerpt !== undefined) data.excerpt = input.excerpt
  if (input.content !== undefined) data.content = input.content as Prisma.InputJsonValue
  if (input.date !== undefined) data.date = new Date(input.date)

  if (input.imageId !== undefined) {
    await assertImageExists(input.imageId)
    data.image = { connect: { id: input.imageId } }
  }

  if (input.categoryId !== undefined) {
    if (input.categoryId === null || input.categoryId === "") {
      data.category = { disconnect: true }
    } else {
      const category = await db.category.findUnique({ where: { id: input.categoryId } })
      if (!category) throw new HTTPException(400, { message: "Kategori tidak ditemukan" })
      data.category = { connect: { id: input.categoryId } }
    }
  }

  if (input.authorId !== undefined) {
    const author = await db.user.findUnique({ where: { id: input.authorId } })
    if (!author) throw new HTTPException(400, { message: "Penulis tidak ditemukan" })
    data.author = { connect: { id: input.authorId } }
  }

  // Publish transition: false→true sets publishedAt to now
  if (input.published !== undefined && input.published !== existing.published) {
    data.published = input.published
    if (input.published === true) {
      data.publishedAt = new Date()
    }
  }

  return db.article.update({
    where: { id },
    data,
    include: includeList,
  })
}

export async function deleteArticle(id: string) {
  const existing = await db.article.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Artikel tidak ditemukan" })

  await db.article.delete({ where: { id } })
}
