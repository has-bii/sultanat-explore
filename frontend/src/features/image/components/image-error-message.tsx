import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

type Props = {
  error: Error
}

export function ImageErrorMessage({ error }: Props) {
  const router = useRouter()

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
      <div>
        <h3 className="text-heading font-heading text-lg font-bold">Gagal memuat foto</h3>
        <p className="text-caption mt-1 max-w-sm text-neutral-500">{error.message}</p>
      </div>
      <Button onClick={() => router.refresh()}>Coba lagi</Button>
    </div>
  )
}
