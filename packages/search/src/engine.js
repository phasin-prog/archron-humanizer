import { sql, eq, and, or, inArray, desc, asc } from "drizzle-orm";
import { buildSearchQuery, buildSearchCountQuery, buildFacetQuery } from "./query";
import { buildAutocompleteQuery } from "./autocomplete";
export class SearchEngine {
    db;
    constructor(db) {
        this.db = db;
    }
    async search(q) {
        const startTime = Date.now();
        const { where, orderBy, limit, offset } = buildSearchQuery(q);
        const selectColumns = {
            id: sql `o.id`,
            objectType: sql `o.object_type`,
            slug: sql `o.slug`,
            title: sql `o.title`,
            description: sql `o.description`,
            language: sql `o.language`,
            difficulty: sql `o.difficulty`,
            status: sql `o.status`,
            aliases: sql `o.aliases`,
            domains: sql `o.domains`,
            tags: sql `o.tags`,
            thumbnail: sql `o.thumbnail`,
            readingTime: sql `o.reading_time`,
            wordCount: sql `o.word_count`,
            viewCount: sql `o.view_count`,
            backlinkCount: sql `o.backlink_count`,
            rank: sql `0`,
            headline: sql `o.description`,
            publishedAt: sql `o.published_at`,
            createdAt: sql `o.created_at`,
        };
        const results = await this.db.execute(sql `
      SELECT
        o.id,
        o.object_type AS "objectType",
        o.slug,
        o.title,
        o.description,
        o.language::text AS "language",
        o.difficulty::text AS "difficulty",
        o.status::text AS "status",
        o.aliases,
        o.domains,
        o.tags,
        o.thumbnail,
        o.reading_time AS "readingTime",
        o.word_count AS "wordCount",
        o.view_count AS "viewCount",
        o.backlink_count AS "backlinkCount",
        ${q.term ? sql `ts_rank(o.search_vector, to_tsquery('english', ${q.term.trim().replace(/\s+/g, " & ") + ":*"}))::float` : sql `0::float`} AS rank,
        ts_headline('english', o.description, to_tsquery('english', ${(q.term || "").trim().replace(/\s+/g, " & ") + ":*"})) AS headline,
        o.published_at AS "publishedAt",
        o.created_at AS "createdAt"
      FROM objects o
      WHERE ${sql.join(where, sql ` AND `)}
      ORDER BY ${sql.join(orderBy, sql `, `)}
      LIMIT ${limit}
      OFFSET ${offset}
    `);
        const countWhere = buildSearchCountQuery(q);
        const countResult = await this.db.execute(sql `
      SELECT COUNT(*)::int as total
      FROM objects o
      WHERE ${sql.join(countWhere.where, sql ` AND `)}
    `);
        const total = countResult[0]?.total ?? 0;
        const facets = await this.fetchFacets(q);
        return {
            results,
            total,
            page: Math.floor(offset / limit) + 1,
            pageSize: limit,
            facets,
            took: Date.now() - startTime,
        };
    }
    async fetchFacets(q) {
        const baseConditions = [sql `o.status = 'published'`, sql `o.deleted_at IS NULL`];
        if (q.term && q.term.trim().length > 0) {
            const normalized = q.term.trim().replace(/\s+/g, " & ");
            baseConditions.push(sql `o.search_vector @@ to_tsquery('english', ${normalized + ":*"})`);
        }
        try {
            const facetRows = await this.db.execute(buildFacetQuery(baseConditions));
            const rows = facetRows;
            const objectTypes = [];
            const domains = [];
            const tags = [];
            const difficulties = [];
            const languages = [];
            for (const row of rows) {
                const entry = { value: row.value, count: row.count };
                switch (row.facet_type) {
                    case "objectType":
                        objectTypes.push(entry);
                        break;
                    case "domain":
                        domains.push(entry);
                        break;
                    case "tag":
                        tags.push(entry);
                        break;
                    case "difficulty":
                        difficulties.push(entry);
                        break;
                    case "language":
                        languages.push(entry);
                        break;
                }
            }
            return { objectTypes, domains, tags, difficulties, languages };
        }
        catch {
            return { objectTypes: [], domains: [], tags: [], difficulties: [], languages: [] };
        }
    }
    async autocomplete(term, limit = 8) {
        if (!term || term.trim().length < 2)
            return [];
        const rows = await this.db.execute(buildAutocompleteQuery(term, limit));
        return rows
            .map(row => ({
            value: row.value,
            label: row.label,
            type: row.type,
            slug: row.slug,
            description: row.description,
        }));
    }
    async recordView(objectId) {
        await this.db.execute(sql `
      UPDATE objects SET view_count = view_count + 1 WHERE id = ${objectId}
    `);
    }
    async suggestRelated(objectId, limit = 5) {
        const rows = await this.db.execute(sql `
      SELECT
        o.id,
        o.object_type AS "objectType",
        o.slug,
        o.title,
        o.description,
        o.language::text AS "language",
        o.difficulty::text AS "difficulty",
        o.status::text AS "status",
        o.aliases,
        o.domains,
        o.tags,
        o.thumbnail,
        o.reading_time AS "readingTime",
        o.word_count AS "wordCount",
        o.view_count AS "viewCount",
        o.backlink_count AS "backlinkCount",
        0::float AS rank,
        o.description AS headline,
        o.published_at AS "publishedAt",
        o.created_at AS "createdAt"
      FROM objects o
      JOIN relationships r ON (r.target_id = o.id AND r.source_id = ${objectId})
         OR (r.source_id = o.id AND r.target_id = ${objectId})
      WHERE o.status = 'published' AND o.deleted_at IS NULL
      ORDER BY o.backlink_count DESC
      LIMIT ${limit}
    `);
        return rows;
    }
}
