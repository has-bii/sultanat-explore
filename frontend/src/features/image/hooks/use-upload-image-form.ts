import { useForm } from "@tanstack/react-form"

import { z } from "zod"

import { UploadImageInput, uploadImageSchema } from "backend/modules/image/image.schema"

import { useUploadImage } from "../mutations/upload-image.mutation"

const schema = z.object({
  queue: z
    .array(uploadImageSchema)
    .min(1, "Minimal 1 foto dipilih")
    .max(5, "Maksimal 5 foto dipilih"),
})

export const useUploadImageForm = () => {
  const mutation = useUploadImage()

  const form = useForm({
    defaultValues: {
      queue: [] as UploadImageInput[],
    },
    validators: {
      onChange: schema,
    },
    onSubmit: ({ value, formApi }) => {
      const inputs = value.queue.map((v) => ({
        form: v,
      }))

      mutation.mutate(inputs, {
        onSuccess: (results) => {},
      })
    },
  })

  return { form, mutation }
}
