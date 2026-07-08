import { NextResponse } from "next/server"
import { getAuth } from "@archron/auth"
import { RoleHierarchy } from "@archron/shared"
import { db, findUserById, updateRole, users } from "@archron/database"
import { eq } from "drizzle-orm"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId, role: userRole } = await getAuth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (RoleHierarchy[userRole] < RoleHierarchy.editor) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const user = await findUserById(db, id)
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
  return NextResponse.json(user)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId, role: userRole } = await getAuth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (RoleHierarchy[userRole] < RoleHierarchy.administrator) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const body = (await request.json()) as { role?: string }
  if (!body.role) return NextResponse.json({ error: "role is required" }, { status: 400 })

  await updateRole(db, id, body.role as typeof users.$inferSelect["role"])
  return NextResponse.json({ updated: true })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId, role: userRole } = await getAuth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (RoleHierarchy[userRole] < RoleHierarchy.administrator) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  await db.update(users).set({ deletedAt: new Date() }).where(eq(users.id, id))
  return NextResponse.json({ deleted: true })
}
