"use client"

import { Plus, Save, XIcon } from "lucide-react"

import { ErrorComponent } from "@/components/error-component"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import Link from "next/link"

import { useCityForm } from "../../hooks/use-city-form"
import { CityCategoryField } from "./category-field"

interface CityFormProps {
  form: ReturnType<typeof useCityForm>
  mode: "create" | "edit"
  error: Error | null
  isPending: boolean
}

export function CityForm(props: CityFormProps) {
  const { form, mode, error, isPending } = props

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        {error && (
          <ErrorComponent
            title={`Gagal ${mode === "create" ? "menambahkan" : "memperbarui"} kota`}
            message={error.message}
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          {/* Name */}
          <form.AppField
            name="name"
            children={(field) => <field.TextField label="Nama" placeholder="Istanbul" />}
          />

          {/* Tagline */}
          <form.AppField
            name="tagline"
            children={(field) => (
              <field.TextField label="Tagline" placeholder="Kota dua benua yang memukau" />
            )}
          />
        </div>

        {/* Description */}
        <form.AppField
          name="description"
          children={(field) => (
            <field.TextareaField label="Deskripsi" placeholder="Deskripsi destinasi..." rows={6} />
          )}
        />

        <div className="grid grid-cols-2 gap-4">
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

          {/* Highlights */}
          <form.Field name="highlights" mode="array">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <FieldSet className="gap-3">
                  <FieldLabel>Highlights</FieldLabel>
                  <FieldContent className="gap-2">
                    {field.state.value.map((_, i) => (
                      <form.Field
                        key={i}
                        name={`highlights[${i}]`}
                        children={(subField) => {
                          const isLast = i === field.state.value.length - 1
                          const canAdd = subField.state.value.length > 0
                          const isSubFieldInvalid =
                            subField.state.meta.isTouched && !subField.state.meta.isValid

                          return (
                            <Field data-invalid={isSubFieldInvalid} orientation="horizontal">
                              <FieldContent>
                                <InputGroup>
                                  <InputGroupInput
                                    id={subField.name}
                                    name={subField.name}
                                    value={subField.state.value}
                                    onBlur={subField.handleBlur}
                                    onChange={(e) => subField.handleChange(e.target.value)}
                                    aria-invalid={isSubFieldInvalid}
                                    placeholder="Hagia Sophia"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault()
                                        if (e.currentTarget.value.length > 0) field.pushValue("")
                                      }
                                    }}
                                  />
                                  <InputGroupAddon align="inline-end">
                                    <InputGroupButton
                                      type="button"
                                      variant="ghost"
                                      size="icon-xs"
                                      onClick={() =>
                                        isLast && canAdd
                                          ? field.pushValue("")
                                          : field.removeValue(i)
                                      }
                                      aria-label={`Remove email ${i + 1}`}
                                    >
                                      {isLast && canAdd ? <Plus /> : <XIcon />}
                                    </InputGroupButton>
                                  </InputGroupAddon>
                                </InputGroup>
                                {isSubFieldInvalid && (
                                  <FieldError errors={subField.state.meta.errors} />
                                )}
                              </FieldContent>
                            </Field>
                          )
                        }}
                      />
                    ))}
                  </FieldContent>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldSet>
              )
            }}
          </form.Field>
        </div>

        {/* Categories */}
        <form.Field name="categoryIds">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <CityCategoryField
                value={field.state.value ?? []}
                onChange={field.handleChange}
                isInvalid={isInvalid}
                errors={field.state.meta.errors}
              />
            )
          }}
        </form.Field>

        {/* Featured */}
        <form.AppField
          name="featured"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field orientation="horizontal" data-invalid={isInvalid}>
                <Checkbox
                  id={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                />
                <FieldContent>
                  <FieldLabel htmlFor={field.name} className="cursor-pointer">
                    Tandai sebagai unggulan
                  </FieldLabel>
                  <FieldDescription>
                    Destinasi yang ditandai sebagai unggulan akan muncul paling utama.
                  </FieldDescription>
                </FieldContent>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />

        {/* Actions */}
        <Field orientation="horizontal" className="justify-end">
          {mode === "create" && (
            <Button type="button" variant="outline" disabled={isPending} asChild>
              <Link href="/admin/dashboard/city">Batal</Link>
            </Button>
          )}
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
