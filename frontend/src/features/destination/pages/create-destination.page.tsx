"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

import { DestinationForm } from "../components/destination-form"
import { useDestinationForm } from "../hooks/use-destination-form"
import { useCreateDestination } from "../mutations/create-destination.mutation"

export function CreateDestinationPage() {
  const router = useRouter()
  const { mutate, isPending, error } = useCreateDestination()

  const form = useDestinationForm({
    onSubmit: async (value) => {
      mutate(value, {
        onSuccess: () => {
          router.push("/admin/dashboard/destination")
        },
      })
    },
  })

  return (
    <div className="mx-auto mt-10 w-full max-w-3xl">
      <Card className="w-full">
        <CardHeader className="border-b">
          <CardTitle>Tambah Destinasi</CardTitle>
          <CardDescription>{/* TODO: Add description */}</CardDescription>
        </CardHeader>
        <CardContent>
          <DestinationForm form={form} mode="create" isPending={isPending} error={error} />
        </CardContent>
      </Card>
    </div>
  )
}
