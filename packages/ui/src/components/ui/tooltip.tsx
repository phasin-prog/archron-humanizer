"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

function Tooltip({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  const show = () => {
    timeoutRef.current = setTimeout(() => setOpen(true), 500)
  }
  const hide = () => {
    clearTimeout(timeoutRef.current)
    setOpen(false)
  }

  return (
    <div className="relative inline-block" onMouseEnter={show} onMouseLeave={hide}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && (child.type as any)?.displayName === "TooltipTrigger") {
          return child
        }
        if (React.isValidElement(child) && (child.type as any)?.displayName === "TooltipContent") {
          return open ? child : null
        }
        return child
      })}
    </div>
  )
}

function TooltipTrigger({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("cursor-help", className)} {...props}>{children}</span>
}
TooltipTrigger.displayName = "TooltipTrigger"

function TooltipContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 rounded-md bg-foreground px-3 py-1.5 text-caption text-background shadow-md whitespace-nowrap",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent }
