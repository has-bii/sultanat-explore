import { useMutationState, useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query"
import { Suspense } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getCitiesQueryOptions } from "@/features/city/queries"

import { useDestinationForm } from "../../hooks/use-destination-form"
import {
  CREATE_DESTINATION_MUTATION_KEY,
  useCreateDestination,
} from "../../mutations/create-destination.mutation"
import {
  UPDATE_DESTINATION_MUTATION_KEY,
  useUpdateDestination,
} from "../../mutations/update-destination.mutation"
import { getDestinationQueryOptions } from "../../queries"
import { useDestinationDialogStore } from "../../stores/destination-dialog.store"
import { DestinationForm } from "../form"
import { DestinationFormSkeleton } from "../form/skeleton"

interface Props {
  cityId?: string
}

export function DestinationDialog({ cityId }: Props) {
  const { open, onClose, meta: destinationId } = useDestinationDialogStore()

  const pendingMutations = useMutationState({
    filters: {
      predicate: (mutation) => {
        const key = mutation.options.mutationKey
        return (
          key?.[0] === CREATE_DESTINATION_MUTATION_KEY[0] ||
          key?.[0] === UPDATE_DESTINATION_MUTATION_KEY[0]
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

  const mode = destinationId ? "update" : "create"
  const title = mode === "create" ? "Tambah Destinasi Baru" : "Ubah Destinasi"
  const description =
    mode === "create"
      ? "Isi detail destinasi untuk kota ini."
      : "Ubah detail destinasi untuk kota ini."

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Suspense fallback={<DestinationFormSkeleton />}>
          {destinationId ? (
            <UpdateForm cityId={cityId} destinationId={destinationId} onSuccess={onClose} />
          ) : (
            <CreateForm cityId={cityId} onSuccess={onClose} />
          )}
        </Suspense>
      </DialogContent>
    </Dialog>
  )
}

interface FormProps {
  cityId?: string
  onSuccess: () => void
}

function CreateForm({ cityId, onSuccess }: FormProps) {
  const { data: citiesData } = useSuspenseInfiniteQuery(getCitiesQueryOptions({ limit: "100" }))
  const cities = citiesData.pages.flatMap((p) => p.data)

  const { mutate, isPending, error } = useCreateDestination()
  const form = useDestinationForm({
    cityId,
    onSubmit: (value) => {
      mutate(value, { onSuccess })
    },
  })

  return (
    <DestinationForm
      form={form}
      error={error}
      isPending={isPending}
      mode="create"
      showDestinationSelector={!cityId}
      cities={cities}
    />
  )
}

interface UpdateFormProps extends FormProps {
  destinationId: string
}

function UpdateForm({ cityId, destinationId, onSuccess }: UpdateFormProps) {
  const { data } = useSuspenseQuery(getDestinationQueryOptions(destinationId))
  const { mutate, isPending, error } = useUpdateDestination(destinationId)
  const form = useDestinationForm({
    cityId,
    defaultValues: {
      name: data.name,
      description: data.description,
      cityId: data.cityId,
      imageId: data.imageId,
      featured: data.featured,
    },
    onSubmit: (value) => {
      mutate(value, { onSuccess })
    },
  })

  return <DestinationForm form={form} error={error} isPending={isPending} mode="edit" />
}
