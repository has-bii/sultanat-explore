import * as React from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"
import Link from "next/link"

import { Separator } from "./ui/separator"
import { SidebarTrigger } from "./ui/sidebar"

// ── Header ──

interface HeaderProps {
  children: React.ReactNode
  className?: string
}

export function Header({ children, className }: HeaderProps) {
  return (
    <div className={cn("grid h-16 grid-cols-3 gap-2 border-b px-4 py-3", className)}>
      {children}
    </div>
  )
}

// ── HeaderLeft ──

interface HeaderLeftProps {
  children: React.ReactNode
  className?: string
}

export function HeaderLeft({ children, className }: HeaderLeftProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="my-auto mr-2 data-[orientation=vertical]:h-4" />
      {children}
    </div>
  )
}

// ── HeaderCenter ──

interface HeaderCenterProps {
  children?: React.ReactNode
  className?: string
}

export function HeaderCenter({ children, className }: HeaderCenterProps) {
  return <div className={cn("flex items-center justify-center gap-2", className)}>{children}</div>
}

// ── HeaderRight ──

interface HeaderRightProps {
  children?: React.ReactNode
  className?: string
}

export function HeaderRight({ children, className }: HeaderRightProps) {
  return <div className={cn("flex items-center justify-end gap-2", className)}>{children}</div>
}

// ── HeaderBreadcrumb ──

export type HeaderBreadcrumbItem = Array<{ label: string; href?: string }>

interface HeaderBreadcrumbProps {
  items: HeaderBreadcrumbItem
  className?: string
}

export function HeaderBreadcrumb({ items, className }: HeaderBreadcrumbProps) {
  if (items.length === 0) return null

  return (
    <Breadcrumb className={cn("flex", className)}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <React.Fragment key={item.label}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-medium">{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href!}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
