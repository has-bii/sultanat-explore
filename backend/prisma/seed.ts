import { PrismaClient } from "@backend/generated/prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { hashPassword } from "better-auth/crypto"
import "dotenv/config"

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
})

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
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
