import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import prisma from "./prisma"
import { sendResetPasswordEmail } from "./resend"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    async sendResetPassword({ user, url }) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[auth] Password reset URL:", url)
        return
      }
      await sendResetPasswordEmail({ to: user.email, url })
    },
  },
})

export type Auth = typeof auth
