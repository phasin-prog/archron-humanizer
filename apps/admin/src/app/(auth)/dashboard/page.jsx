import { Card, CardContent, CardTitle, CardDescription, Badge } from "@archron/ui";
import Link from "next/link";
const STATS = [
    { label: "Total Users", value: "1,247", desc: "+34 this month" },
    { label: "Active Writers", value: "89", desc: "12 pending applications" },
    { label: "Content Published", value: "432", desc: "28 in review" },
    { label: "Flagged Content", value: "7", desc: "3 unresolved" },
];
const QUICK_LINKS = [
    { label: "Moderation Queue", href: "/admin/moderation", badge: "3 pending" },
    { label: "User Management", href: "/admin/users" },
    { label: "Content Management", href: "/admin/content" },
    { label: "Audit Trail", href: "/admin/audit" },
];
const ACTIVITIES = [
    { id: "1", action: "Role change", detail: "Dr. Helena Voss promoted from writer to reviewer", timestamp: "10 minutes ago" },
    { id: "2", action: "Flag resolved", detail: "Flag #142 on \"Freud's Legacy\" dismissed", timestamp: "1 hour ago" },
    { id: "3", action: "Content archived", detail: "\"Jungian Dreams\" archived by Prof. Marcus Chen", timestamp: "3 hours ago" },
    { id: "4", action: "Role change", detail: "You changed Alex Reed's role to writer", timestamp: "6 hours ago" },
    { id: "5", action: "Flag raised", detail: "Profanity flag on user comment by Maria Silva", timestamp: "Yesterday" },
    { id: "6", action: "Role change", detail: "Emily Park promoted from member to writer", timestamp: "Yesterday" },
    { id: "7", action: "Content deleted", detail: "Draft \"Untitled\" deleted by system cleanup", timestamp: "2 days ago" },
    { id: "8", action: "Flag resolved", detail: "Flag #138 resolved with warning to user", timestamp: "2 days ago" },
];
export default function AdminDashboardPage() {
    return (<div className="mx-auto max-w-6xl space-y-6 p-6">
      <h2 className="text-page-title font-serif font-bold">Dashboard</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (<Card key={stat.label}>
            <CardContent className="p-4">
              <CardTitle className="text-card-title">{stat.value}</CardTitle>
              <CardDescription className="text-caption text-muted-foreground">
                {stat.label}
              </CardDescription>
              <p className="mt-1 text-caption text-muted-foreground">{stat.desc}</p>
            </CardContent>
          </Card>))}
      </div>

      <section>
        <h3 className="mb-3 text-section-title font-serif font-semibold">Quick Links</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map((link) => (<Link key={link.href} href={link.href}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardContent className="flex items-center justify-between p-4">
                  <span className="text-caption font-medium">{link.label}</span>
                  {link.badge && (<Badge variant="secondary" className="text-xs">{link.badge}</Badge>)}
                </CardContent>
              </Card>
            </Link>))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-section-title font-serif font-semibold">Recent Activity</h3>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {ACTIVITIES.map((activity) => (<div key={activity.id} className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-muted-foreground/40"/>
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{activity.action}</Badge>
                      <span className="text-caption">{activity.detail}</span>
                    </div>
                    <p className="text-caption text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>);
}
