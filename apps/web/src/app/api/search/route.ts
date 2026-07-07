// ============================================
// API: Search objects
// GET /api/search?q=term&types=concept,thinker&limit=20
// ============================================

import { NextRequest } from "next/server"
import { withServices, apiSuccess, apiError, getSearchParams } from "@archron/shared"

export const GET = withServices(async (req: NextRequest, ctx) => {
  const { term, types, tags, limit, offset } = getSearchParams(req)

  if (!term || term.length < 2) {
    return apiError("Search term must be at least 2 characters", 400)
  }

  const results = await ctx.search.search({
    term,
    types: types as any,
    tags,
    limit,
    offset,
  })

  return apiSuccess(results)
})
