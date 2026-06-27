"use client"

import { useQuery } from "@tanstack/react-query"
import { ChevronDown, ChevronUp, Plus, Save, Trash2 } from "lucide-react"
import { Suspense } from "react"

import { ErrorComponent } from "@/components/error-component"
import { TiptapEditor } from "@/components/tiptap"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { SelectItem } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { getInclusionItemsQueryOptions } from "@/features/inclusion-item/queries"
import Link from "next/link"

import { type OpenTripInclusionRow, useOpenTripForm } from "../../hooks/use-open-trip-form"
import { CityOptions } from "./select-fields"

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
                name="coverImageId"
                children={(field) => (
                  <field.ImagePickerField
                    label="Gambar Sampul"
                    description="Pilih gambar landscape"
                  />
                )}
              />

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <form.AppField
                    name="title"
                    children={(field) => (
                      <field.TextField
                        label="Judul"
                        placeholder="Open Trip Istanbul & Cappadocia"
                      />
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

                <div className="grid grid-cols-2 gap-4">
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
                </div>
              </div>
            </div>

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
                  <FieldContent className="gap-4">
                    {(citiesField.state.value ?? []).map((city, cityIndex) => (
                      <CityEntry
                        key={city._key}
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
                        destinations: [],
                        _key: crypto.randomUUID(),
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
          <CardContent>
            <InclusionSection form={form} />
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
              <form.AppField
                name="startAt"
                children={(field) => <field.DateField label="Mulai" />}
              />
              <form.AppField
                name="endAt"
                children={(field) => <field.DateField label="Selesai" />}
              />
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
        <div className="grid grid-cols-2 gap-4">
          <form.Field name={`cities[${cityIndex}].cityId`}>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Kota</FieldLabel>
                  <Suspense fallback={<Skeleton className="h-9 w-full rounded-md" />}>
                    <CityOptions
                      id="city"
                      value={field.state.value}
                      placeholder="Pilih kota"
                      ariaInvalid={isInvalid}
                      onValueChange={(newCityId) => {
                        field.handleChange(newCityId)
                        form.setFieldValue(`cities[${cityIndex}].destinations`, [])
                      }}
                      onBlur={field.handleBlur}
                    />
                  </Suspense>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>

          <form.AppField
            name={`cities[${cityIndex}].arriveAt`}
            children={(field) => <field.DateField label="Tanggal Tiba" />}
          />
        </div>

        {/* Destinations within this city */}
        <Separator />
        <div className="space-y-3">
          <FieldLabel className="text-sm font-medium">Destinasi</FieldLabel>
          <form.Field name={`cities[${cityIndex}].destinations`} mode="array">
            {(destField) => {
              const destCount = (destField.state.value ?? []).length
              return (
                <div className="space-y-3">
                  {(destField.state.value ?? []).map((dest, destIndex) => (
                    <DestinationEntry
                      key={dest._key}
                      form={form}
                      cityIndex={cityIndex}
                      destIndex={destIndex}
                      isFirst={destIndex === 0}
                      isLast={destIndex === destCount - 1}
                      onMoveUp={() => destField.moveValue(destIndex, destIndex - 1)}
                      onMoveDown={() => destField.moveValue(destIndex, destIndex + 1)}
                      onRemove={() => destField.removeValue(destIndex)}
                    />
                  ))}
                  {destField.state.meta.isTouched && !destField.state.meta.isValid && (
                    <FieldError errors={destField.state.meta.errors} />
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      destField.pushValue({
                        destinationId: "",
                        order: destCount,
                        _key: crypto.randomUUID(),
                      })
                    }
                  >
                    <Plus data-icon="inline-start" />
                    <span>Tambah Destinasi</span>
                  </Button>
                </div>
              )
            }}
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
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  form: ReturnType<typeof useOpenTripForm>
  cityIndex: number
  destIndex: number
  isFirst: boolean
  isLast: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
}) {
  return (
    <form.Subscribe selector={(state) => state.values.cities?.[cityIndex]?.cityId}>
      {(cityId) => (
        <div className="bg-muted/50 flex items-end gap-2 rounded-lg p-3">
          {/* ponytail: order derived from array index, reorder via up/down; submit reindexes */}
          <form.AppField
            name={`cities[${cityIndex}].destinations[${destIndex}].destinationId`}
            children={(field) => (
              <field.DestinationSelectField
                placeholder={cityId ? "Pilih destinasi" : "Pilih kota terlebih dahulu"}
                className="flex-1"
                cityId={cityId}
              />
            )}
          />

          <div className="flex flex-col gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={isFirst}
              onClick={onMoveUp}
            >
              <ChevronUp />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={isLast}
              onClick={onMoveDown}
            >
              <ChevronDown />
            </Button>
          </div>

          <Button type="button" variant="ghost" size="icon-sm" onClick={onRemove}>
            <Trash2 className="text-destructive" />
          </Button>
        </div>
      )}
    </form.Subscribe>
  )
}

// ── Inclusion Section ──────────────────────────────────────

function InclusionSection({ form }: { form: ReturnType<typeof useOpenTripForm> }) {
  const { data: allItems } = useQuery(getInclusionItemsQueryOptions())
  const items = allItems ?? []

  return (
    <form.Subscribe selector={(state) => state.values.inclusions}>
      {(inclusions) => {
        const usedIds = inclusions.map((inc) => inc.inclusionItemId).filter(Boolean)
        const available = items.filter((item) => !usedIds.includes(item.id))
        const allUsed = available.length === 0

        return (
          <form.Field name="inclusions" mode="array">
            {(inclusionsField) => (
              <div className="grid grid-cols-2 gap-6">
                <InclusionColumn
                  form={form}
                  label="Include"
                  addLabel="Tambah Include"
                  type="include"
                  inclusions={inclusions}
                  items={items}
                  available={available}
                  allUsed={allUsed}
                  onAdd={() =>
                    inclusionsField.pushValue({
                      inclusionItemId: "",
                      type: "include",
                      _key: crypto.randomUUID(),
                    })
                  }
                  onRemove={(idx) => inclusionsField.removeValue(idx)}
                />
                <InclusionColumn
                  form={form}
                  label="Exclude"
                  addLabel="Tambah Exclude"
                  type="exclude"
                  inclusions={inclusions}
                  items={items}
                  available={available}
                  allUsed={allUsed}
                  onAdd={() =>
                    inclusionsField.pushValue({
                      inclusionItemId: "",
                      type: "exclude",
                      _key: crypto.randomUUID(),
                    })
                  }
                  onRemove={(idx) => inclusionsField.removeValue(idx)}
                />
              </div>
            )}
          </form.Field>
        )
      }}
    </form.Subscribe>
  )
}

function InclusionColumn({
  form,
  label,
  addLabel,
  type,
  inclusions,
  items,
  available,
  allUsed,
  onAdd,
  onRemove,
}: {
  form: ReturnType<typeof useOpenTripForm>
  label: string
  addLabel: string
  type: "include" | "exclude"
  inclusions: OpenTripInclusionRow[]
  items: { id: string; label: string }[]
  available: { id: string; label: string }[]
  allUsed: boolean
  onAdd: () => void
  onRemove: (idx: number) => void
}) {
  const itemById = new Map(items.map((i) => [i.id, i] as const))
  const rows = inclusions
    .map((inc, idx) => ({ ...inc, _idx: idx }))
    .filter((inc) => inc.type === type)

  return (
    <FieldSet>
      <FieldLabel className="text-base font-semibold">{label}</FieldLabel>
      <FieldContent className="gap-3">
        {rows.map((inc) => (
          <InclusionEntry
            key={inc._key}
            form={form}
            incIndex={inc._idx}
            items={
              [itemById.get(inc.inclusionItemId), ...available].filter(Boolean) as {
                id: string
                label: string
              }[]
            }
            onRemove={() => onRemove(inc._idx)}
          />
        ))}
      </FieldContent>
      <Button type="button" variant="outline" size="sm" disabled={allUsed} onClick={onAdd}>
        <Plus data-icon="inline-start" />
        <span>{addLabel}</span>
      </Button>
    </FieldSet>
  )
}

// ── Inclusion Entry ────────────────────────────────────────

function InclusionEntry({
  form,
  incIndex,
  items,
  onRemove,
}: {
  form: ReturnType<typeof useOpenTripForm>
  incIndex: number
  items: { id: string; label: string }[]
  onRemove: () => void
}) {
  return (
    <div className="flex items-center gap-2">
      <form.AppField
        name={`inclusions[${incIndex}].inclusionItemId`}
        children={(field) => (
          <field.InclusionItemSelectField
            placeholder="Pilih item"
            className="flex-1"
            items={items}
          />
        )}
      />
      <Button type="button" variant="ghost" size="icon-sm" onClick={onRemove}>
        <Trash2 className="text-destructive" />
      </Button>
    </div>
  )
}
