"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@archron/auth/client"
import { cn } from "@archron/ui"
import { SearchIcon, ExploreIcon } from "@archron/ui"

const PUBLIC_LINKS = [
  { href: "/explore", label: "Guides", icon: ExploreIcon },
]

const AUTH_LINKS = [
  { href: "/continue", label: "Continue Reading", icon: SearchIcon },
]

export function Navbar() {
  const pathname = usePathname()
  const isReading = pathname.startsWith("/concepts/") || pathname.startsWith("/thinkers/") || pathname.startsWith("/articles/")

  return (
    <header
      className={cn(
        "sticky top-0 z-[var(--z-sticky)] border-b border-border/50 bg-background/80 backdrop-blur-md transition-all",
        isReading && "border-transparent bg-background/60",
      )}
    >
      <div className="mx-auto flex h-14 max-w-container-page items-center gap-1 px-6">
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            "mr-4 shrink-0 font-display text-section font-bold tracking-tight transition-colors duration-[var(--motion-fast)]",
            pathname === "/" ? "text-primary" : "text-text hover:text-primary",
          )}
        >
          ARCHRON
        </Link>

        {/* Desktop Search */}
        <div className="hidden flex-1 md:flex md:max-w-[320px]">
          <label className="relative w-full">
            <span className="sr-only">Search everything</span>
            <SearchIcon
              size="sm"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled"
            />
            <input
              type="search"
              placeholder="Search Everything..."
              aria-label="Search everything"
              className="w-full rounded-lg border border-input bg-card py-1.5 pl-9 pr-3 text-caption text-text placeholder:text-text-disabled focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-colors duration-[var(--motion-fast)]"
            />
          </label>
        </div>

        {/* Nav Links — Desktop */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {PUBLIC_LINKS.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} active={pathname.startsWith(link.href)} />
          ))}
          <SignedIn>
            {AUTH_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} active={pathname.startsWith(link.href)} />
            ))}
          </SignedIn>
          <NavLink href="/support" label="Support" active={pathname.startsWith("/support")} />
        </nav>

        {/* Right: Profile / Sign In */}
        <div className="ml-auto flex items-center gap-2">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-lg px-4 py-2 text-caption font-medium text-text-muted transition-colors duration-[var(--motion-fast)] hover:bg-elevated hover:text-text">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-7 w-7 rounded-full ring-1 ring-border/50",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}

function NavLink({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-lg px-4 py-2 text-caption font-medium transition-colors duration-[var(--motion-fast)]",
        active
          ? "bg-primary/10 text-primary"
          : "text-text-muted hover:bg-elevated hover:text-text",
      )}
    >
      {label}
    </Link>
  )
}
