import { DateToString } from "@/utils/date-to-string.type"

import type { Image as TImage } from "backend/generated/prisma/client"

export type Image = DateToString<TImage>
