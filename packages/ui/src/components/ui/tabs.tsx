"use client"

import React from "react"
import { cn } from "../../lib/utils"

interface TabsContextValue {
  activeValue: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabs(): TabsContextValue {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error("Tabs compound components must be used within <Tabs>")
  return ctx
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className,
  ...props
}: TabsProps): React.ReactElement {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "")
  const isControlled = controlledValue !== undefined
  const activeValue = isControlled ? controlledValue : internalValue

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (!isControlled) setInternalValue(newValue)
      onValueChange?.(newValue)
    },
    [isControlled, onValueChange]
  )

  return (
    <TabsContext.Provider value={{ activeValue, onValueChange: handleValueChange }}>
      <div className={cn("flex flex-col", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TabsList({ className, ...props }: TabsListProps): React.ReactElement {
  return (
    <div
      className={cn(
        "flex items-center gap-1 border-b border-border",
        className
      )}
      role="tablist"
      {...props}
    />
  )
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

export function TabsTrigger({
  className,
  value,
  children,
  ...props
}: TabsTriggerProps): React.ReactElement {
  const { activeValue, onValueChange } = useTabs()
  const isActive = activeValue === value

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30",
        className
      )}
      onClick={() => onValueChange(value)}
      role="tab"
      aria-selected={isActive}
      {...props}
    >
      {children}
    </button>
  )
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

export function TabsContent({
  className,
  value,
  children,
  ...props
}: TabsContentProps): React.ReactElement {
  const { activeValue } = useTabs()

  return (
    <div
      className={cn("pt-4", className)}
      role="tabpanel"
      hidden={activeValue !== value}
      {...props}
    >
      {children}
    </div>
  )
}
