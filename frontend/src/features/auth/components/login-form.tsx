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
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      setFormError(null)
      const { error } = await authClient.signIn.email({
        email: value.email,
        password: value.password,
      })
      formApi.reset()
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
      <form.AppField
        name="email"
        children={(field) => (
          <field.TextField label="Email" type="email" placeholder="admin@sultanatexplore.com" />
        )}
      />

      <form.AppField
        name="password"
        children={(field) => (
          <field.TextField label="Password" type="password" placeholder="Masukkan password" />
        )}
      />

      {formError && (
        <div role="alert" className="text-destructive text-sm">
          {formError}
        </div>
      )}

      <form.AppForm>
        <form.SubmitButton label="Masuk" pendingLabel="Memproses..." />
      </form.AppForm>

      <a
        href="/admin/forgot-password"
        className="text-muted-foreground hover:text-foreground text-center text-sm transition-colors"
      >
        Lupa password?
      </a>
    </form>
  )
}
