import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const iconVariants = cva("shrink-0", {
  variants: {
    size: {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
      xl: "h-8 w-8",
    },
    color: {
      default: "text-text-muted",
      primary: "text-primary",
      muted: "text-text-disabled",
      destructive: "text-destructive",
      success: "text-success",
      warning: "text-warning",
    },
  },
  defaultVariants: {
    size: "md",
    color: "default",
  },
})

export interface IconProps extends VariantProps<typeof iconVariants> {
  className?: string
  "aria-label"?: string
}

export function Icon({
  size,
  color,
  className,
  "aria-label": ariaLabel,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <span
      className={cn(iconVariants({ size, color }), className)}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
      role={ariaLabel ? "img" : "presentation"}
    >
      {children}
    </span>
  )
}

export { iconVariants }
