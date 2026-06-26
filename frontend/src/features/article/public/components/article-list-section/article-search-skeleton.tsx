import { Loader } from "lucide-react"

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

export function ArticleSearchSkeleton() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupAddon>
        <Loader className="animate-spin" />
      </InputGroupAddon>
      <InputGroupInput placeholder="Cari artikel..." disabled />
    </InputGroup>
  )
}
