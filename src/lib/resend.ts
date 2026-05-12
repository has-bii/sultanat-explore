import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function sendResetPasswordEmail({
  to,
  url,
}: {
  to: string
  url: string
}) {
  await resend.emails.send({
    from: "Sultanat Explore <noreply@sultanatexplore.com>",
    to,
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
}
