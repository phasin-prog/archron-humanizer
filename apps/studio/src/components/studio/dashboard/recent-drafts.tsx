import React from "react"
import Link from "next/link"
import { Card, CardContent, CardTitle, CardDescription, Badge } from "@archron/ui"

const DRAFTS = [
  { id: "1", title: "The Shadow in Modern Culture", status: "Draft", date: "Jul 7, 2026" },
  { id: "2", title: "Nietzsche and the Ubermensch", status: "Review", date: "Jul 5, 2026" },
  { id: "3", title: "Archetypes in Contemporary Film", status: "Draft", date: "Jul 3, 2026" },
  { id: "4", title: "The Collective Unconscious", status: "Draft", date: "Jun 30, 2026" },
] as const

export function RecentDrafts(): React.ReactElement {
  return (
    <section aria-labelledby="recent-drafts-heading">
      <h2 id="recent-drafts-heading" className="mb-3 text-section-title font-serif font-semibold">Recent Drafts</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {DRAFTS.map((draft) => (
          <Link key={draft.id} href={`/studio/drafts/${draft.id}`}>
            <Card className="cursor-pointer transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              <CardContent className="p-4">
                <CardTitle className="text-card-title">{draft.title}</CardTitle>
                <CardDescription className="mt-1 flex items-center gap-2">
                  <Badge variant={draft.status === "Review" ? "info" : "warning"}>
                    {draft.status}
                  </Badge>
                  <span>{draft.date}</span>
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
