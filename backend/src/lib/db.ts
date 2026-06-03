import { PrismaClient } from "@backend/generated/prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import "dotenv/config"

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
})

export const db = new PrismaClient({ adapter })
