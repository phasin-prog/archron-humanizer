import React from "react"
import { Card, CardContent } from "@archron/ui"

const ACTIVITIES = [
  { id: "1", text: "Dr. Helena Voss completed review of \"Freud's Legacy\"", timestamp: "10 minutes ago" },
  { id: "2", text: "You created a new draft: \"The Anima in Literature\"", timestamp: "1 hour ago" },
  { id: "3", text: "Prof. Marcus Chen requested changes on \"Jungian Dreams\"", timestamp: "3 hours ago" },
  { id: "4", text: "New concept \"Individuation\" was published", timestamp: "6 hours ago" },
  { id: "5", text: "You uploaded 3 media assets", timestamp: "Yesterday" },
  { id: "6", text: "\"Archetypes in Film\" moved to review", timestamp: "Yesterday" },
  { id: "7", text: "New thinker profile: Marie-Louise von Franz", timestamp: "2 days ago" },
]

export function ActivityFeed(): React.ReactElement {
  return (
    <section>
      <h2 className="mb-3 text-section-title font-serif font-semibold">Activity</h2>
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {ACTIVITIES.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-muted-foreground/40" />
                <div>
                  <p className="text-caption">{activity.text}</p>
                  <p className="text-caption text-muted-foreground">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
