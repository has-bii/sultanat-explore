import { InfoIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "./ui/alert"

type Props = {
  title: string
  message: string
}

export function ErrorComponent({ title, message }: Props) {
  return (
    <Alert variant="destructive">
      <InfoIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
