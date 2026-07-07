import { Card, CardContent, CardHeader, CardTitle, Badge, Avatar, AvatarImage, AvatarFallback, Divider, Progress } from "@archron/ui";
const PLACEHOLDER_PROFILE = {
    displayName: "Somchai Rattanapong",
    username: "somchai",
    role: "Writer",
    level: { name: "Scholar", requiredReputation: 500, badgeColor: "#C4A040" },
    bio: "Exploring the intersections of analytical psychology and Eastern philosophy. Focused on Jungian individuation and its parallels with Buddhist practice.",
    avatarUrl: null,
    memberSince: "Jan 2024",
    expertise: ["Psychology", "Philosophy", "Religion"],
    reputation: 840,
    levelMax: 1000,
    stats: {
        publishedConcepts: 12,
        publishedArticles: 8,
        publishedBooks: 3,
        totalViews: 12400,
        readingStreak: 12,
        guidesCompleted: 3,
    },
    contributions: {
        articles: 8,
        concepts: 12,
        books: 3,
        reviews: 24,
        references: 56,
        collections: 5,
        symbols: 2,
    },
    achievements: [
        { name: "100 References", description: "Added 100 verified references", icon: "📚", earned: true },
        { name: "50 Reviews", description: "Completed 50 peer reviews", icon: "✅", earned: true },
        { name: "Verified Contributor", description: "Identity verified as domain expert", icon: "🏅", earned: true },
        { name: "Prolific Writer", description: "Published 25 articles", icon: "✍️", earned: false },
    ],
    collections: [
        { title: "My Jung Reading List", count: 12, visibility: "Public" },
        { title: "Dreams & Symbols", count: 8, visibility: "Public" },
        { title: "Eastern Traditions", count: 5, visibility: "Private" },
    ],
    recentActivity: [
        { action: "Published", target: "The Shadow", date: "2 days ago" },
        { action: "Reviewed", target: "Persona", date: "3 days ago" },
        { action: "Created", target: "Jung Collection", date: "5 days ago" },
        { action: "Completed Guide", target: "Introduction to Analytical Psychology", date: "1 week ago" },
    ],
};
export default function ProfilePage() {
    const p = PLACEHOLDER_PROFILE;
    return (<div className="mx-auto max-w-container-page px-6 pb-24 pt-10">
      {/* Header */}
      <div className="flex items-start gap-6">
        <Avatar size="lg" className="h-20 w-20">
          {p.avatarUrl ? (<AvatarImage src={p.avatarUrl} alt={p.displayName}/>) : (<AvatarFallback className="bg-primary/15 text-primary text-xl font-semibold">
              {p.displayName.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>)}
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-display font-bold text-text">{p.displayName}</h1>
            <Badge variant="secondary" className="text-xs">{p.role}</Badge>
            <Badge className="text-xs" style={{
            backgroundColor: `${p.level.badgeColor}15`,
            color: p.level.badgeColor,
            borderColor: `${p.level.badgeColor}30`,
        }}>
              {p.level.name}
            </Badge>
          </div>
          <p className="mt-2 text-body text-text-muted max-w-2xl">{p.bio}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {p.expertise.map((tag) => (<Badge key={tag} variant="outline" className="text-caption">{tag}</Badge>))}
          </div>
          <p className="mt-2 text-caption text-text-disabled">Member since {p.memberSince}</p>
        </div>
      </div>

      <Divider className="my-8"/>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left column: main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contributions */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-section font-semibold">Contributions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Object.entries(p.contributions).map(([type, count]) => (<div key={type} className="rounded-lg border border-border bg-elevated p-3 text-center">
                    <p className="font-mono text-page-title font-bold text-text">{count}</p>
                    <p className="text-caption text-text-muted capitalize">{type}</p>
                  </div>))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-section font-semibold">Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {p.achievements.map((a) => (<div key={a.name} className={`rounded-lg border p-3 text-center transition-opacity ${a.earned ? "border-border bg-elevated" : "border-muted bg-card opacity-40"}`}>
                    <p className="text-2xl">{a.icon}</p>
                    <p className="mt-1 font-sans text-label font-medium text-text">{a.name}</p>
                    <p className="mt-0.5 text-meta text-text-muted line-clamp-1">{a.description}</p>
                  </div>))}
              </div>
            </CardContent>
          </Card>

          {/* Collections */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-section font-semibold">Collections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {p.collections.map((c) => (<div key={c.title} className="flex items-center justify-between rounded-lg border border-border bg-elevated p-4">
                  <div>
                    <p className="font-sans text-label font-medium text-text">{c.title}</p>
                    <p className="text-caption text-text-muted">{c.count} objects &middot; {c.visibility}</p>
                  </div>
                  <Badge variant="secondary" className="text-caption">{c.visibility}</Badge>
                </div>))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-section font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {p.recentActivity.map((a, i) => (<div key={i} className="flex items-center gap-3 text-body">
                  <Badge variant="outline" className="text-caption">{a.action}</Badge>
                  <span className="flex-1 text-text">{a.target}</span>
                  <span className="text-caption text-text-disabled">{a.date}</span>
                </div>))}
            </CardContent>
          </Card>
        </div>

        {/* Right column: stats */}
        <div className="space-y-6">
          {/* Reputation */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-card-title font-semibold">Reputation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-display font-bold text-text">{p.reputation}</span>
                <span className="text-caption text-text-muted">/ {p.levelMax}</span>
              </div>
              <Progress value={p.reputation} max={p.levelMax} className="mt-2"/>
              <p className="mt-1 text-caption text-text-muted">Next level: {p.levelMax - p.reputation} reputation needed</p>
            </CardContent>
          </Card>

          {/* Published Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-card-title font-semibold">Published</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-body">
                <span className="text-text-muted">Concepts</span>
                <span className="font-medium text-text">{p.stats.publishedConcepts}</span>
              </div>
              <div className="flex justify-between text-body">
                <span className="text-text-muted">Articles</span>
                <span className="font-medium text-text">{p.stats.publishedArticles}</span>
              </div>
              <div className="flex justify-between text-body">
                <span className="text-text-muted">Books</span>
                <span className="font-medium text-text">{p.stats.publishedBooks}</span>
              </div>
            </CardContent>
          </Card>

          {/* Views + Streak */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-card-title font-semibold">Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-caption text-text-muted">Total Views</p>
                <p className="font-mono text-page-title font-bold text-text">{p.stats.totalViews.toLocaleString()}</p>
              </div>
              <Divider />
              <div>
                <p className="text-caption text-text-muted">Reading Streak</p>
                <p className="font-mono text-page-title font-bold text-text">{p.stats.readingStreak}d</p>
              </div>
              <Divider />
              <div>
                <p className="text-caption text-text-muted">Guides Completed</p>
                <p className="font-mono text-page-title font-bold text-text">{p.stats.guidesCompleted}</p>
              </div>
            </CardContent>
          </Card>

          {/* Expertise Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-card-title font-semibold">Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {p.expertise.map((tag) => (<Badge key={tag} variant="secondary" className="text-caption">{tag}</Badge>))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>);
}
