import { useQuery } from "@tanstack/react-query"
import { Copy, Loader } from "lucide-react"
import React from "react"

import { ButtonCopy } from "@/components/button-copy"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SheetFooter } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

import { useUpdateImageForm } from "../../hooks/use-update-image-form"
import { blurhashToDataUrl } from "../../lib/blurhash"
import { useDeleteImage } from "../../mutations/delete-image.mutation"
import { useUpdateImage } from "../../mutations/update-image.mutation"
import { getImageDetailQueryOptions } from "../../query/get-image-detail.query"

type Props = {
  imageId: string
  onClose: () => void
}

export function Inner({ imageId, onClose }: Props) {
  const { data, isLoading } = useQuery(getImageDetailQueryOptions(imageId))
  const deleteMutation = useDeleteImage(imageId)
  const updateMutation = useUpdateImage(imageId)
  const form = useUpdateImageForm({
    defaultValues: { alt: data?.alt || "" },
    onSubmit: (value) => updateMutation.mutate(value, { onSuccess: onClose }),
  })

  const handleDelete = () => deleteMutation.mutate(undefined, { onSuccess: onClose })

  const disableUpdateButton = isLoading || updateMutation.isPending || deleteMutation.isPending

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 px-4">
        <figure className="bg-accent relative aspect-4/3 overflow-hidden rounded-lg">
          {data ? (
            <Image
              src={data.url}
              alt={data.alt ?? ""}
              fill
              sizes="(max-width: 640px) 100vw, 384px"
              placeholder="blur"
              blurDataURL={blurhashToDataUrl(data.blurHash)}
              className="object-contain"
            />
          ) : (
            <Skeleton className="size-full" />
          )}
        </figure>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup className="gap-4">
            <form.Field name="alt">
              {(field) => {
                const isInvalid = !field.state.meta.isValid && field.state.meta.isDirty
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Deskripsi foto</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Hagia Sophia - Istanbul"
                      autoComplete="off"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>

            <Field>
              <FieldLabel htmlFor="file-url">File URL</FieldLabel>
              <div className="flex items-center gap-1.5">
                <Input id="file-url" name="file-url" value={data?.url || "Loading..."} readOnly />
                <ButtonCopy type="button" size="sm" value={data?.url || ""} disabled={isLoading}>
                  <Copy />
                  Salin
                </ButtonCopy>
              </div>
            </Field>

            <Field>
              <form.Subscribe selector={(state) => [state.canSubmit]}>
                {([canSubmit]) => (
                  <Button type="submit" disabled={!canSubmit || disableUpdateButton}>
                    <span>Simpan</span>
                    {disableUpdateButton && <Loader className="animate-spin" />}
                  </Button>
                )}
              </form.Subscribe>
            </Field>
          </FieldGroup>
        </form>
      </div>

      <SheetFooter className="border-t">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Hapus</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus foto ini?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan tidak dapat dibatalkan. Foto akan dihapus permanen dari server.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full" disabled={deleteMutation.isPending}>
                Batal
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="rounded-full bg-red-600 text-white hover:bg-red-700"
              >
                {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SheetFooter>
    </>
  )
}
