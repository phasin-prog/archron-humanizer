import { NextRequest, NextResponse } from "next/server"
import { getAuth } from "@archron/auth"

const STUDIO_DATA = {
  stats: {
    totalObjects: 32,
    publishedCount: 20,
    draftCount: 6,
    reviewCount: 4,
    totalViews: 12400,
    reputation: 840,
    thisMonthViews: 1240,
    thisMonthContributions: 3,
  },
  drafts: [
    { id: "draft-001", title: "The Ego-Self Axis", status: "draft", lastSavedAt: "2026-07-07T10:30:00Z", objectType: "article" },
    { id: "draft-002", title: "Animus Integration", status: "draft", lastSavedAt: "2026-07-06T15:00:00Z", objectType: "concept" },
    { id: "draft-003", title: "The Tree of Life", status: "draft", lastSavedAt: "2026-07-05T09:00:00Z", objectType: "symbol" },
    { id: "draft-004", title: "Jung and Buddhism", status: "draft", lastSavedAt: "2026-07-03T14:20:00Z", objectType: "article" },
    { id: "draft-005", title: "The Hero's Journey", status: "draft", lastSavedAt: "2026-07-01T11:00:00Z", objectType: "concept" },
    { id: "draft-006", title: "Dream Analysis Techniques", status: "draft", lastSavedAt: "2026-06-28T16:45:00Z", objectType: "article" },
  ],
  recentActivity: [
    { action: "Saved draft", target: "The Ego-Self Axis", date: "2026-07-07T10:30:00Z" },
    { action: "Published", target: "Understanding the Shadow", date: "2026-07-06T08:15:00Z" },
    { action: "Submitted for review", target: "Animus Integration", date: "2026-07-05T12:00:00Z" },
    { action: "Added reference", target: "Man and His Symbols", date: "2026-07-04T09:30:00Z" },
    { action: "Completed review", target: "The Persona in Daily Life", date: "2026-07-04T07:00:00Z" },
    { action: "Created collection", target: "My Jung Reading List", date: "2026-07-03T14:00:00Z" },
    { action: "Earned badge", target: "50 Reviews", date: "2026-07-02T10:00:00Z" },
    { action: "Published", target: "Archetypes in Modern Culture", date: "2026-07-01T09:00:00Z" },
    { action: "Saved draft", target: "Dream Analysis Techniques", date: "2026-06-30T11:30:00Z" },
    { action: "Added concept", target: "The Hero's Journey", date: "2026-06-29T15:00:00Z" },
  ],
  publishingQueue: [
    { title: "The Ego-Self Axis", status: "draft", progress: 85, estimatedPublish: "2026-07-14T00:00:00Z" },
    { title: "Jung and Buddhism", status: "draft", progress: 60, estimatedPublish: "2026-07-21T00:00:00Z" },
    { title: "Animus Integration", status: "review", progress: 100, estimatedPublish: "2026-07-10T00:00:00Z" },
  ],
  dailyStats: [
    { date: "2026-07-07", views: 142, contributions: 1 },
    { date: "2026-07-06", views: 168, contributions: 2 },
    { date: "2026-07-05", views: 195, contributions: 1 },
    { date: "2026-07-04", views: 220, contributions: 2 },
    { date: "2026-07-03", views: 180, contributions: 1 },
    { date: "2026-07-02", views: 155, contributions: 1 },
    { date: "2026-07-01", views: 210, contributions: 2 },
  ],
}

export async function GET(_request: NextRequest) {
  const { userId } = await getAuth()
  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  return NextResponse.json(STUDIO_DATA)
}
