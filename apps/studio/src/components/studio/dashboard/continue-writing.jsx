import Link from "next/link";
import { Card, CardContent, CardTitle, Badge } from "@archron/ui";
export function ContinueWriting() {
    return (<Card className="border-primary/30 bg-primary/5">
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-caption text-muted-foreground">Continue Writing</p>
          <CardTitle className="text-card-title">The Shadow</CardTitle>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="warning">Draft</Badge>
            <span className="text-caption text-muted-foreground">Last edited: 2 hours ago</span>
          </div>
        </div>
        <Link href="/studio/drafts/1" className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
          Continue
        </Link>
      </CardContent>
    </Card>);
}
