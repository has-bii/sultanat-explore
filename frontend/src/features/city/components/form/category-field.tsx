"use client"

import { useQuery } from "@tanstack/react-query"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Skeleton } from "@/components/ui/skeleton"
import { getCityCategoriesQueryOptions } from "@/features/city-category/queries"

interface Props {
  value: string[]
  onChange: (value: string[]) => void
  isInvalid: boolean
  errors: React.ComponentProps<typeof FieldError>["errors"]
}

export function CityCategoryField({ value, onChange, isInvalid, errors }: Props) {
  const { data: categories, isLoading } = useQuery(getCityCategoriesQueryOptions())

  const toggle = (id: string, checked: boolean) => {
    onChange(checked ? [...value, id] : value.filter((c) => c !== id))
  }

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel>Kategori</FieldLabel>
      <FieldDescription>Pilih kategori untuk mengelompokkan kota ini.</FieldDescription>
      <FieldContent>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {isLoading ? (
            <Skeleton className="h-8 w-40" />
          ) : categories && categories.length > 0 ? (
            categories.map((cat) => (
              <label key={cat.id} className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox
                  checked={value.includes(cat.id)}
                  onCheckedChange={(v) => toggle(cat.id, !!v)}
                />
                {cat.name}
              </label>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada kategori kota.</p>
          )}
        </div>
        {isInvalid && <FieldError errors={errors} />}
      </FieldContent>
    </Field>
  )
}