import { Input } from "@archron/ui"
import { MobileNav } from "./mobile-nav"
import type { User } from "@clerk/nextjs/server"

interface HeaderProps { user?: User | null }

export function Header({ user }: HeaderProps) {
  const email = user?.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-surface px-6">
      <MobileNav />
      <div className="flex-1" />
      <form role="search" className="w-64">
        <Input placeholder="Search..." type="search" aria-label="Search studio" />
      </form>
      <span className="text-caption text-muted-foreground">{email}</span>
    </header>
  )
}
