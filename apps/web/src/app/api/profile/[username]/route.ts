import { NextResponse } from "next/server"

const PLACEHOLDER_PROFILES: Record<string, Record<string, unknown>> = {
  somchai: {
    username: "somchai",
    displayName: "Somchai Rattanapong",
    role: "Writer",
    bio: "Exploring the intersections of analytical psychology and Eastern philosophy. Focused on Jungian individuation and its parallels with Buddhist practice.",
    avatarUrl: null,
    level: { name: "Scholar", requiredReputation: 500, badgeColor: "#C4A040" },
    reputation: 840,
    levelMax: 1000,
    memberSince: "2024-01-15T00:00:00Z",
    expertise: ["Psychology", "Philosophy", "Religion"],
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
      { action: "Published", target: "The Shadow", date: "2026-07-05T00:00:00Z" },
      { action: "Reviewed", target: "Persona", date: "2026-07-04T00:00:00Z" },
      { action: "Created", target: "Jung Collection", date: "2026-07-02T00:00:00Z" },
      { action: "Completed Guide", target: "Introduction to Analytical Psychology", date: "2026-06-30T00:00:00Z" },
    ],
  },
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params

  const profile = PLACEHOLDER_PROFILES[username]

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 })
  }

  return NextResponse.json(profile)
}
