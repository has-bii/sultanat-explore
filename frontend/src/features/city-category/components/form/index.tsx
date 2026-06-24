"use client"

import { Plus, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"

import { useCityCategoryForm } from "../../hooks/use-city-category-form"

interface CityCategoryFormProps {
  form: ReturnType<typeof useCityCategoryForm>
  mode: "create" | "edit"
  isPending: boolean
  onCancel?: () => void
}

export function CityCategoryForm(props: CityCategoryFormProps) {
  const { form, mode, isPending, onCancel } = props

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.AppField
          name="name"
          children={(field) => (
            <field.TextField label="Nama Kategori" placeholder="Kota Metropolitan" />
          )}
        />

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" disabled={isPending} onClick={onCancel}>
              Batal
            </Button>
          )}
          <form.AppForm>
            <form.SubmitButton
              label={mode === "edit" ? "Simpan" : "Tambah"}
              pendingLabel="Menyimpan..."
              isDisabled={isPending}
              icon={mode === "edit" ? Save : Plus}
            />
          </form.AppForm>
        </div>
      </FieldGroup>
    </form>
  )
}
