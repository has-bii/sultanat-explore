import { ResetPasswordForm } from "@/features/auth"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reset Password — Sultanat Explore",
}

export default function ResetPasswordPage() {
  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-small-heading font-heading font-bold">Reset Password</h1>
        <p className="text-caption text-muted-foreground mt-2">
          Buat password baru untuk akun admin Anda
        </p>
      </div>
      <ResetPasswordForm />
    </>
  )
}
