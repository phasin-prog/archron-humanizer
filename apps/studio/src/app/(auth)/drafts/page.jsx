import Link from "next/link";
import { Card, CardContent, CardDescription, CardTitle, Badge, Button, Select } from "@archron/ui";
const STATUS_OPTIONS = [
    { value: "all", label: "All Statuses" },
    { value: "draft", label: "Draft" },
    { value: "review", label: "In Review" },
    { value: "published", label: "Published" },
    { value: "archived", label: "Archived" },
];
const DRAFTS = [
    { id: "1", title: "The Shadow in Jungian Psychology", status: "draft", slug: "shadow-jungian", wordCount: 2450, lastEdited: "2 hours ago" },
    { id: "2", title: "Nietzsche and the Death of God", status: "review", slug: "nietzsche-death-god", wordCount: 5120, lastEdited: "1 day ago" },
    { id: "3", title: "Collective Unconscious: A Guide", status: "published", slug: "collective-unconscious", wordCount: 8900, lastEdited: "3 days ago" },
    { id: "4", title: "Freud's Interpretation of Dreams", status: "draft", slug: "freud-interpretation-dreams", wordCount: 1200, lastEdited: "5 hours ago" },
    { id: "5", title: "Existentialism and Authenticity", status: "review", slug: "existentialism-authenticity", wordCount: 3400, lastEdited: "12 hours ago" },
];
const STATUS_VARIANT = {
    draft: "warning",
    review: "secondary",
    published: "success",
    archived: "destructive",
};
export default function DraftsPage() {
    return (<div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-page-title font-serif font-bold">Drafts</h1>
        <Link href="/studio/drafts/new">
          <Button>New Draft</Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Select options={STATUS_OPTIONS} defaultValue="all" className="w-48"/>
        <span className="text-caption text-muted-foreground">{DRAFTS.length} drafts</span>
      </div>

      <div className="space-y-3">
        {DRAFTS.map((draft) => (<Link key={draft.id} href={`/studio/drafts/${draft.id}`}>
            <Card className="cursor-pointer transition-colors hover:border-primary/50">
              <CardContent className="flex items-center justify-between p-4">
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-card-title truncate">{draft.title}</CardTitle>
                  <CardDescription className="mt-1">{draft.slug}</CardDescription>
                </div>
                <div className="flex items-center gap-4 text-caption text-muted-foreground">
                  <span>{draft.wordCount.toLocaleString()} words</span>
                  <span>{draft.lastEdited}</span>
                  <Badge variant={STATUS_VARIANT[draft.status]}>{draft.status}</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>))}
      </div>
    </div>);
}
