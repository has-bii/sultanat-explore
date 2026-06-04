import "dotenv/config"

import { PrismaNeon } from "@prisma/adapter-neon"

import { PrismaClient } from "backend/generated/prisma/client"

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
})

export const db = new PrismaClient({ adapter })
