import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const tagVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      objectType: {
        concept: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
        thinker: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
        theory: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
        school: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
        book: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
        article: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
        symbol: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
        quote: "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300",
        timeline_event: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
        default: "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300",
      },
    },
    defaultVariants: {
      objectType: "default",
    },
  }
)

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  label: string
}

export function Tag({
  className,
  objectType,
  label,
  ...props
}: TagProps): React.ReactElement {
  return (
    <span
      className={cn(tagVariants({ objectType }), className)}
      {...props}
    >
      {label}
    </span>
  )
}

export { tagVariants }
