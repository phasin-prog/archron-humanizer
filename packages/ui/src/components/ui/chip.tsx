import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"
import { X } from "lucide-react"

const chipVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-border bg-background text-foreground hover:bg-accent",
        active:
          "border-primary/50 bg-primary/10 text-primary",
        removable:
          "border-border bg-background text-foreground pr-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {
  label: string
  onRemove?: () => void
  icon?: React.ReactNode
}

export function Chip({
  className,
  variant,
  label,
  onRemove,
  icon,
  ...props
}: ChipProps): React.ReactElement {
  return (
    <span
      className={cn(chipVariants({ variant }), className)}
      {...props}
    >
      {icon}
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-0.5 rounded-full p-0.5 hover:bg-border/50 transition-colors"
          aria-label={`Remove ${label}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  )
}

export { chipVariants }
