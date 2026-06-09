import { Loader } from "lucide-react"
import { ComponentProps } from "react"

import { Button } from "./ui/button"

interface Props extends ComponentProps<typeof Button> {
  isLoading: boolean
  loadingLabel?: string
}

export function ButtonLoading({
  isLoading,
  disabled,
  loadingLabel = "Loading...",
  children,
  ...props
}: Props) {
  return (
    <Button {...props} disabled={disabled || isLoading}>
      {isLoading ? (
        <>
          <Loader className="animate-spin" />
          <span>{loadingLabel}</span>
        </>
      ) : (
        children
      )}
    </Button>
  )
}
