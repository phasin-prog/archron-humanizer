import React from "react"
import { Card, CardContent } from "@archron/ui"

export function EmptyDrafts() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <span className="text-4xl mb-4" aria-hidden="true">✎</span>
        <h3 className="text-card-title font-semibold mb-2">No drafts yet</h3>
        <p className="text-caption text-muted-foreground max-w-sm">
          Start writing your first article or concept. Click "New Draft" in Quick Actions to begin.
        </p>
      </CardContent>
    </Card>
  )
}
