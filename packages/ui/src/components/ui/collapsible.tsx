"use client"

import React from "react"
import { cn } from "../../lib/utils"

interface CollapsibleContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null)

function useCollapsible(): CollapsibleContextValue {
  const ctx = React.useContext(CollapsibleContext)
  if (!ctx) throw new Error("Collapsible compound components must be used within <Collapsible>")
  return ctx
}

export interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Collapsible({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
  className,
  ...props
}: CollapsibleProps): React.ReactElement {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange]
  )

  return (
    <CollapsibleContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      <div className={cn("flex flex-col", className)} {...props}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  )
}

export interface CollapsibleTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export function CollapsibleTrigger({
  className,
  asChild,
  children,
  ...props
}: CollapsibleTriggerProps): React.ReactElement {
  const { open, onOpenChange } = useCollapsible()

  if (asChild && React.isValidElement(children)) {
    const rawProps = children.props as Record<string, unknown>
    const existingOnClick = rawProps.onClick as
      | undefined
      | ((...args: unknown[]) => void)

    return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      onClick: (...args: unknown[]) => {
        onOpenChange(!open)
        existingOnClick?.(...args)
      },
      "aria-expanded": open,
      ...props,
    })
  }

  return (
    <button
      className={cn("inline-flex items-center justify-center", className)}
      onClick={() => onOpenChange(!open)}
      aria-expanded={open}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}

export interface CollapsibleContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CollapsibleContent({
  className,
  children,
  ...props
}: CollapsibleContentProps): React.ReactElement {
  const { open } = useCollapsible()
  const ref = React.useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = React.useState(0)

  React.useEffect(() => {
    if (ref.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContentHeight(entry.contentRect.height)
        }
      })
      resizeObserver.observe(ref.current)
      return () => resizeObserver.disconnect()
    }
    return
  }, [])

  return (
    <div
      className={cn(
        "overflow-hidden transition-[height] duration-300 ease-in-out",
        className
      )}
      style={{ height: open ? contentHeight : 0 }}
      aria-hidden={!open}
      {...props}
    >
      <div ref={ref}>
        {children}
      </div>
    </div>
  )
}
