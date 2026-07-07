import { NextResponse } from "next/server"
import { getAuth } from "@archron/auth"

const PLACEHOLDER_SETTINGS = {
  id: "profile-001",
  userId: "user-001",
  displayName: "Somchai Rattanapong",
  bio: "Exploring the intersections of analytical psychology and Eastern philosophy.",
  avatarUrl: null,
  expertise: ["Psychology", "Philosophy", "Religion"],
  isPublic: true,
  emailPrefs: {
    reviewRequests: true,
    contentPublished: false,
    mentions: true,
    achievements: false,
    newsletter: false,
  },
  createdAt: "2024-01-15T00:00:00Z",
  updatedAt: "2026-07-01T00:00:00Z",
}

export async function GET() {
  const { userId } = await getAuth()

  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  return NextResponse.json(PLACEHOLDER_SETTINGS)
}

export async function PUT(request: Request) {
  const { userId } = await getAuth()

  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  let body: Record<string, unknown>

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { displayName, bio, expertise, isPublic, emailPrefs } = body as {
    displayName?: string
    bio?: string
    expertise?: string[]
    isPublic?: boolean
    emailPrefs?: Record<string, boolean>
  }

  if (bio !== undefined && typeof bio === "string" && bio.length > 280) {
    return NextResponse.json({ error: "Bio must be 280 characters or less" }, { status: 400 })
  }

  const updated = {
    ...PLACEHOLDER_SETTINGS,
    ...(displayName !== undefined && { displayName }),
    ...(bio !== undefined && { bio }),
    ...(expertise !== undefined && { expertise }),
    ...(isPublic !== undefined && { isPublic }),
    ...(emailPrefs !== undefined && { emailPrefs }),
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json(updated)
}
