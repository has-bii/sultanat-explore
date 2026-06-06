"use client"

import { ComponentProps, useEffect, useRef, useState } from "react"

import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

interface Props extends ComponentProps<typeof Button> {
  value: string
}

export function ButtonCopy({ children, value, ...props }: Props) {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  const handleCopyUrl = async () => {
    if (!value) return
    await navigator.clipboard.writeText(value)
    setOpen(true)
    timeoutRef.current = setTimeout(() => setOpen(false), 1000) as unknown as number
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <Tooltip open={open}>
      <TooltipTrigger asChild>
        <Button {...props} onClick={handleCopyUrl}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Telah disalin.</p>
      </TooltipContent>
    </Tooltip>
  )
}
