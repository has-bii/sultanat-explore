import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { Resend } from "resend"
import prisma from "./prisma"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      if (!resend) {
        console.log("[auth] Password reset URL:", url)
        return
      }
      await resend.emails.send({
        from: "Sultanat Explore <noreply@sultanatexplore.com>",
        to: user.email,
        subject: "Reset Password - Sultanat Explore",
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="font-size: 1.25rem; font-weight: 700;">Reset Password</h2>
            <p>Klik link di bawah untuk reset password akun admin Anda:</p>
            <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 999px; margin: 16px 0;">
              Reset Password
            </a>
            <p style="color: #6b6b6b; font-size: 0.875rem;">Link berlaku 1 jam. Jika Anda tidak meminta reset, abaikan email ini.</p>
          </div>
        `,
      })
    },
  },
})

export type Auth = typeof auth
