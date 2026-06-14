import { useMutationState, useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query"
import { Suspense } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getDestinationsQueryOptions } from "@/features/destination/queries"

import { useAttractionForm } from "../hooks/use-attraction-form"
import { useCreateAttraction } from "../mutations/create-attraction.mutation"
import { CREATE_ATTRACTION_MUTATION_KEY } from "../mutations/create-attraction.mutation"
import { useUpdateAttraction } from "../mutations/update-attraction.mutation"
import { UPDATE_ATTRACTION_MUTATION_KEY } from "../mutations/update-attraction.mutation"
import { getAttractionQueryOptions } from "../queries"
import { useAttractionDialogStore } from "../stores/attraction-dialog.store"
import { AttractionForm } from "./attraction-form"
import { AttractionFormSkeleton } from "./attraction-form-skeleton"

interface Props {
  destinationId?: string
}

export function AttractionDialog({ destinationId }: Props) {
  const { open, onClose, meta: attractionId } = useAttractionDialogStore()

  const pendingMutations = useMutationState({
    filters: {
      predicate: (mutation) => {
        const key = mutation.options.mutationKey
        return (
          key?.[0] === CREATE_ATTRACTION_MUTATION_KEY[0] ||
          key?.[0] === UPDATE_ATTRACTION_MUTATION_KEY[0]
        )
      },
      status: "pending",
    },
  })

  const isPending = pendingMutations.length > 0

  const handleOpenChange = (value: boolean) => {
    if (!value && isPending) return
    onClose()
  }

  const mode = attractionId ? "update" : "create"
  const title = mode === "create" ? "Tambah Atraksi Baru" : "Ubah Atraksi"
  const description =
    mode === "create"
      ? "Isi detail atraksi untuk destinasi ini."
      : "Ubah detail atraksi untuk destinasi ini."

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Suspense fallback={<AttractionFormSkeleton />}>
          {attractionId ? (
            <UpdateForm
              destinationId={destinationId}
              attractionId={attractionId}
              onSuccess={onClose}
            />
          ) : (
            <CreateForm destinationId={destinationId} onSuccess={onClose} />
          )}
        </Suspense>
      </DialogContent>
    </Dialog>
  )
}

interface FormProps {
  destinationId?: string
  onSuccess: () => void
}

function CreateForm({ destinationId, onSuccess }: FormProps) {
  const { data: destinationsData } = useSuspenseInfiniteQuery(
    getDestinationsQueryOptions({ limit: "100" }),
  )
  const destinations = destinationsData.pages.flatMap((p) => p.data)

  const { mutate, isPending, error } = useCreateAttraction()
  const form = useAttractionForm({
    destinationId,
    onSubmit: (value) => {
      mutate(value, { onSuccess })
    },
  })

  return (
    <AttractionForm
      form={form}
      error={error}
      isPending={isPending}
      mode="create"
      showDestinationSelector={!destinationId}
      destinations={destinations}
    />
  )
}

interface UpdateFormProps extends FormProps {
  attractionId: string
}

function UpdateForm({ destinationId, attractionId, onSuccess }: UpdateFormProps) {
  const { data } = useSuspenseQuery(getAttractionQueryOptions(attractionId))
  const { mutate, isPending, error } = useUpdateAttraction(attractionId)
  const form = useAttractionForm({
    destinationId,
    defaultValues: {
      name: data.name,
      description: data.description,
      destinationId: data.destinationId,
      imageId: data.imageId,
    },
    onSubmit: (value) => {
      mutate(value, { onSuccess })
    },
  })

  return <AttractionForm form={form} error={error} isPending={isPending} mode="edit" />
}
