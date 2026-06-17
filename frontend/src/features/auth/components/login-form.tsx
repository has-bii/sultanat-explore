"use client"

import { ErrorComponent } from "@/components/error-component"
import { loginSchema } from "@/features/auth/dto/auth.schema"
import { useAppForm } from "@/lib/form"
import { useRouter } from "next/navigation"

import { useLogin } from "../mutations/login.mutation"

export function LoginForm() {
  const router = useRouter()
  const { mutate, isPending, error } = useLogin()

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      mutate(value, {
        onSuccess: () => {
          router.push("/admin/dashboard")
        },
      })
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="flex flex-col gap-6"
    >
      {error && <ErrorComponent title="Login gagal" message={error.message} />}

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

      <form.AppForm>
        <form.SubmitButton label="Masuk" pendingLabel="Memproses..." isDisabled={isPending} />
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
