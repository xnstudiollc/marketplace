import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,#6d4aff_0%,#4f46e5_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_8px_24px_-10px_rgba(124,92,255,0.6)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_10px_32px_-8px_rgba(124,92,255,0.85)] hover:brightness-110",
        outline:
          "border-line-strong bg-transparent hover:bg-surface-hover hover:text-foreground aria-expanded:bg-surface-hover",
        secondary:
          "border-line bg-surface text-fg shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md hover:border-line-strong hover:bg-surface-hover aria-expanded:bg-surface-hover",
        ghost: "text-fg-muted hover:bg-surface-hover hover:text-fg aria-expanded:bg-surface-hover aria-expanded:text-fg",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link: "text-brand-2 underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-11 gap-2 rounded-xl px-4 has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5",
        xs: "h-7 gap-1 rounded-lg px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 rounded-lg px-3 text-[0.8125rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 rounded-xl px-6 text-[0.9375rem]",
        icon: "size-11 rounded-xl",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-lg",
        "icon-lg": "size-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
