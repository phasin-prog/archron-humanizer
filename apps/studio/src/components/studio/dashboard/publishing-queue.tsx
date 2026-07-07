import React from "react"
import { Card, CardContent, CardTitle, CardDescription, Badge } from "@archron/ui"

const QUEUE_ITEMS = [
  { id: "1", title: "Freud's Legacy: A Critical Analysis", status: "Awaiting Review", reviewer: "Dr. Helena Voss", date: "Jul 6, 2026" },
  { id: "2", title: "Jungian Perspectives on Dreams", status: "Changes Requested", reviewer: "Prof. Marcus Chen", date: "Jul 4, 2026" },
  { id: "3", title: "Symbolism in Alchemical Texts", status: "Ready", reviewer: "Dr. Amara Osei", date: "Jul 2, 2026" },
]

const STATUS_VARIANT: Record<string, "info" | "warning" | "success"> = {
  "Awaiting Review": "info",
  "Changes Requested": "warning",
  "Ready": "success",
}

export function PublishingQueue(): React.ReactElement {
  return (
    <section>
      <h2 className="mb-3 text-section-title font-serif font-semibold">Publishing Queue</h2>
      <div className="space-y-3">
        {QUEUE_ITEMS.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <CardTitle className="text-card-title">{item.title}</CardTitle>
                <CardDescription className="mt-1">
                  Reviewer: {item.reviewer} &middot; {item.date}
                </CardDescription>
              </div>
              <Badge variant={STATUS_VARIANT[item.status] ?? "info"}>
                {item.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
