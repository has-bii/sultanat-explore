"use client"

import { Plus, Save } from "lucide-react"

import { ErrorComponent } from "@/components/error-component"
import { TiptapEditor } from "@/components/tiptap"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { SelectItem } from "@/components/ui/select"
import { CategoryDialog } from "@/features/category/components/dialog"
import type { GetCategoriesResponse } from "@/features/category/queries"
import { useCategoryDialogStore } from "@/features/category/stores/category-dialog.store"
import Link from "next/link"

import { useArticleForm } from "../../hooks/use-article-form"

interface ArticleFormProps {
  form: ReturnType<typeof useArticleForm>
  mode: "create" | "edit"
  error: Error | null
  isPending: boolean
  categories: GetCategoriesResponse["data"]
}

export function ArticleForm(props: ArticleFormProps) {
  const { form, mode, error, isPending, categories } = props
  const onOpenCategoryDialog = useCategoryDialogStore((s) => s.onOpen)

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
            title={`Gagal ${mode === "create" ? "menambahkan" : "memperbarui"} artikel`}
            message={error.message}
          />
        )}

        {/* Title */}
        <form.AppField
          name="title"
          children={(field) => <field.TextField label="Judul" placeholder="Judul artikel..." />}
        />

        {/* Excerpt */}
        <form.AppField
          name="excerpt"
          children={(field) => (
            <field.TextareaField
              label="Ringkasan"
              placeholder="Ringkasan singkat artikel..."
              rows={3}
            />
          )}
        />

        {/* Content — TipTap editor (not a form field, handled separately) */}
        <form.Field name="content">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel>Konten</FieldLabel>
                <TiptapEditor
                  content={field.state.value as Record<string, unknown> | null}
                  onChange={(json) => field.handleChange(json)}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <div className="grid grid-cols-2 gap-4">
          {/* Image */}
          <form.AppField
            name="imageId"
            children={(field) => (
              <field.ImagePickerField
                label="Gambar Utama"
                description="Pilih gambar untuk artikel"
              />
            )}
          />

          {/* Category */}
          <form.AppField
            name="categoryId"
            children={(field) => (
              <field.SelectField
                label="Kategori"
                placeholder="Pilih kategori"
                trailing={
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={() => onOpenCategoryDialog(null)}
                  >
                    <Plus />
                  </Button>
                }
              >
                <SelectItem value="_none">Tanpa Kategori</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </field.SelectField>
            )}
          />
        </div>

        {/* Published toggle */}
        <form.AppField
          name="published"
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
                    Publish
                  </FieldLabel>
                  <FieldDescription>
                    Hanya akan menampilkan published artikel ke pengunjung.
                  </FieldDescription>
                </FieldContent>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />

        <CategoryDialog />

        {/* Actions */}
        <Field orientation="horizontal" className="justify-end">
          {mode === "create" && (
            <Button type="button" variant="outline" disabled={isPending} asChild>
              <Link href="/admin/dashboard/article">Batal</Link>
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
