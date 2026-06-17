"use client"

import { useState } from "react"

import { ErrorComponent } from "@/components/error-component"
import { forgotPasswordSchema } from "@/features/auth/dto/auth.schema"
import { useAppForm } from "@/lib/form"
import Link from "next/link"

import { useForgotPassword } from "../mutations/forgot-password.mutation"

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false)
  const { mutate, isPending, error } = useForgotPassword()

  const form = useAppForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onChange: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      mutate(value.email, {
        onSuccess: () => {
          setSent(true)
        },
      })
    },
  })

  if (sent) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p className="text-muted-foreground text-sm">
          Link reset password telah dikirim ke email Anda. Cek inbox dan folder spam.
        </p>
        <Link
          href="/admin/login"
          className="text-foreground text-sm underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          Kembali ke login
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
      {error && <ErrorComponent title="Gagal mengirim link" message={error.message} />}

      <form.AppField
        name="email"
        children={(field) => (
          <field.TextField label="Email" type="email" placeholder="admin@sultanatexplore.com" />
        )}
      />

      <form.AppForm>
        <form.SubmitButton
          label="Kirim Link Reset"
          pendingLabel="Mengirim..."
          isDisabled={isPending}
        />
      </form.AppForm>
    </form>
  )
}
