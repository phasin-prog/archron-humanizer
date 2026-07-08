"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@archron/ui"

const placeholderCollections = [
  { name: "Jungian Psychology", itemCount: 12 },
  { name: "Existentialism", itemCount: 8 },
  { name: "Dream Analysis", itemCount: 5 },
  { name: "Nietzsche Studies", itemCount: 7 },
  { name: "Eastern Philosophy", itemCount: 10 },
  { name: "Psychoanalysis", itemCount: 15 },
]

export function CollectionsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {placeholderCollections.map((c) => (
        <Card key={c.name} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle>{c.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{c.itemCount} items</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
