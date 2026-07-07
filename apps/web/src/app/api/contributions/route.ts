import { NextRequest, NextResponse } from "next/server"
import { getAuth } from "@archron/auth"

const PLACEHOLDER_CONTRIBUTIONS = {
  article: [
    { title: "Understanding the Shadow", slug: "understanding-the-shadow", status: "published", date: "2026-06-15T00:00:00Z" },
    { title: "The Role of Dreams in Individuation", slug: "the-role-of-dreams", status: "published", date: "2026-05-20T00:00:00Z" },
    { title: "Archetypes in Modern Culture", slug: "archetypes-modern-culture", status: "published", date: "2026-04-10T00:00:00Z" },
    { title: "Active Imagination: A Practical Guide", slug: "active-imagination", status: "published", date: "2026-03-05T00:00:00Z" },
    { title: "The Ego-Self Axis", slug: "ego-self-axis", status: "draft", date: "2026-07-01T00:00:00Z" },
  ],
  concept: [
    { title: "Shadow", slug: "shadow", status: "published", date: "2026-06-20T00:00:00Z" },
    { title: "Shadow Work", slug: "shadow-work", status: "published", date: "2026-06-18T00:00:00Z" },
    { title: "Individuation", slug: "individuation", status: "published", date: "2026-05-15T00:00:00Z" },
    { title: "Persona", slug: "persona", status: "published", date: "2026-04-22T00:00:00Z" },
    { title: "Anima", slug: "anima", status: "published", date: "2026-03-30T00:00:00Z" },
    { title: "Animus", slug: "animus", status: "draft", date: "2026-07-02T00:00:00Z" },
  ],
  thinker: [
    { title: "Carl Jung", slug: "carl-jung", status: "published", date: "2026-05-01T00:00:00Z" },
    { title: "Marie-Louise von Franz", slug: "marie-louise-von-franz", status: "published", date: "2026-04-15T00:00:00Z" },
    { title: "James Hillman", slug: "james-hillman", status: "published", date: "2026-03-10T00:00:00Z" },
  ],
  book: [
    { title: "Man and His Symbols", slug: "man-and-his-symbols", status: "published", date: "2026-02-20T00:00:00Z" },
    { title: "The Red Book", slug: "the-red-book", status: "published", date: "2026-02-10T00:00:00Z" },
    { title: "Psychological Types", slug: "psychological-types", status: "published", date: "2026-01-15T00:00:00Z" },
  ],
  review: [
    { title: "The Persona in Daily Life", slug: "persona-daily-life", status: "completed", date: "2026-07-04T00:00:00Z" },
    { title: "Freud and Jung: A Reconsideration", slug: "freud-jung-reconsideration", status: "completed", date: "2026-07-03T00:00:00Z" },
  ],
  reference: [
    { title: "Jung, C.G. (1964). Man and His Symbols", slug: "ref-man-and-his-symbols", status: "verified", date: "2026-06-01T00:00:00Z" },
    { title: "von Franz, M.L. (1980). Projection and Re-Collection", slug: "ref-projection", status: "verified", date: "2026-05-10T00:00:00Z" },
  ],
  symbol: [
    { title: "The Serpent", slug: "the-serpent", status: "published", date: "2026-04-01T00:00:00Z" },
    { title: "The Tree of Life", slug: "tree-of-life", status: "draft", date: "2026-07-05T00:00:00Z" },
  ],
  collection: [
    { title: "My Jung Reading List", slug: "my-jung-reading-list", status: "public", date: "2026-06-30T00:00:00Z" },
    { title: "Dreams & Symbols", slug: "dreams-and-symbols", status: "public", date: "2026-05-25T00:00:00Z" },
  ],
}

export async function GET(request: NextRequest) {
  const { userId } = await getAuth()
  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const { searchParams } = request.nextUrl
  const type = searchParams.get("type")
  const limit = Math.min(Number(searchParams.get("limit")) || 20, 100)
  const offset = Number(searchParams.get("offset")) || 0

  if (type && type in PLACEHOLDER_CONTRIBUTIONS) {
    const items = PLACEHOLDER_CONTRIBUTIONS[type as keyof typeof PLACEHOLDER_CONTRIBUTIONS].slice(offset, offset + limit)
    return NextResponse.json({ [type]: items, total: items.length, limit, offset })
  }

  const result: Record<string, unknown[]> = {}
  for (const [key, items] of Object.entries(PLACEHOLDER_CONTRIBUTIONS)) {
    result[key] = items.slice(offset, offset + limit)
  }

  return NextResponse.json({ contributions: result, limit, offset })
}
