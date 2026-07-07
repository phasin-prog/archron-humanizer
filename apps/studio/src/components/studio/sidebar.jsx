"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@archron/ui";
import { UserButton } from "@clerk/nextjs";
const NAV_ITEMS = [
    { href: "/studio/dashboard", label: "Dashboard", icon: "⌂" },
    { href: "/studio/workspace", label: "Workspace", icon: "⊞" },
    { href: "/studio/objects", label: "Objects", icon: "◈" },
    { href: "/studio/drafts", label: "Drafts", icon: "✎" },
    { href: "/studio/publish", label: "Publishing", icon: "⇧" },
];
export function Sidebar() {
    const pathname = usePathname();
    return (<aside className="flex w-60 shrink-0 flex-col border-r bg-surface">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <span className="text-card-title font-serif font-bold">ARCHRON</span>
        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary">Studio</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => (<Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-body transition-colors hover:bg-muted", pathname.startsWith(item.href) && "bg-muted text-primary font-medium")}>
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>))}
      </nav>
      <div className="border-t p-3">
        <UserButton />
      </div>
    </aside>);
}
