"use client"

import { Plus, Save } from "lucide-react"

import { ErrorComponent } from "@/components/error-component"
import { Field, FieldGroup } from "@/components/ui/field"
import { SelectItem } from "@/components/ui/select"

import { useDestinationForm } from "../../hooks/use-destination-form"

interface DestinationFormProps {
  form: ReturnType<typeof useDestinationForm>
  mode: "create" | "edit"
  error: Error | null
  isPending: boolean
  showDestinationSelector?: boolean
  cities?: Array<{ id: string; name: string }>
}

export function DestinationForm(props: DestinationFormProps) {
  const { form, mode, error, isPending, showDestinationSelector, cities } = props

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        {/* Destination selector — only when not pre-set */}
        {showDestinationSelector && cities && (
          <form.AppField
            name="cityId"
            children={(field) => (
              <field.SelectField label="Kota" placeholder="Pilih kota">
                {cities.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </field.SelectField>
            )}
          />
        )}

        {error && (
          <ErrorComponent
            title={`Gagal ${mode === "create" ? "menambahkan" : "memperbarui"} destinasi`}
            message={error.message}
          />
        )}

        {/* Name */}
        <form.AppField
          name="name"
          children={(field) => <field.TextField label="Nama" placeholder="Hagia Sophia" />}
        />

        {/* Description */}
        <form.AppField
          name="description"
          children={(field) => (
            <field.TextareaField label="Deskripsi" placeholder="Deskripsi destinasi..." rows={4} />
          )}
        />

        {/* Hero Image */}
        <form.AppField
          name="imageId"
          children={(field) => (
            <field.ImagePickerField
              label="Foto Utama"
              description="Pilih foto yang berbentuk landscape"
            />
          )}
        />

        {/* Actions */}
        <Field orientation="horizontal" className="justify-end">
          <form.AppForm>
            <form.SubmitButton
              label={mode === "create" ? "Tambah" : "Perbarui"}
              pendingLabel="Menyimpan..."
              isDisabled={isPending}
              icon={mode === "create" ? Plus : Save}
            />
          </form.AppForm>
        </Field>
      </FieldGroup>
    </form>
  )
}
