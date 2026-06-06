import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import Image from "next/image"

import { useUploadImageForm } from "../../hooks/use-upload-image-form"

type Props = {
  index: number
  form: ReturnType<typeof useUploadImageForm>["form"]
  handleRemove: () => void
}

export function UploadQueueItem({ index, form, handleRemove }: Props) {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <FieldGroup className="flex-row gap-2">
      <Field orientation="horizontal" className="items-start rounded-sm border p-3">
        <form.Field key={`file-${index}`} name={`queue[${index}].file`}>
          {(subField) => (
            <figure className="size-20 shrink-0 overflow-hidden rounded">
              <Image
                src={URL.createObjectURL(subField.state.value)}
                alt=""
                width={80}
                height={80}
                className="size-full object-cover"
              />
            </figure>
          )}
        </form.Field>
        <div className="flex flex-1 flex-col gap-1">
          <form.Field key={`file-${index}`} name={`queue[${index}].file`}>
            {(subField) => (
              <>
                <FieldDescription className="text-foreground font-medium">
                  {subField.state.value.name}
                </FieldDescription>
                <FieldDescription>{formatFileSize(subField.state.value.size)}</FieldDescription>
              </>
            )}
          </form.Field>
          <form.Field key={`alt-${index}`} name={`queue[${index}].alt`}>
            {(subField) => (
              <InputGroup className="h-7">
                <InputGroupInput
                  type="text"
                  placeholder="Deskripsi foto"
                  className="text-xs"
                  value={subField.state.value}
                  onChange={(e) => subField.handleChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.preventDefault()
                  }}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText className="text-xs">
                    {subField.state.value?.length || 0}/255
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            )}
          </form.Field>
        </div>
        <Button type="button" size="icon-sm" variant="destructive" onClick={handleRemove}>
          <Trash2 />
        </Button>
      </Field>
    </FieldGroup>
  )
}
