"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

import { CreateCityInput } from "backend/modules/city/city.schema"

import { CityForm } from "../components/form"
import { useCityForm } from "../hooks/use-city-form"
import { useCreateCity } from "../mutations/create-city.mutation"

export function CreateCityPage() {
  const router = useRouter()
  const { mutate, isPending, error } = useCreateCity()

  const onSubmit = async (value: CreateCityInput) => {
    mutate(value, {
      onSuccess: () => {
        router.push("/admin/dashboard/city")
      },
    })
  }

  const form = useCityForm({
    onSubmit,
  })

  return (
    <div className="mx-auto mt-10 w-full max-w-3xl">
      <Card className="w-full">
        <CardHeader className="border-b">
          <CardTitle>Tambah Kota</CardTitle>
          <CardDescription>
            Galeri kota dapat ditambahkan setelah kota telah dibuat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CityForm form={form} mode="create" isPending={isPending} error={error} />
        </CardContent>
      </Card>
    </div>
  )
}
