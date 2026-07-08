"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@archron/ui"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@archron/ui"
import { UserButton } from "@archron/auth/client"

const NAV_ITEMS = [
  { href: "/studio/dashboard", label: "Dashboard", icon: "⌂", ariaLabel: "Dashboard" },
  { href: "/studio/workspace", label: "Workspace", icon: "⊞", ariaLabel: "Workspace" },
  { href: "/studio/objects", label: "Objects", icon: "◈", ariaLabel: "Objects" },
  { href: "/studio/drafts", label: "Drafts", icon: "✎", ariaLabel: "Drafts" },
  { href: "/studio/publish", label: "Publishing", icon: "⇧", ariaLabel: "Publishing" },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <Sheet>
      <SheetTrigger className="flex items-center justify-center h-9 w-9 rounded-md border bg-surface hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden" aria-label="Open navigation menu">
        <span className="text-lg" aria-hidden="true">☰</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-60">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <span className="font-serif font-bold">ARCHRON</span>
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary">Studio</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-6 space-y-1" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.ariaLabel}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-body transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                pathname.startsWith(item.href) && "bg-muted text-primary font-medium",
              )}
            >
              <span className="text-lg" aria-hidden="true">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 border-t pt-3">
          <UserButton />
        </div>
      </SheetContent>
    </Sheet>
  )
}
