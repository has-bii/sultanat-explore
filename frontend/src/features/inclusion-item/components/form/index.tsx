"use client"

import { Plus, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"

import { useInclusionItemForm } from "../../hooks/use-inclusion-item-form"

interface InclusionItemFormProps {
  form: ReturnType<typeof useInclusionItemForm>
  mode: "create" | "edit"
  isPending: boolean
  onCancel?: () => void
}

export function InclusionItemForm(props: InclusionItemFormProps) {
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
          name="label"
          children={(field) => (
            <field.TextField label="Label" placeholder="Tiket pesawat" />
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
