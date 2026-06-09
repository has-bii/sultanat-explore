"use client"

import { useState } from "react"

import { forgotPasswordSchema } from "@/features/auth/dto/auth.schema"
import { authClient } from "@/lib/auth-client"
import { useAppForm } from "@/lib/form"

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const form = useAppForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null)
      const { error } = await authClient.requestPasswordReset({
        email: value.email,
        redirectTo: "/admin/reset-password",
      })
      if (error) {
        setFormError(error.message ?? "Gagal mengirim email reset.")
        return
      }
      setSent(true)
    },
  })

  if (sent) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p className="text-muted-foreground text-sm">
          Link reset password telah dikirim ke email Anda. Cek inbox dan folder spam.
        </p>
        <a
          href="/admin/login"
          className="text-foreground text-sm underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          Kembali ke login
        </a>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="flex flex-col gap-6"
    >
      <form.AppField
        name="email"
        children={(field) => (
          <field.TextField label="Email" type="email" placeholder="admin@sultanatexplore.com" />
        )}
      />

      {formError && (
        <div role="alert" className="text-destructive text-sm">
          {formError}
        </div>
      )}

      <form.AppForm>
        <form.SubmitButton label="Kirim Link Reset" pendingLabel="Mengirim..." />
      </form.AppForm>
    </form>
  )
}
