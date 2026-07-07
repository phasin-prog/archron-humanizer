// ============================================
// API: Get object recommendations
// GET /api/objects/[slug]/recommendations?limit=5
// ============================================

import { NextRequest } from "next/server"
import { withServices, apiSuccess, apiError, getPagination } from "@archron/shared"

export const GET = withServices(async (req: NextRequest, ctx) => {
  const url = new URL(req.url)
  const pathParts = url.pathname.split("/")
  const slug = pathParts[pathParts.indexOf("objects") + 1]
  const { limit } = getPagination(req)

  if (!slug) {
    return apiError("Slug is required", 400)
  }

  const object = await ctx.getObject(slug)

  if (!object) {
    return apiError("Object not found", 404)
  }

  const recommendations = await ctx.getRecommendations(object.id, limit)

  return apiSuccess({
    object: {
      id: object.id,
      slug: object.slug,
      title: object.title,
    },
    recommendations,
  })
})
