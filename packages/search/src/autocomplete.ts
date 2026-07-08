import { sql, SQL } from "drizzle-orm"

export function buildAutocompleteQuery(term: string, limit: number = 8): SQL {
  return sql`
    (
      SELECT DISTINCT ON (o.title)
        o.title as label,
        '/' || o.slug as value,
        o.object_type::text as type,
        o.slug,
        o.description,
        LENGTH(o.title) - LENGTH(${term}) as score
      FROM objects o
      WHERE
        o.status = 'published'
        AND o.deleted_at IS NULL
        AND (o.title ILIKE ${"%" + term + "%"} OR o.slug ILIKE ${"%" + term + "%"})
      LIMIT ${limit}
    )
    UNION ALL
    (
      SELECT DISTINCT ON (t.name)
        '#' || t.name as label,
        '/tags/' || t.slug as value,
        'tag' as type,
        t.slug,
        t.description,
        t.usage_count as score
      FROM tags t
      WHERE t.name ILIKE ${"%" + term + "%"}
      LIMIT ${limit}
    )
    UNION ALL
    (
      SELECT DISTINCT ON (a.name)
        a.name as label,
        '/' || o2.slug as value,
        'alias' as type,
        o2.slug,
        o2.description,
        1 as score
      FROM aliases a
      JOIN objects o2 ON o2.id = a.object_id
      WHERE
        a.name ILIKE ${"%" + term + "%"}
        AND o2.status = 'published'
        AND o2.deleted_at IS NULL
      LIMIT ${limit}
    )
    ORDER BY score ASC
    LIMIT ${limit}
  `
}
