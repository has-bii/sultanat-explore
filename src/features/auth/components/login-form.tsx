"use client"

import { useState } from "react"

import { loginSchema } from "@/features/auth/dto/auth.schema"
import { authClient } from "@/lib/auth-client"
import { useAppForm } from "@/lib/form"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    } as const,
    validators: {
      onSubmit: ({ value }) => {
        const result = loginSchema.safeParse(value)
        if (!result.success) return result.error.issues
      },
    },
    onSubmit: async ({ value }) => {
      setFormError(null)
      const { error } = await authClient.signIn.email({
        email: value.email,
        password: value.password,
      })
      if (error) {
        setFormError(error.message ?? "Login gagal. Periksa email dan password.")
        return
      }
      router.push("/admin/dashboard")
    },
  })

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

      <form.AppField name="password">
        {(field) => (
          <field.TextField
            field={field}
            label="Password"
            type="password"
            placeholder="Masukkan password"
          />
        )}
      </form.AppField>

      {formError && (
        <div role="alert" className="text-destructive text-sm">
          {formError}
        </div>
      )}

      <form.SubmitButton form={form} label="Masuk" pendingLabel="Memproses..." />

      <a
        href="/admin/forgot-password"
        className="text-muted-foreground hover:text-foreground text-center text-sm transition-colors"
      >
        Lupa password?
      </a>
    </form>
  )
}
