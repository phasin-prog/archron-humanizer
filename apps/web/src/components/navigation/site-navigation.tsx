import Link from "next/link"
import { ExploreIcon, TimelineIcon, ConstellationIcon, GuideIcon } from "@archron/ui"

interface SiteNavigationProps {
  className?: string
}

export function SiteNavigation({ className = "" }: SiteNavigationProps) {
  const links = [
    { href: "/explore", label: "Explore", Icon: ExploreIcon },
    { href: "/timeline", label: "Timeline", Icon: TimelineIcon },
    { href: "/constellation", label: "Constellation", Icon: ConstellationIcon },
    { href: "/guides", label: "Guides", Icon: GuideIcon },
  ]

  return (
    <nav className={`flex items-center justify-center gap-2 ${className}`}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="group flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 transition-all duration-[var(--motion-normal)] hover:border-primary/40 hover:bg-elevated"
        >
          <link.Icon className="h-4 w-4 opacity-60 transition-opacity group-hover:opacity-100" />
          <span className="font-sans text-body font-normal text-text-secondary transition-colors group-hover:text-primary">
            {link.label}
          </span>
        </Link>
      ))}
    </nav>
  )
}
