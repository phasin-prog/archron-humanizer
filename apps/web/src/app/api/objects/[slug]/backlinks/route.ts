// ============================================
// API: Get object backlinks
// GET /api/objects/[slug]/backlinks
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

  const backlinks = await ctx.getBacklinks(object.id)

  return apiSuccess({
    object: {
      id: object.id,
      slug: object.slug,
      title: object.title,
    },
    backlinks: backlinks.slice(0, limit),
    total: backlinks.length,
  })
})
