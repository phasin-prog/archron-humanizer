// ============================================
// API: Get object relations
// GET /api/objects/[slug]/relations
// ============================================

import { NextRequest } from "next/server"
import { withServices, apiSuccess, apiError } from "@archron/shared"

export const GET = withServices(async (req: NextRequest, ctx) => {
  const url = new URL(req.url)
  const pathParts = url.pathname.split("/")
  const slug = pathParts[pathParts.indexOf("objects") + 1]

  if (!slug) {
    return apiError("Slug is required", 400)
  }

  const object = await ctx.getObject(slug)

  if (!object) {
    return apiError("Object not found", 404)
  }

  const relations = await ctx.getRelations(object.id)

  return apiSuccess(relations)
})
