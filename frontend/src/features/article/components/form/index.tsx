"use client"

import { Plus, Save } from "lucide-react"

import { ErrorComponent } from "@/components/error-component"
import { TiptapEditor } from "@/components/tiptap"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
      <FieldGroup className="gap-6">
        {error && (
          <ErrorComponent
            title={`Gagal ${mode === "create" ? "menambahkan" : "memperbarui"} artikel`}
            message={error.message}
          />
        )}

        <div className="grid gap-6 lg:grid-cols-[7fr_3fr]">
          {/* ── Main: Konten ───────────────────────────── */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Konten</CardTitle>
              <CardDescription>Judul, ringkasan, dan isi artikel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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

              {/* Content — TipTap editor */}
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
            </CardContent>
          </Card>

          {/* ── Sidebar: Pengaturan (sticky) ──────────── */}
          <div className="lg:sticky lg:top-6 self-start">
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Pengaturan</CardTitle>
                <CardDescription>Metadata dan visibilitas artikel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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

                {/* Featured toggle */}
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
                            Artikel unggulan akan muncul di bagian utama homepage.
                          </FieldDescription>
                        </FieldContent>
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                />

                <CategoryDialog />
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex w-full justify-end gap-3">
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
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </FieldGroup>
    </form>
  )
}
