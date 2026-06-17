"use client"

import { Suspense } from "react"

import { ErrorComponent } from "@/components/error-component"
import { resetPasswordSchema } from "@/features/auth/dto/auth.schema"
import { useAppForm } from "@/lib/form"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { useResetPassword } from "../mutations/reset-password.mutation"

function ResetPasswordFormInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const { mutate, isPending, error } = useResetPassword()

  const form = useAppForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      if (!token) return

      mutate(
        { token, password: value.password },
        {
          onSuccess: () => {
            router.push("/admin/login")
          },
        },
      )
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
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="flex flex-col gap-6"
    >
      {error && <ErrorComponent title="Gagal reset password" message={error.message} />}

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

      <form.AppForm>
        <form.SubmitButton
          label="Reset Password"
          pendingLabel="Memproses..."
          isDisabled={isPending}
        />
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
