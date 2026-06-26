"use client"

import { ReactNode } from "react"

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

import QueryProvider from "./query-provider"

type Props = {
  children: ReactNode
}

export default function RootProviders({ children }: Props) {
  return (
    <TooltipProvider>
      <QueryProvider>{children}</QueryProvider>
      <Toaster richColors theme="light" position="top-right" />
    </TooltipProvider>
  )
}
