import Link from "next/link"
import { Card, CardContent } from "@archron/ui"

const ACTIONS = [
  { href: "/studio/drafts/new", label: "New Draft", desc: "Start writing a new article", icon: "✎" },
  { href: "/studio/objects/new", label: "New Concept", desc: "Add a concept to the knowledge base", icon: "◈" },
  { href: "/studio/workspace?tab=assets", label: "Upload Media", desc: "Upload images, audio, or video", icon: "⬆" },
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {ACTIONS.map((action) => (
        <Link key={action.href} href={action.href}>
          <Card className="cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            <CardContent className="flex items-center gap-4 p-4">
              <span className="text-2xl" aria-hidden="true">{action.icon}</span>
              <div>
                <p className="text-body font-medium">{action.label}</p>
                <p className="text-caption text-muted-foreground">{action.desc}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
