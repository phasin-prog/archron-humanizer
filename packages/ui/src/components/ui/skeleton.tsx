import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const skeletonVariants = cva(
  "animate-pulse rounded bg-muted",
  {
    variants: {
      variant: {
        text: "h-4 w-full",
        circular: "rounded-full",
        rectangular: "rounded-md",
      },
    },
    defaultVariants: {
      variant: "text",
    },
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number
  height?: string | number
}

export function Skeleton({
  className,
  variant,
  width,
  height,
  style,
  ...props
}: SkeletonProps): React.ReactElement {
  return (
    <div
      className={cn(skeletonVariants({ variant }), className)}
      style={{
        width:
          typeof width === "number" ? `${width}px` : width,
        height:
          typeof height === "number" ? `${height}px` : height,
        ...style,
      }}
      {...props}
    />
  )
}

export { skeletonVariants }
