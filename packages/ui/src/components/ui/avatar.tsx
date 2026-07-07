import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full bg-muted",
  {
    variants: {
      size: {
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {}

export function Avatar({
  className,
  size,
  ...props
}: AvatarProps): React.ReactElement {
  return (
    <div
      className={cn(avatarVariants({ size }), className)}
      {...props}
    />
  )
}

export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export function AvatarImage({
  className,
  src,
  alt = "",
  ...props
}: AvatarImageProps): React.ReactElement {
  return (
    <img
      src={src}
      alt={alt}
      className={cn("h-full w-full object-cover", className)}
      onError={(e) => {
        const target = e.currentTarget
        target.style.display = "none"
        const fallback = target.nextElementSibling as HTMLElement | null
        if (fallback) fallback.style.display = "flex"
      }}
      {...props}
    />
  )
}

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AvatarFallback({
  className,
  children,
  ...props
}: AvatarFallbackProps): React.ReactElement {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center font-medium text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { avatarVariants }
