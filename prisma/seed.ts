import { PrismaClient } from "@/app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
})

// Minimal auth instance for password hashing
const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
})

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@sultanatexplore.com"
  const name = process.env.ADMIN_NAME ?? "Admin"
  const password = process.env.ADMIN_PASSWORD ?? "admin12345678"

  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log(`Admin user already exists: ${email}`)
    return
  }

  // Use Better Auth's signUp API to hash password correctly
  const result = await auth.api.signUpEmail({
    body: {
      email,
      name,
      password,
    },
  })

  console.log(`Admin user created: ${email}`)
  console.log(`User ID: ${result.user.id}`)
}

main()
  .catch((e) => {
    console.error("Seed failed:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
