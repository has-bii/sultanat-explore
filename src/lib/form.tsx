/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { createFormHook, createFormHookContexts } from "@tanstack/react-form"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export const { fieldContext, formContext } = createFormHookContexts()

function TextField({
  field,
  label,
  type = "text",
  placeholder,
}: {
  field: any
  label: string
  type?: string
  placeholder?: string
}) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Input
        type={type}
        placeholder={placeholder}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value as any)}
        aria-invalid={field.state.meta.errors.length > 0}
      />
      {field.state.meta.errors.length > 0 && (
        <FieldError>{field.state.meta.errors.map((e: any) => e?.message).join(", ")}</FieldError>
      )}
    </Field>
  )
}

function SubmitButton({
  form,
  label,
  pendingLabel,
}: {
  form: any
  label: string
  pendingLabel?: string
}) {
  return (
    <form.Subscribe selector={(state: any) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]: boolean[]) => (
        <Button type="submit" disabled={!canSubmit} className="w-full">
          {isSubmitting ? (pendingLabel ?? "Memproses...") : label}
        </Button>
      )}
    </form.Subscribe>
  )
}

const { useAppForm } = createFormHook({
  fieldComponents: { TextField },
  formComponents: { SubmitButton },
  fieldContext,
  formContext,
})

export { useAppForm }
