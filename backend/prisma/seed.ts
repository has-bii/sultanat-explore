/* eslint-disable no-console */
import "dotenv/config"

import { PrismaNeon } from "@prisma/adapter-neon"
import { hashPassword } from "better-auth/crypto"

import { PrismaClient } from "backend/generated/prisma/client"

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error("DATABASE_URL is not set")

const adapter = new PrismaNeon({ connectionString })

export const db = new PrismaClient({ adapter })

export async function main() {
  const name = "Admin Sultanat"
  const email = "admin@example.com"
  const password = "admin123"
  const hashedPassword = await hashPassword(password)

  const isExist = await db.user.findUnique({
    where: { email },
    select: { id: true },
  })

  if (isExist) {
    console.log("Admin account already exists")
    return
  }

  await db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        emailVerified: true,
        role: "admin",
      },
      select: { id: true },
    })

    await tx.account.create({
      data: {
        userId: user.id,
        accountId: user.id,
        providerId: "credential",
        password: hashedPassword,
      },
    })
  })

  console.log("Admin account created successfully")
}

main()
  .catch((e: unknown) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
