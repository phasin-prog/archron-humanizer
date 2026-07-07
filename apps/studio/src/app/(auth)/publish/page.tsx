
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button } from "@archron/ui"

const COLUMNS = [
  {
    status: "review",
    label: "Awaiting Review",
    variant: "secondary" as const,
    items: [
      { id: "2", title: "Nietzsche and the Death of God", author: "jane.scholar", submitted: "1 day ago", slug: "nietzsche-death-god" },
      { id: "6", title: "Phenomenology of Perception", author: "marco.editor", submitted: "8 hours ago", slug: "phenomenology-perception" },
    ],
  },
  {
    status: "draft",
    label: "Changes Requested",
    variant: "warning" as const,
    items: [
      { id: "7", title: "Lacan's Mirror Stage Revisited", author: "ana.writer", submitted: "2 days ago", slug: "lacan-mirror-stage" },
    ],
  },
  {
    status: "published",
    label: "Ready to Publish",
    variant: "success" as const,
    items: [
      { id: "3", title: "Collective Unconscious: A Guide", author: "carl.gustav", submitted: "3 days ago", slug: "collective-unconscious" },
      { id: "8", title: "The Ethics of Ambiguity", author: "simone.beauvoir", submitted: "1 week ago", slug: "ethics-ambiguity" },
      { id: "9", title: "Eros and Civilization", author: "herbert.marcuse", submitted: "5 days ago", slug: "eros-civilization" },
    ],
  },
]

export default function PublishPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <h1 className="text-page-title font-serif font-bold">Publishing Queue</h1>

      <div className="grid grid-cols-3 gap-6">
        {COLUMNS.map((column) => (
          <div key={column.status} className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant={column.variant}>{column.label}</Badge>
              <span className="text-caption text-muted-foreground">{column.items.length}</span>
            </div>

            {column.items.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="text-card-title">{item.title}</CardTitle>
                  <CardDescription>{item.slug}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-caption text-muted-foreground">
                    <span>{item.author}</span>
                    <span>{item.submitted}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">Review</Button>
                    {column.status === "published" && (
                      <Button size="sm" className="flex-1">Publish</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
