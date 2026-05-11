import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Button variants aligned with DESIGN.md §4 Component Stylings.
 *
 * - All buttons are full-pill (rounded-full / 999px radius).
 * - Primary: Uber Black bg, white text.
 * - Secondary: White bg, black border, black text.
 * - Ghost: transparent, hover chip-gray.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-uber-sm hover:opacity-90 active:shadow-uber-pressed",
        destructive:
          "bg-destructive text-white shadow-uber-sm hover:opacity-90 active:shadow-uber-pressed",
        outline:
          "border border-primary bg-background text-primary shadow-uber-sm hover:bg-[#f3f3f3] active:shadow-uber-pressed",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[#e2e2e2] active:shadow-uber-pressed",
        ghost:
          "hover:bg-secondary hover:text-secondary-foreground active:shadow-uber-pressed",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2 has-[>svg]:px-4",
        sm: "h-8 gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-12 px-8 py-3 text-base has-[>svg]:px-6",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
