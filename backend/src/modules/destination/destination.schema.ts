import { z } from "zod"

export const createDestinationSchema = z.object({
  name: z.string().min(1, "Nama harus diisi").max(100, "Nama maksimal 100 karakter"),
  tagline: z.string().min(1, "Tagline harus diisi").max(200, "Tagline maksimal 200 karakter"),
  description: z
    .string()
    .min(1, "Deskripsi harus diisi")
    .max(5000, "Deskripsi maksimal 5000 karakter"),
  imageId: z.uuid("ID gambar tidak valid"),
  featured: z.boolean().optional().default(false),
  highlights: z
    .array(z.string().min(1).max(200, "Highlight maksimal 200 karakter"))
    .max(20, "Maksimal 20 highlights")
    .optional(),
})

export const updateDestinationSchema = z.object({
  name: z.string().min(1, "Nama harus diisi").max(100, "Nama maksimal 100 karakter").optional(),
  tagline: z
    .string()
    .min(1, "Tagline harus diisi")
    .max(200, "Tagline maksimal 200 karakter")
    .optional(),
  description: z
    .string()
    .min(1, "Deskripsi harus diisi")
    .max(5000, "Deskripsi maksimal 5000 karakter")
    .optional(),
  imageId: z.uuid("ID gambar tidak valid").optional(),
  featured: z.boolean().optional(),
  highlights: z
    .array(z.string().min(1).max(200, "Highlight maksimal 200 karakter"))
    .max(20, "Maksimal 20 highlights")
    .optional(),
})

export const destinationQuerySchema = z.object({
  cursor: z.uuidv7("Invalid cursor").optional().catch(undefined),
  limit: z.coerce.number<number>().min(10).max(100).default(10).catch(10),
  search: z.string().optional().catch(undefined),
  featured: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional()
    .catch(undefined),
  sort: z.enum(["name", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
})

export const addGalleryImageSchema = z.object({
  imageId: z.uuid("ID gambar tidak valid"),
  order: z.number().int().min(0).optional(),
})

export const reorderGallerySchema = z.object({
  imageIds: z.array(z.uuid("ID gambar tidak valid")).min(1, "Minimal 1 gambar"),
})

export type CreateDestinationInput = z.infer<typeof createDestinationSchema>
export type UpdateDestinationInput = z.infer<typeof updateDestinationSchema>
export type DestinationQueryInput = z.infer<typeof destinationQuerySchema>
export type AddGalleryImageInput = z.infer<typeof addGalleryImageSchema>
export type ReorderGalleryInput = z.infer<typeof reorderGallerySchema>
