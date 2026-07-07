import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const dividerVariants = cva("shrink-0", {
  variants: {
    orientation: {
      horizontal: "h-px w-full border-0 bg-border",
      vertical: "h-full w-px border-0 bg-border",
    },
    variant: {
      default: "",
      muted: "bg-muted",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    variant: "default",
  },
})

export interface DividerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dividerVariants> {
  label?: React.ReactNode
}

export function Divider({
  className,
  orientation,
  variant,
  label,
  ...props
}: DividerProps): React.ReactElement {
  if (label) {
    return (
      <div
        className={cn(
          "flex w-full items-center gap-3",
          className
        )}
        role="separator"
        {...props}
      >
        <hr className={cn(dividerVariants({ orientation: "horizontal", variant }), "flex-1")} />
        <span className="text-xs text-muted-foreground shrink-0 select-none">
          {label}
        </span>
        <hr className={cn(dividerVariants({ orientation: "horizontal", variant }), "flex-1")} />
      </div>
    )
  }

  if (orientation === "vertical") {
    return (
      <div
        className={cn(
          dividerVariants({ orientation: "vertical", variant }),
          "self-stretch",
          className
        )}
        role="separator"
        aria-orientation="vertical"
        {...props}
      />
    )
  }

  return (
    <hr
      className={cn(dividerVariants({ orientation, variant }), className)}
      role="separator"
      {...props}
    />
  )
}

export { dividerVariants }
