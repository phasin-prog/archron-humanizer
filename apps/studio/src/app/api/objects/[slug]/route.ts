import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@archron/database"
import { findObjectBySlug, updateObject } from "@archron/database"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { slug } = await params
  const obj = await findObjectBySlug(db, slug)
  if (!obj) return NextResponse.json({ error: "Not found" }, { status: 404 })
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

  const body = await request.json()
  const result = await updateObject(db, obj.id, body)
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(result)
}
