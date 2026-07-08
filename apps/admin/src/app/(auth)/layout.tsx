import { requireRole } from "@archron/auth"
import { Badge } from "@archron/ui"
import Link from "next/link"

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Users", href: "/admin/users" },
  { label: "Moderation", href: "/admin/moderation" },
  { label: "Content", href: "/admin/content" },
  { label: "Configuration", href: "/admin/configuration" },
  { label: "Audit", href: "/admin/audit" },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = await requireRole("administrator")

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="flex w-56 shrink-0 flex-col border-r bg-muted/10">
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <span className="font-serif text-lg font-bold">ARCHRON</span>
          <Badge variant="secondary" className="text-xs">Admin</Badge>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-caption transition-colors hover:bg-muted"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t p-3">
          <p className="text-caption text-muted-foreground">
            {auth.user?.primaryEmailAddress?.emailAddress ?? auth.userId}
          </p>
        </div>
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b px-6">
          <h1 className="text-page-title font-serif font-bold">Admin</h1>
          <div className="flex items-center gap-3">
            <span className="text-caption text-muted-foreground">{auth.role}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-muted/5">{children}</main>
      </div>
    </div>
  )
}
