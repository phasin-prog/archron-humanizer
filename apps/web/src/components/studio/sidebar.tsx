"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@archron/ui"
import { UserButton } from "@archron/auth/client"

const NAV_ITEMS = [
  { href: "/studio/dashboard", label: "Dashboard", icon: "⌂", ariaLabel: "Dashboard" },
  { href: "/studio/workspace", label: "Workspace", icon: "⊞", ariaLabel: "Workspace" },
  { href: "/studio/objects", label: "Objects", icon: "◈", ariaLabel: "Objects" },
  { href: "/studio/drafts", label: "Drafts", icon: "✎", ariaLabel: "Drafts" },
  { href: "/studio/publish", label: "Publishing", icon: "⇧", ariaLabel: "Publishing" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r bg-surface md:flex">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <span className="text-card-title font-serif font-bold">ARCHRON</span>
        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary">Studio</span>
      </div>
      <nav className="flex-1 space-y-1 p-3" aria-label="Main navigation">
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
      <div className="border-t p-3">
        <UserButton />
      </div>
    </aside>
  )
}
