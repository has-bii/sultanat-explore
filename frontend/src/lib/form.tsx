"use client"

import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { Eye, EyeOff, Loader, LucideIcon } from "lucide-react"
import { HTMLInputTypeAttribute, type ReactNode, useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ImagePickerDialog } from "@/features/image/components/picker-dialog"
import { VariantProps } from "class-variance-authority"

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

interface Props {
  label?: string
  placeholder?: string
  type?: HTMLInputTypeAttribute
  description?: string
}

export function TextField({ label, type = "text", placeholder }: Props) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        type={type}
        placeholder={placeholder}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        autoComplete="off"
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

export function TextNumberField({ label, placeholder, description }: Props) {
  const field = useFieldContext<number>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        type="number"
        placeholder={placeholder}
        value={field.state.value ?? ''}
        onBlur={field.handleBlur}
        onChange={(e) => {
          const v = e.target.value
          field.handleChange(v === '' ? 0 : Number(v))
        }}
        aria-invalid={isInvalid}
        autoComplete="off"
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

export function TextareaField({ label, placeholder, rows = 4 }: Props & { rows?: number }) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Textarea
        id={field.name}
        name={field.name}
        placeholder={placeholder}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        rows={rows}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

export function PasswordField({ label, placeholder }: Props) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const [visible, setVisible] = useState(false)

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={field.name}
          name={field.name}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
          autoComplete="off"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" onClick={() => setVisible(!visible)} tabIndex={-1}>
            {visible ? <EyeOff /> : <Eye />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

export function ImagePickerField({ label, description }: Props) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <ImagePickerDialog value={field.state.value} onChange={field.handleChange} />
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

export function SubmitButton(props: {
  label: string
  icon?: LucideIcon
  pendingLabel?: string
  isDisabled?: boolean
  className?: string
  size?: VariantProps<typeof buttonVariants>["size"]
  variant?: VariantProps<typeof buttonVariants>["variant"]
}) {
  const { label, pendingLabel, isDisabled, className, size, variant, icon: Icon } = props
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting, state.isDirty]}>
      {([canSubmit, isSubmitting, isDirty]) => (
        <Button
          type="submit"
          size={size}
          variant={variant}
          disabled={!canSubmit || isSubmitting || isDisabled || !isDirty}
          className={className}
        >
          {isSubmitting || isDisabled ? (
            <Loader data-icon="inline-start" className="animate-spin" />
          ) : (
            Icon && <Icon data-icon="inline-start" />
          )}
          <span>{isSubmitting || isDisabled ? (pendingLabel ?? "Memproses...") : label}</span>
        </Button>
      )}
    </form.Subscribe>
  )
}

export function SelectField(props: {
  label?: string
  description?: string
  placeholder?: string
  trailing?: ReactNode
  className?: string
  labelClassName?: string
  children: ReactNode
}) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid} className={props.className}>
      {props.label && (
        <FieldLabel htmlFor={field.name} className={props.labelClassName}>
          {props.label}
        </FieldLabel>
      )}
      <Select
        value={field.state.value}
        onValueChange={(v) => field.handleChange(v)}
        onOpenChange={(open) => {
          if (!open) field.handleBlur()
        }}
      >
        {props.trailing ? (
          <div className="flex items-end gap-2">
            <SelectTrigger id={field.name} aria-invalid={isInvalid} className="flex-1">
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            {props.trailing}
          </div>
        ) : (
          <SelectTrigger id={field.name} aria-invalid={isInvalid}>
            <SelectValue placeholder={props.placeholder} />
          </SelectTrigger>
        )}
        <SelectContent>{props.children}</SelectContent>
      </Select>
      {props.description && <FieldDescription>{props.description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

export const baseFieldComponents = {
  TextField,
  TextNumberField,
  TextareaField,
  PasswordField,
  ImagePickerField,
  SelectField,
}

export const baseFormComponents = {
  SubmitButton,
}

const { useAppForm } = createFormHook({
  fieldComponents: baseFieldComponents,
  formComponents: baseFormComponents,
  fieldContext,
  formContext,
})

export { useAppForm }
