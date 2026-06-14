"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { Save } from "lucide-react"

import { getAuthSessionQueryOptions } from "@/features/auth/query"

import { useProfileForm } from "../hooks/use-profile-form"
import { useUpdateProfile } from "../mutations/update-profile.mutation"
import { AvatarUpload } from "./avatar-upload"

export function ProfileSection() {
  const { data: session } = useSuspenseQuery(getAuthSessionQueryOptions())
  const { mutate, isPending } = useUpdateProfile()

  const form = useProfileForm({
    defaultValues: {
      name: session.user.name,
    },
    onSubmit: (value) => {
      mutate(value)
    },
  })

  return (
    <div className="w-full space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profil</h3>
        <p className="text-muted-foreground text-sm">Kelola informasi profil Anda.</p>
      </div>

      <AvatarUpload name={session.user.name} imageUrl={session.user.image} />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        <form.AppField
          name="name"
          children={(field) => <field.TextField label="Nama" placeholder="Nama lengkap" />}
        />

        <div className="grid gap-2">
          <label className="text-sm font-medium">Email</label>
          <input
            type="text"
            value={session.user.email}
            disabled
            className="bg-muted border-input h-9 rounded-md border px-3 py-1 text-sm opacity-60"
          />
          <p className="text-muted-foreground text-xs">Email tidak dapat diubah.</p>
        </div>

        <form.AppForm>
          <form.SubmitButton
            label="Simpan"
            pendingLabel="Menyimpan..."
            icon={Save}
            isDisabled={isPending}
          />
        </form.AppForm>
      </form>
    </div>
  )
}
