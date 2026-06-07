import { z } from "zod"

export const createAttractionSchema = z.object({
  name: z.string().min(1, "Nama harus diisi").max(100, "Nama maksimal 100 karakter"),
  description: z
    .string()
    .min(1, "Deskripsi harus diisi")
    .max(5000, "Deskripsi maksimal 5000 karakter"),
  imageId: z.uuid("ID gambar tidak valid"),
  categoryId: z.uuid("ID kategori tidak valid").optional(),
})

export const updateAttractionSchema = z.object({
  name: z.string().min(1, "Nama harus diisi").max(100, "Nama maksimal 100 karakter").optional(),
  description: z
    .string()
    .min(1, "Deskripsi harus diisi")
    .max(5000, "Deskripsi maksimal 5000 karakter")
    .optional(),
  imageId: z.uuid("ID gambar tidak valid").optional(),
  categoryId: z.uuid("ID kategori tidak valid").optional(),
})

export const attractionQuerySchema = z.object({
  cursor: z.uuidv7("Invalid cursor").optional().catch(undefined),
  limit: z.coerce.number<number>().min(10).max(100).default(10).catch(10),
  search: z.string().optional().catch(undefined),
  categoryId: z.uuid("ID kategori tidak valid").optional().catch(undefined),
  sort: z.enum(["name", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
})

export const addAttractionGalleryImageSchema = z.object({
  imageId: z.uuid("ID gambar tidak valid"),
  order: z.number().int().min(0).optional(),
})

export const reorderAttractionGallerySchema = z.object({
  imageIds: z.array(z.uuid("ID gambar tidak valid")).min(1, "Minimal 1 gambar"),
})

export type CreateAttractionInput = z.infer<typeof createAttractionSchema>
export type UpdateAttractionInput = z.infer<typeof updateAttractionSchema>
export type AttractionQueryInput = z.infer<typeof attractionQuerySchema>
export type AddAttractionGalleryImageInput = z.infer<typeof addAttractionGalleryImageSchema>
export type ReorderAttractionGalleryInput = z.infer<typeof reorderAttractionGallerySchema>
