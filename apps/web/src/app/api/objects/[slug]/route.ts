// ============================================
// API: Get object by slug
// GET /api/objects/[slug]
// ============================================

import { NextRequest } from "next/server"
import { withServices, apiSuccess, apiError } from "@archron/shared"

export const GET = withServices(async (req: NextRequest, ctx) => {
  const url = new URL(req.url)
  const pathParts = url.pathname.split("/")
  const slug = pathParts[pathParts.length - 1]

  if (!slug) {
    return apiError("Slug is required", 400)
  }

  const object = await ctx.getObject(slug)

  if (!object) {
    return apiError("Object not found", 404)
  }

  // Increment view count
  await ctx.db.update(ctx.db.objects)
    .set({ viewCount: ctx.db.sql`${ctx.db.objects.viewCount} + 1` })
    .where(ctx.db.eq(ctx.db.objects.id, object.id))

  return apiSuccess(object)
})
