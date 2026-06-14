"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { Save } from "lucide-react"

import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
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
    <div className="space-y-6">
      <AvatarUpload name={session.user.name} imageUrl={session.user.image} />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        <FieldGroup>
          <form.AppField
            name="name"
            children={(field) => <field.TextField label="Nama" placeholder="Nama lengkap" />}
          />

          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input type="text" value={session.user.email} disabled />
            <FieldDescription>Email tidak dapat diubah.</FieldDescription>
          </Field>

          <form.AppForm>
            <form.SubmitButton
              label="Simpan"
              pendingLabel="Menyimpan..."
              icon={Save}
              isDisabled={isPending}
            />
          </form.AppForm>
        </FieldGroup>
      </form>
    </div>
  )
}
