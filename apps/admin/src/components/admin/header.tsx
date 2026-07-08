import { Input } from "@archron/ui"
import type { User } from "@archron/auth"

interface HeaderProps { user?: User | null }

export function Header({ user }: HeaderProps) {
  const email = user?.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-surface px-6">
      <div className="flex-1" />
      <div className="w-64">
        <Input placeholder="Search..." type="search" />
      </div>
      <span className="text-caption text-muted-foreground">{email}</span>
    </header>
  )
}
