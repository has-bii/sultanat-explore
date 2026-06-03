import { prismaAdapter } from "better-auth/adapters/prisma"
import { betterAuth } from "better-auth/minimal"

import { db } from "./db"
import { sendResetPasswordEmail } from "./resend"

export const auth = betterAuth({
  database: prismaAdapter(db, {
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
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  advanced: {
    cookiePrefix: process.env.COOKIE_PREFIX,
    database: {
      generateId: false,
    },
  },
})
