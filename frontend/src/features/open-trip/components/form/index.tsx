"use client"

import { Plus, Save, Trash2 } from "lucide-react"

import { ErrorComponent } from "@/components/error-component"
import { TiptapEditor } from "@/components/tiptap"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SelectItem } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

import { useOpenTripForm } from "../../hooks/use-open-trip-form"

interface OpenTripFormProps {
  form: ReturnType<typeof useOpenTripForm>
  mode: "create" | "edit"
  error: Error | null
  isPending: boolean
}

export function OpenTripForm(props: OpenTripFormProps) {
  const { form, mode, error, isPending } = props

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
            title={`Gagal ${mode === "create" ? "menambahkan" : "memperbarui"} open trip`}
            message={error.message}
          />
        )}

        {/* ── Basic Info ────────────────────────────── */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Informasi Dasar</CardTitle>
            <CardDescription>Judul, ringkasan, dan detail open trip</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <form.AppField
                name="title"
                children={(field) => (
                  <field.TextField label="Judul" placeholder="Open Trip Istanbul & Cappadocia" />
                )}
              />
              <form.AppField
                name="slug"
                children={(field) => (
                  <field.TextField
                    label="Slug"
                    placeholder="istanbul-cappadocia"
                    description="URL-friendly, huruf kecil dan dash"
                  />
                )}
              />
            </div>

            <form.AppField
              name="excerpt"
              children={(field) => (
                <field.TextareaField
                  label="Ringkasan"
                  placeholder="Ringkasan singkat open trip..."
                  rows={3}
                />
              )}
            />

            {/* Description — TipTap editor */}
            <form.Field name="description">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Deskripsi</FieldLabel>
                    <TiptapEditor
                      content={field.state.value as Record<string, unknown> | null}
                      onChange={(json) => field.handleChange(json)}
                    />
                    <FieldDescription>
                      Konten kaya akan blok teks, gambar, dan elemen lainnya.
                    </FieldDescription>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>

            <div className="grid grid-cols-3 gap-4">
              <form.AppField
                name="price"
                children={(field) => (
                  <field.TextNumberField
                    label="Harga (IDR)"
                    placeholder="5000000"
                    description="Harga per orang"
                  />
                )}
              />
              <form.AppField
                name="status"
                children={(field) => (
                  <field.SelectField label="Status" placeholder="Pilih status">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </field.SelectField>
                )}
              />
              <form.AppField
                name="coverImageId"
                children={(field) => (
                  <field.ImagePickerField
                    label="Gambar Sampul"
                    description="Pilih gambar landscape"
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Itinerary: Cities & Destinations ──────── */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Itinerary</CardTitle>
            <CardDescription>Kota dan destinasi yang dikunjungi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form.Field name="cities" mode="array">
              {(citiesField) => (
                <FieldSet>
                  <FieldContent>
                    {(citiesField.state.value ?? []).map((_, cityIndex) => (
                      <CityEntry
                        key={cityIndex}
                        form={form}
                        cityIndex={cityIndex}
                        onRemove={() => citiesField.removeValue(cityIndex)}
                      />
                    ))}
                  </FieldContent>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      citiesField.pushValue({
                        cityId: "",
                        arriveAt: "",
                        departAt: undefined,
                        destinations: [],
                      })
                    }
                  >
                    <Plus data-icon="inline-start" />
                    <span>Tambah Kota</span>
                  </Button>
                  {citiesField.state.meta.isTouched && !citiesField.state.meta.isValid && (
                    <FieldError errors={citiesField.state.meta.errors} />
                  )}
                </FieldSet>
              )}
            </form.Field>
          </CardContent>
        </Card>

        {/* ── Inclusions ────────────────────────────── */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Inclusion & Exclusion</CardTitle>
            <CardDescription>Item yang termasuk dan tidak termasuk dalam trip</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form.Field name="inclusions" mode="array">
              {(inclusionsField) => (
                <FieldSet>
                  <FieldContent>
                    {(inclusionsField.state.value ?? []).map((_, incIndex) => (
                      <InclusionEntry
                        key={incIndex}
                        form={form}
                        incIndex={incIndex}
                        onRemove={() => inclusionsField.removeValue(incIndex)}
                      />
                    ))}
                  </FieldContent>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      inclusionsField.pushValue({
                        inclusionItemId: "",
                        type: "include" as const,
                      })
                    }
                  >
                    <Plus data-icon="inline-start" />
                    <span>Tambah Inclusion</span>
                  </Button>
                </FieldSet>
              )}
            </form.Field>
          </CardContent>
        </Card>

        {/* ── Date Range ────────────────────────────── */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Tanggal</CardTitle>
            <CardDescription>
              Tanggal otomatis diturunkan dari itinerary kota, atau isi manual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <form.Field name="startAt">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>Mulai</FieldLabel>
                      <Input
                        type="datetime-local"
                        value={formatDateForInput(field.state.value)}
                        onChange={(e) =>
                          field.handleChange(
                            e.target.value ? new Date(e.target.value).toISOString() : "",
                          )
                        }
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
                      />
                      <FieldDescription>
                        Kosongkan untuk otomatis dari kota pertama
                      </FieldDescription>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </form.Field>
              <form.Field name="endAt">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>Selesai</FieldLabel>
                      <Input
                        type="datetime-local"
                        value={formatDateForInput(field.state.value)}
                        onChange={(e) =>
                          field.handleChange(
                            e.target.value ? new Date(e.target.value).toISOString() : "",
                          )
                        }
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
                      />
                      <FieldDescription>
                        Kosongkan untuk otomatis dari kota terakhir
                      </FieldDescription>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </form.Field>
            </div>
          </CardContent>
        </Card>

        {/* ── Actions ───────────────────────────────── */}
        <div className="flex justify-end gap-3 border-t pt-4">
          {mode === "create" && (
            <Button type="button" variant="outline" disabled={isPending} asChild>
              <Link href="/admin/dashboard/open-trip">Batal</Link>
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
      </FieldGroup>
    </form>
  )
}

// ── City Entry ─────────────────────────────────────────────

function CityEntry({
  form,
  cityIndex,
  onRemove,
}: {
  form: ReturnType<typeof useOpenTripForm>
  cityIndex: number
  onRemove: () => void
}) {
  return (
    <Card className="relative">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Kota {cityIndex + 1}</CardTitle>
          <Button type="button" variant="ghost" size="icon-sm" onClick={onRemove}>
            <Trash2 className="text-destructive" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <form.AppField
            name={`cities[${cityIndex}].cityId`}
            children={(field) => (
              <field.CitySelectField label="Kota" placeholder="Pilih kota" />
            )}
          />

          <form.Field name={`cities[${cityIndex}].arriveAt`}>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Tanggal Tiba</FieldLabel>
                  <Input
                    type="datetime-local"
                    value={formatDateForInput(field.state.value)}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value ? new Date(e.target.value).toISOString() : "",
                      )
                    }
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>

          <form.Field name={`cities[${cityIndex}].departAt`}>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Tanggal Berangkat</FieldLabel>
                  <Input
                    type="datetime-local"
                    value={formatDateForInput(field.state.value)}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value ? new Date(e.target.value).toISOString() : "",
                      )
                    }
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                  />
                  <FieldDescription>Opsional</FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
        </div>

        {/* Destinations within this city */}
        <Separator />
        <div className="space-y-3">
          <FieldLabel className="text-sm font-medium">Destinasi</FieldLabel>
          <form.Field name={`cities[${cityIndex}].destinations`} mode="array">
            {(destField) => (
              <div className="space-y-3">
                {(destField.state.value ?? []).map((_, destIndex) => (
                  <DestinationEntry
                    key={destIndex}
                    form={form}
                    cityIndex={cityIndex}
                    destIndex={destIndex}
                    onRemove={() => destField.removeValue(destIndex)}
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => destField.pushValue({ destinationId: "", visitAt: "" })}
                >
                  <Plus data-icon="inline-start" />
                  <span>Tambah Destinasi</span>
                </Button>
              </div>
            )}
          </form.Field>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Destination Entry ──────────────────────────────────────

function DestinationEntry({
  form,
  cityIndex,
  destIndex,
  onRemove,
}: {
  form: ReturnType<typeof useOpenTripForm>
  cityIndex: number
  destIndex: number
  onRemove: () => void
}) {
  return (
    <div className="bg-muted/50 flex items-end gap-3 rounded-lg p-3">
      <form.AppField
        name={`cities[${cityIndex}].destinations[${destIndex}].destinationId`}
        children={(field) => (
          <field.DestinationSelectField
            label="Destinasi"
            placeholder="Pilih destinasi"
            labelClassName="text-xs"
            className="flex-1"
          />
        )}
      />

      <form.Field name={`cities[${cityIndex}].destinations[${destIndex}].visitAt`}>
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid} className="flex-1">
              <FieldLabel className="text-xs">Waktu Kunjungan</FieldLabel>
              <Input
                type="datetime-local"
                value={formatDateForInput(field.state.value)}
                onChange={(e) =>
                  field.handleChange(
                    e.target.value ? new Date(e.target.value).toISOString() : "",
                  )
                }
                onBlur={field.handleBlur}
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      </form.Field>

      <Button type="button" variant="ghost" size="icon-sm" onClick={onRemove}>
        <Trash2 className="text-destructive" />
      </Button>
    </div>
  )
}

// ── Inclusion Entry ────────────────────────────────────────

function InclusionEntry({
  form,
  incIndex,
  onRemove,
}: {
  form: ReturnType<typeof useOpenTripForm>
  incIndex: number
  onRemove: () => void
}) {
  return (
    <div className="flex items-end gap-3">
      <form.AppField
        name={`inclusions[${incIndex}].inclusionItemId`}
        children={(field) => (
          <field.InclusionItemSelectField
            label="Item"
            placeholder="Pilih item"
            labelClassName="text-xs"
            className="flex-1"
          />
        )}
      />

      <form.AppField
        name={`inclusions[${incIndex}].type`}
        children={(field) => (
          <field.SelectField
            label="Tipe"
            placeholder="Pilih tipe"
            labelClassName="text-xs"
            className="w-40"
          >
            <SelectItem value="include">Include</SelectItem>
            <SelectItem value="exclude">Exclude</SelectItem>
          </field.SelectField>
        )}
      />

      <Button type="button" variant="ghost" size="icon-sm" onClick={onRemove}>
        <Trash2 className="text-destructive" />
      </Button>
    </div>
  )
}

// ── Helpers ────────────────────────────────────────────────

function formatDateForInput(value: unknown): string {
  if (!value || typeof value !== "string") return ""
  try {
    const d = new Date(value)
    if (isNaN(d.getTime())) return ""
    const pad = (n: number) => String(n).padStart(2, "0")
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  } catch {
    return ""
  }
}
