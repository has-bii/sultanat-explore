"use client"

import { forgotPasswordSchema } from "@/features/auth/dto/auth.schema"
import { authClient } from "@/lib/auth-client"
import { useAppForm } from "@/lib/form"
import { useState } from "react"

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const form = useAppForm({
    defaultValues: {
      email: "",
    } as const,
    validators: {
      onSubmit: ({ value }) => {
        const result = forgotPasswordSchema.safeParse(value)
        if (!result.success) return result.error.issues
      },
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
        <p className="text-sm text-muted-foreground">
          Link reset password telah dikirim ke email Anda. Cek inbox dan folder spam.
        </p>
        <a
          href="/admin/login"
          className="text-sm text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
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
      <form.AppField name="email">
        {(field) => (
          <field.TextField
            field={field}
            label="Email"
            type="email"
            placeholder="admin@sultanatexplore.com"
          />
        )}
      </form.AppField>

      {formError && (
        <div role="alert" className="text-sm text-destructive">
          {formError}
        </div>
      )}

      <form.SubmitButton form={form} label="Kirim Link Reset" pendingLabel="Mengirim..." />
    </form>
  )
}
