import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@archron/database"
import { findObjectBySlug, updateObject } from "@archron/database"
import type { CreateObjectData } from "@archron/database"

const EDITABLE_FIELDS = [
  "title",
  "description",
  "aliases",
  "domains",
  "tags",
  "thumbnail",
  "readingTime",
  "wordCount",
  "difficulty",
  "language",
] as const

function sanitizeUpdateBody(body: Record<string, unknown>): Partial<CreateObjectData> {
  const sanitized: Record<string, unknown> = {}
  for (const key of EDITABLE_FIELDS) {
    if (key in body) {
      sanitized[key] = body[key]
    }
  }
  return sanitized as Partial<CreateObjectData>
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { slug } = await params
  const obj = await findObjectBySlug(db, slug)
  if (!obj) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (obj.authorId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json(obj)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { slug } = await params
  const obj = await findObjectBySlug(db, slug)
  if (!obj) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (obj.authorId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const sanitized = sanitizeUpdateBody(body)
  const result = await updateObject(db, obj.id, sanitized)
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(result)
}
