import React from "react"
import { cn } from "@archron/ui"

export interface EditorLayoutProps {
  children: React.ReactNode
  sidebarVisible?: boolean
  className?: string
}

export function EditorLayout({
  children,
  sidebarVisible = true,
  className,
}: EditorLayoutProps) {
  const [left, center, right] = React.Children.toArray(children)

  return (
    <div className={cn("flex h-full min-h-screen bg-background", className)}>
      {left && (
        <aside className="hidden lg:flex w-60 shrink-0 border-r bg-muted/10 flex-col overflow-y-auto">
          {left}
        </aside>
      )}
      <main className="flex-1 flex flex-col min-w-0">
        {center}
      </main>
      {right && sidebarVisible && (
        <aside className="hidden xl:flex w-72 shrink-0 border-l bg-muted/10 flex-col overflow-y-auto">
          {right}
        </aside>
      )}
    </div>
  )
}
