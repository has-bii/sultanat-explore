import { useSuspenseQuery } from "@tanstack/react-query"
import { SaveIcon } from "lucide-react"

import { ButtonCopy } from "@/components/button-copy"
import { ErrorComponent } from "@/components/error-component"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SheetFooter } from "@/components/ui/sheet"
import Image from "next/image"

import { useUpdateImageForm } from "../../hooks/use-update-image-form"
import { blurhashToDataUrl } from "../../lib/blurhash"
import { PLACEHOLDER_BLURHASH } from "../../lib/placeholder-blurhash"
import { useUpdateImage } from "../../mutations/update-image.mutation"
import { getImageDetailQueryOptions } from "../../queries"
import { ImageDeleteDialog } from "../delete-dialog"
import { ProcessImageButton } from "../process-image-button"

type Props = {
  imageId: string
  onSuccess: () => void
  onDeleteSuccess: () => void
}

export function ImageUpdateForm({ imageId, onSuccess, onDeleteSuccess }: Props) {
  const { data } = useSuspenseQuery(getImageDetailQueryOptions(imageId))

  const { mutate, isPending, error } = useUpdateImage(imageId)
  const form = useUpdateImageForm({
    defaultValues: { alt: data?.alt || "" },
    onSubmit: (value) => mutate(value, { onSuccess }),
  })

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <figure className="bg-accent relative aspect-4/3 overflow-hidden rounded-lg">
          <Image
            src={data.url}
            alt={data.alt ?? ""}
            fill
            sizes="(max-width: 640px) 100vw, 384px"
            placeholder="blur"
            blurDataURL={blurhashToDataUrl(data.blurHash ?? PLACEHOLDER_BLURHASH)}
            className="object-contain"
          />
        </figure>

        {error && <ErrorComponent title="Gagal update foto" message={error.message} />}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup className="gap-4">
            <form.AppField
              name="alt"
              children={(field) => (
                <field.TextField label="Deskripsi Foto" placeholder="Hagia Sophia - Istanbul" />
              )}
            />

            <Field>
              <FieldLabel htmlFor="file-url">File URL</FieldLabel>
              <div className="flex items-center gap-1.5">
                <Input id="file-url" name="file-url" value={data?.url || "Loading..."} readOnly />
                <ButtonCopy type="button" variant="outline" value={data.url}>
                  Salin
                </ButtonCopy>
              </div>
            </Field>

            <Field>
              <form.AppForm>
                <form.SubmitButton
                  label="Simpan"
                  pendingLabel="Menyimpan..."
                  isDisabled={isPending}
                  icon={SaveIcon}
                />
              </form.AppForm>
            </Field>
          </FieldGroup>
        </form>
      </div>

      <SheetFooter className="border-t">
        {!data.blurHash && <ProcessImageButton imageId={imageId} />}
        <ImageDeleteDialog imageId={imageId} onSuccess={onDeleteSuccess} />
      </SheetFooter>
    </>
  )
}
