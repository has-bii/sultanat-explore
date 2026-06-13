import { Loader, LucideIcon } from "lucide-react"
import { ComponentProps } from "react"

import { Button } from "./ui/button"

interface Props extends ComponentProps<typeof Button> {
  isLoading: boolean
  loadingLabel?: string
  icon?: LucideIcon
}

export function ButtonLoading({
  isLoading,
  disabled,
  loadingLabel = "Loading...",
  icon: Icon,
  children,
  ...props
}: Props) {
  return (
    <Button {...props} disabled={disabled || isLoading}>
      {isLoading ? (
        <Loader data-icon="inline-start" className="animate-spin" />
      ) : Icon ? (
        <Icon data-icon="inline-start" />
      ) : null}
      <span>{isLoading ? loadingLabel : children}</span>
    </Button>
  )
}
