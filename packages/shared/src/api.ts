// ============================================
// API SERVER UTILITIES — for Next.js API routes
// ============================================

import type { ServiceContext } from "./integration"

// Use dynamic imports to avoid compile-time dependency on Next.js
type NextRequest = any
type NextResponse = any

/**
 * Wrap API handler with services injection
 */
export function withServices(
  handler: (req: NextRequest, ctx: ServiceContext) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const { getServiceContext } = await import("./integration")
      const ctx = await getServiceContext()
      return await handler(req, ctx)
    } catch (error) {
      console.error("API Error:", error)
      const { NextResponse } = await import("next/server")
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      )
    }
  }
}

/**
 * Standard API error response
 */
export async function apiError(message: string, status: number = 400) {
  const { NextResponse } = await import("next/server")
  return NextResponse.json({ error: message }, { status })
}

/**
 * Standard API success response
 */
export async function apiSuccess<T>(data: T, status: number = 200) {
  const { NextResponse } = await import("next/server")
  return NextResponse.json(data, { status })
}

/**
 * Parse pagination params from request
 */
export function getPagination(req: NextRequest) {
  const url = new URL(req.url)
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 100)
  const offset = parseInt(url.searchParams.get("offset") || "0")
  return { limit, offset }
}

/**
 * Parse search params from request
 */
export function getSearchParams(req: NextRequest) {
  const url = new URL(req.url)
  return {
    term: url.searchParams.get("q") || url.searchParams.get("term") || "",
    types: url.searchParams.get("types")?.split(",").filter(Boolean) || [],
    tags: url.searchParams.get("tags")?.split(",").filter(Boolean) || [],
    ...getPagination(req),
  }
}
