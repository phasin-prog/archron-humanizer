import React from "react"
import { Card, CardContent, CardTitle, CardDescription } from "@archron/ui"

const STATS = [
  { label: "Words Today", value: "1,247", desc: "+12% from yesterday" },
  { label: "Active Drafts", value: "8", desc: "3 in review" },
  { label: "Published", value: "42", desc: "Articles and concepts" },
]

export function StatsBar(): React.ReactElement {
  return (
    <section aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="mb-3 text-section-title font-serif font-semibold">Stats</h2>
      <div className="space-y-3">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <CardTitle className="text-card-title">{stat.value}</CardTitle>
              <CardDescription className="text-caption text-muted-foreground">
                {stat.label}
              </CardDescription>
              <p className="mt-1 text-caption text-muted-foreground">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
