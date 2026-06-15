"use client"

import { Plus, Save } from "lucide-react"

import { ErrorComponent } from "@/components/error-component"
import { Field, FieldGroup } from "@/components/ui/field"
import { SelectItem } from "@/components/ui/select"

import { useAttractionForm } from "../../hooks/use-attraction-form"

interface AttractionFormProps {
  form: ReturnType<typeof useAttractionForm>
  mode: "create" | "edit"
  error: Error | null
  isPending: boolean
  showDestinationSelector?: boolean
  destinations?: Array<{ id: string; name: string }>
}

export function AttractionForm(props: AttractionFormProps) {
  const { form, mode, error, isPending, showDestinationSelector, destinations } = props

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
        {showDestinationSelector && destinations && (
          <form.AppField
            name="destinationId"
            children={(field) => (
              <field.SelectField label="Destinasi" placeholder="Pilih destinasi">
                {destinations.map((d) => (
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
            title={`Gagal ${mode === "create" ? "menambahkan" : "memperbarui"} atraksi`}
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
            <field.TextareaField label="Deskripsi" placeholder="Deskripsi atraksi..." rows={4} />
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
