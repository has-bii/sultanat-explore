"use client"

import { Suspense, useState } from "react"

import { resetPasswordSchema } from "@/features/auth/dto/auth.schema"
import { authClient } from "@/lib/auth-client"
import { useAppForm } from "@/lib/form"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

function ResetPasswordFormInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [formError, setFormError] = useState<string | null>(null)

  const form = useAppForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null)
      if (!token) {
        setFormError("Token reset tidak ditemukan. Request ulang dari link forgot password.")
        return
      }
      const { error } = await authClient.resetPassword({
        newPassword: value.password,
        token,
      })
      if (error) {
        setFormError(error.message ?? "Gagal reset password.")
        return
      }
      router.push("/admin/login")
    },
  })

  if (!token) {
    return (
      <div className="text-destructive text-center text-sm">
        Token reset tidak valid atau sudah kadaluarsa.{" "}
        <Link href="/admin/forgot-password" className="underline underline-offset-4">
          Request ulang
        </Link>
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
        name="password"
        children={(field) => (
          <field.TextField label="Password Baru" type="password" placeholder="Minimal 8 karakter" />
        )}
      />

      <form.AppField
        name="confirmPassword"
        children={(field) => (
          <field.TextField
            label="Konfirmasi Password"
            type="password"
            placeholder="Ulangi password"
          />
        )}
      />

      {formError && (
        <div role="alert" className="text-destructive text-sm">
          {formError}
        </div>
      )}

      <form.AppForm>
        <form.SubmitButton label="Reset Password" pendingLabel="Memproses..." />
      </form.AppForm>
    </form>
  )
}

export function ResetPasswordForm() {
  return (
    <Suspense>
      <ResetPasswordFormInner />
    </Suspense>
  )
}
