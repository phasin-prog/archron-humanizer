import { NextResponse } from "next/server"
import { getAuth } from "@archron/auth"
import { db } from "@archron/database"
import { findObjectById, updateObject, softDeleteObject } from "@archron/database"
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
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await getAuth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const obj = await findObjectById(db, id)
  if (!obj) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (obj.authorId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json(obj)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await getAuth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const obj = await findObjectById(db, id)
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
  const result = await updateObject(db, id, sanitized)
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(result)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await getAuth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const obj = await findObjectById(db, id)
  if (!obj) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (obj.authorId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await softDeleteObject(db, id)
  return NextResponse.json({ deleted: true })
}
