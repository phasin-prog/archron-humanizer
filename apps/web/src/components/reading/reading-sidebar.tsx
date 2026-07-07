import Link from "next/link"
import { Divider } from "@archron/ui"

interface SidebarLink {
  label: string
  href: string
  subtitle?: string
}

interface SidebarSection {
  title: string
  links: SidebarLink[]
}

interface ReadingSidebarProps {
  sections: SidebarSection[]
}

export function ReadingSidebar({ sections }: ReadingSidebarProps) {
  return (
    <aside className="flex w-72 shrink-0 flex-col gap-4">
      {sections.map((section, i) => (
        <div key={section.title}>
          {i > 0 && <Divider className="mb-4" />}
          <h3 className="font-serif text-card-title font-semibold text-text mb-2">
            {section.title}
          </h3>
          <ul className="space-y-1">
            {section.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group block rounded-lg px-3 py-1.5 -mx-3 transition-colors duration-[var(--motion-fast)] hover:bg-elevated"
                >
                  <span className="text-caption text-text-muted group-hover:text-text transition-colors">
                    {link.label}
                  </span>
                  {link.subtitle && (
                    <span className="block text-meta text-text-disabled">
                      {link.subtitle}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  )
}
