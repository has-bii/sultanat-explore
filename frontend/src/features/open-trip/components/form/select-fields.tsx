"use client"

import { useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query"
import { Suspense } from "react"

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { getCitiesQueryOptions } from "@/features/city/queries"
import { getDestinationsQueryOptions } from "@/features/destination/queries"
import { getInclusionItemsQueryOptions } from "@/features/inclusion-item/queries"
import { useFieldContext } from "@/lib/form"

interface SelectFieldProps {
  label?: string
  placeholder?: string
  description?: string
  className?: string
  labelClassName?: string
}

interface OptionsProps {
  id: string
  value: string
  placeholder?: string
  ariaInvalid: boolean
  onValueChange: (v: string) => void
  onBlur: () => void
}

// ── Skeleton ────────────────────────────────────────────────

function SelectTriggerSkeleton() {
  return <Skeleton className="h-9 w-full rounded-md" />
}

// ── City Select Field ───────────────────────────────────────

export function CitySelectField({
  label,
  placeholder,
  description,
  className,
  labelClassName,
}: SelectFieldProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid} className={className}>
      {label && (
        <FieldLabel htmlFor={field.name} className={labelClassName}>
          {label}
        </FieldLabel>
      )}
      <Suspense fallback={<SelectTriggerSkeleton />}>
        <CityOptions
          id={field.name}
          value={field.state.value}
          placeholder={placeholder}
          ariaInvalid={isInvalid}
          onValueChange={field.handleChange}
          onBlur={field.handleBlur}
        />
      </Suspense>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

function CityOptions(props: OptionsProps) {
  const { id, value, placeholder, ariaInvalid, onValueChange, onBlur } = props
  const { data } = useSuspenseInfiniteQuery(getCitiesQueryOptions({ limit: "100" }))
  const cities = data.pages.flatMap((p) => p.data)

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      onOpenChange={(open) => {
        if (!open) onBlur()
      }}
    >
      <SelectTrigger id={id} aria-invalid={ariaInvalid} className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {cities.map((city) => (
          <SelectItem key={city.id} value={city.id}>
            {city.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// ── Destination Select Field ────────────────────────────────

export function DestinationSelectField({
  label,
  placeholder,
  description,
  className,
  labelClassName,
}: SelectFieldProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid} className={className}>
      {label && (
        <FieldLabel htmlFor={field.name} className={labelClassName}>
          {label}
        </FieldLabel>
      )}
      <Suspense fallback={<SelectTriggerSkeleton />}>
        <DestinationOptions
          id={field.name}
          value={field.state.value}
          placeholder={placeholder}
          ariaInvalid={isInvalid}
          onValueChange={field.handleChange}
          onBlur={field.handleBlur}
        />
      </Suspense>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

function DestinationOptions(props: OptionsProps) {
  const { id, value, placeholder, ariaInvalid, onValueChange, onBlur } = props
  const { data } = useSuspenseInfiniteQuery(getDestinationsQueryOptions({ limit: "100" }))
  const destinations = data.pages.flatMap((p) => p.data)

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      onOpenChange={(open) => {
        if (!open) onBlur()
      }}
    >
      <SelectTrigger id={id} aria-invalid={ariaInvalid} className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {destinations.map((dest) => (
          <SelectItem key={dest.id} value={dest.id}>
            {dest.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// ── Inclusion Item Select Field ─────────────────────────────

export function InclusionItemSelectField({
  label,
  placeholder,
  description,
  className,
  labelClassName,
}: SelectFieldProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid} className={className}>
      {label && (
        <FieldLabel htmlFor={field.name} className={labelClassName}>
          {label}
        </FieldLabel>
      )}
      <Suspense fallback={<SelectTriggerSkeleton />}>
        <InclusionItemOptions
          id={field.name}
          value={field.state.value}
          placeholder={placeholder}
          ariaInvalid={isInvalid}
          onValueChange={field.handleChange}
          onBlur={field.handleBlur}
        />
      </Suspense>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

function InclusionItemOptions(props: OptionsProps) {
  const { id, value, placeholder, ariaInvalid, onValueChange, onBlur } = props
  const { data } = useSuspenseQuery(getInclusionItemsQueryOptions())
  const items = data ?? []

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      onOpenChange={(open) => {
        if (!open) onBlur()
      }}
    >
      <SelectTrigger id={id} aria-invalid={ariaInvalid} className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
