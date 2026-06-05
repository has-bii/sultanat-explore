import { z } from "zod"

export const imageListQuerySchema = z.object({
  search: z.string().optional(),
  sort: z.enum(["createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  cursor: z.string().optional(),
  limit: z.number().min(10).max(100).default(20),
})

export type ImageListQuery = z.infer<typeof imageListQuerySchema>

export const imageSchema = z.object({
  id: z.string(),
  url: z.string(),
  alt: z.string().nullable(),
  fileSize: z.number(),
  blurHash: z.string(),
  createdAt: z.string(),
})

export type Image = z.infer<typeof imageSchema>

export const updateAltSchema = z.object({
  alt: z.string().optional(),
})

export type UpdateAltInput = z.infer<typeof updateAltSchema>
