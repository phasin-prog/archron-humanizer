import { sql, SQL } from "drizzle-orm"
import type { SearchQuery } from "./types"

export function buildSearchQuery(q: SearchQuery): { where: SQL[]; orderBy: SQL[]; limit: number; offset: number } {
  const where: SQL[] = [sql`o.status = 'published'`, sql`o.deleted_at IS NULL`]
  const orderBy: SQL[] = []

  if (q.term && q.term.trim().length > 0) {
    const normalized = q.term.trim().replace(/\s+/g, " & ")
    where.push(sql`o.search_vector @@ to_tsquery('english', ${normalized + ":*"})`)
    orderBy.push(sql`ts_rank(o.search_vector, to_tsquery('english', ${normalized + ":*"})) DESC`)
  }

  if (q.objectTypes && q.objectTypes.length > 0) {
    where.push(sql`o.object_type = ANY(${q.objectTypes})`)
  }

  if (q.domains && q.domains.length > 0) {
    where.push(sql`o.domains && ${q.domains}`)
  }

  if (q.tags && q.tags.length > 0) {
    where.push(sql`o.tags && ${q.tags}`)
  }

  if (q.language) {
    where.push(sql`o.language = ${q.language}::language`)
  }

  if (q.difficulty) {
    where.push(sql`o.difficulty = ${q.difficulty}::difficulty`)
  }

  if (q.status && q.status !== "published") {
    where.push(sql`o.status = ${q.status}::content_state`)
  }

  switch (q.sort) {
    case "recent":
      orderBy.push(sql`o.published_at DESC NULLS LAST`)
      break
    case "views":
      orderBy.push(sql`o.view_count DESC`)
      break
    case "backlinks":
      orderBy.push(sql`o.backlink_count DESC`)
      break
    case "relevance":
    default:
      if (q.term && q.term.trim().length > 0) {
        orderBy.push(sql`ts_rank(o.search_vector, to_tsquery('english', ${q.term.trim().replace(/\s+/g, " & ") + ":*"})) DESC`)
      }
      orderBy.push(sql`o.published_at DESC NULLS LAST`)
      break
  }

  const limit = Math.min(q.limit ?? 20, 100)
  const offset = q.offset ?? 0

  return { where, orderBy, limit, offset }
}

export function buildSearchCountQuery(q: SearchQuery): { where: SQL[] } {
  const where: SQL[] = [sql`o.status = 'published'`, sql`o.deleted_at IS NULL`]

  if (q.term && q.term.trim().length > 0) {
    const normalized = q.term.trim().replace(/\s+/g, " & ")
    where.push(sql`o.search_vector @@ to_tsquery('english', ${normalized + ":*"})`)
  }

  if (q.objectTypes && q.objectTypes.length > 0) {
    where.push(sql`o.object_type = ANY(${q.objectTypes})`)
  }

  if (q.domains && q.domains.length > 0) {
    where.push(sql`o.domains && ${q.domains}`)
  }

  if (q.tags && q.tags.length > 0) {
    where.push(sql`o.tags && ${q.tags}`)
  }

  if (q.language) {
    where.push(sql`o.language = ${q.language}::language`)
  }

  if (q.difficulty) {
    where.push(sql`o.difficulty = ${q.difficulty}::difficulty`)
  }

  return { where }
}

export function buildFacetQuery(baseConditions: SQL[]): SQL {
  return sql`
    SELECT
      'objectType' as facet_type,
      o.object_type::text as value,
      COUNT(*)::int as count
    FROM objects o
    WHERE ${sql.join(baseConditions, sql` AND `)}
    GROUP BY o.object_type
    UNION ALL
    SELECT
      'domain' as facet_type,
      d.value,
      COUNT(*)::int as count
    FROM objects o, unnest(o.domains) as d(value)
    WHERE ${sql.join(baseConditions, sql` AND `)}
    GROUP BY d.value
    UNION ALL
    SELECT
      'tag' as facet_type,
      t.value,
      COUNT(*)::int as count
    FROM objects o, unnest(o.tags) as t(value)
    WHERE ${sql.join(baseConditions, sql` AND `)}
    GROUP BY t.value
    UNION ALL
    SELECT
      'difficulty' as facet_type,
      o.difficulty::text as value,
      COUNT(*)::int as count
    FROM objects o
    WHERE ${sql.join(baseConditions, sql` AND `)}
    GROUP BY o.difficulty
    UNION ALL
    SELECT
      'language' as facet_type,
      o.language::text as value,
      COUNT(*)::int as count
    FROM objects o
    WHERE ${sql.join(baseConditions, sql` AND `)}
    GROUP BY o.language
  `
}
