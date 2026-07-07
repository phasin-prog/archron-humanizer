import { NextResponse } from "next/server"
import { getAuth } from "@archron/auth"

type NotificationType =
  | "review_requested"
  | "content_published"
  | "achievement_earned"
  | "comment_received"
  | "mention"
  | "level_up"
  | "review_decision"

interface Notification {
  id: string
  type: NotificationType
  title: string
  body: string
  timestamp: string
  read: boolean
}

const PLACEHOLDER_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "review_requested",
    title: "New article awaits your review",
    body: "\"The Structure of the Unconscious\" by dr.somsak is ready for review. Your expertise in analytical psychology is needed.",
    timestamp: "2026-07-07T10:30:00Z",
    read: false,
  },
  {
    id: "2",
    type: "achievement_earned",
    title: "Knowledge Builder achieved",
    body: "You published your 10th article. +30 reputation points awarded.",
    timestamp: "2026-07-07T09:15:00Z",
    read: false,
  },
  {
    id: "3",
    type: "comment_received",
    title: "New comment on your article",
    body: "Dr. Anong commented on \"Archetypes and the Collective\": \"Excellent synthesis of Jung's later work on the anima.\"",
    timestamp: "2026-07-06T16:45:00Z",
    read: false,
  },
  {
    id: "4",
    type: "content_published",
    title: "Your concept is now published",
    body: "\"Individuation\" has passed review and is now live on the platform.",
    timestamp: "2026-07-06T14:20:00Z",
    read: true,
  },
  {
    id: "5",
    type: "mention",
    title: "You were mentioned in an article",
    body: "Krittika mentioned your work in \"Modern Applications of Jungian Theory\".",
    timestamp: "2026-07-06T11:10:00Z",
    read: true,
  },
  {
    id: "6",
    type: "level_up",
    title: "Level 5 reached",
    body: "Your reputation now exceeds 500 points. New privileges unlocked: Suggest featured content.",
    timestamp: "2026-07-05T08:50:00Z",
    read: true,
  },
  {
    id: "7",
    type: "review_decision",
    title: "Review decision: Approved",
    body: "Your article \"The Shadow in Thai Literature\" has been approved and published.",
    timestamp: "2026-07-05T08:00:00Z",
    read: true,
  },
  {
    id: "8",
    type: "content_published",
    title: "Your book reference is live",
    body: "\"Man and His Symbols\" by Carl Jung has been catalogued and published.",
    timestamp: "2026-07-04T15:30:00Z",
    read: true,
  },
]

export async function GET() {
  const { userId } = await getAuth()
  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const unreadCount = PLACEHOLDER_NOTIFICATIONS.filter((n) => !n.read).length

  return NextResponse.json({
    notifications: PLACEHOLDER_NOTIFICATIONS,
    unreadCount,
  })
}

export async function PUT(request: Request) {
  const { userId } = await getAuth()
  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  let body: { id?: string; markAllRead?: boolean } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  if (body.markAllRead) {
    return NextResponse.json({ success: true, action: "markAllRead" })
  }

  if (body.id) {
    return NextResponse.json({ success: true, action: "markRead", id: body.id })
  }

  return NextResponse.json({ error: "Missing id or markAllRead" }, { status: 400 })
}
