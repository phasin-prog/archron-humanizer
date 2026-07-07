import { eq, asc, desc, and, isNull, inArray, sql } from "drizzle-orm";
import { objects } from "./schema/core";
import { contentStateEnum, languageEnum, difficultyEnum } from "./schema/enums";
import * as knowledge from "./schema/knowledge";
const DOMAIN_MAP = {
    concept: knowledge.concepts,
    thinker: knowledge.thinkers,
    book: knowledge.books,
    article: knowledge.articles,
    theory: knowledge.theories,
    school: knowledge.schools,
    discipline: knowledge.disciplines,
    symbol: knowledge.symbols,
    quote: knowledge.quotes,
    timeline_event: knowledge.timelineEvents,
};
function getDomainTable(objectType) {
    return DOMAIN_MAP[objectType] ?? null;
}
function mapObjectRow(row) {
    const result = {
        id: row.id,
        objectType: row.objectType,
        slug: row.slug,
        title: row.title,
        status: row.status,
        visibility: row.visibility,
        language: row.language,
        difficulty: row.difficulty,
        description: row.description,
        aliases: (row.aliases ?? []),
        domains: (row.domains ?? []),
        tags: (row.tags ?? []),
        thumbnail: row.thumbnail,
        readingTime: row.readingTime,
        wordCount: row.wordCount,
        viewCount: row.viewCount,
        backlinkCount: row.backlinkCount,
        version: row.version,
        authorId: row.authorId,
        editorId: row.editorId,
        publishedAt: row.publishedAt?.toISOString?.() ?? row.publishedAt,
        createdAt: row.createdAt?.toISOString?.() ?? row.createdAt,
        updatedAt: row.updatedAt?.toISOString?.() ?? row.updatedAt,
    };
    return result;
}
export async function findObjectById(db, id) {
    const rows = await db.select().from(objects).where(eq(objects.id, id)).limit(1);
    const obj = rows[0];
    if (!obj)
        return null;
    return mapObjectRow(obj);
}
export async function findObjectBySlug(db, slug) {
    const rows = await db
        .select()
        .from(objects)
        .where(and(eq(objects.slug, slug), isNull(objects.deletedAt)))
        .limit(1);
    const obj = rows[0];
    if (!obj)
        return null;
    return mapObjectRow(obj);
}
export async function listObjects(db, query = {}) {
    const conditions = [isNull(objects.deletedAt)];
    if (query.types?.length) {
        conditions.push(inArray(objects.objectType, query.types));
    }
    if (query.status?.length) {
        conditions.push(sql `${objects.status} = ANY(${query.status})`);
    }
    if (query.language) {
        conditions.push(sql `${objects.language} = ${query.language}`);
    }
    if (query.difficulty) {
        conditions.push(sql `${objects.difficulty} = ${query.difficulty}`);
    }
    if (query.domains?.length) {
        conditions.push(sql `${objects.domains} && ${query.domains}::varchar[]`);
    }
    if (query.tags?.length) {
        conditions.push(sql `${objects.tags} && ${query.tags}::varchar[]`);
    }
    let orderBy = desc(objects.createdAt);
    if (query.sort === "title")
        orderBy = asc(objects.title);
    else if (query.sort === "backlinks")
        orderBy = desc(objects.backlinkCount);
    else if (query.sort === "views")
        orderBy = desc(objects.viewCount);
    const rows = await db
        .select()
        .from(objects)
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(query.limit ?? 50)
        .offset(query.offset ?? 0);
    return rows.map(mapObjectRow);
}
export async function createObject(db, data, domainData) {
    const result = await db.transaction(async (tx) => {
        const rows = await tx
            .insert(objects)
            .values({
            objectType: data.objectType,
            slug: data.slug,
            title: data.title,
            description: data.description,
            authorId: data.authorId,
            status: (data.status ?? "draft"),
            visibility: data.visibility ?? "public",
            language: (data.language ?? "th"),
            difficulty: (data.difficulty ?? "intermediate"),
            aliases: data.aliases ?? [],
            domains: data.domains ?? [],
            tags: data.tags ?? [],
            thumbnail: data.thumbnail,
            readingTime: data.readingTime,
            wordCount: data.wordCount,
        })
            .returning();
        const obj = rows[0];
        if (domainData) {
            const domainTable = getDomainTable(data.objectType);
            const domainValues = domainData[data.objectType];
            if (domainTable && domainValues) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await tx.insert(domainTable).values({
                    ...domainValues,
                    objectId: obj.id,
                });
            }
        }
        return obj;
    });
    return mapObjectRow(result);
}
export async function updateObject(db, id, data) {
    const setData = {};
    if (data.title !== undefined)
        setData.title = data.title;
    if (data.description !== undefined)
        setData.description = data.description;
    if (data.status !== undefined)
        setData.status = data.status;
    if (data.visibility !== undefined)
        setData.visibility = data.visibility;
    if (data.language !== undefined)
        setData.language = data.language;
    if (data.difficulty !== undefined)
        setData.difficulty = data.difficulty;
    if (data.aliases !== undefined)
        setData.aliases = data.aliases;
    if (data.domains !== undefined)
        setData.domains = data.domains;
    if (data.tags !== undefined)
        setData.tags = data.tags;
    if (data.thumbnail !== undefined)
        setData.thumbnail = data.thumbnail;
    if (data.readingTime !== undefined)
        setData.readingTime = data.readingTime;
    if (data.wordCount !== undefined)
        setData.wordCount = data.wordCount;
    const rows = await db.update(objects).set(setData).where(eq(objects.id, id)).returning();
    const obj = rows[0];
    if (!obj)
        return null;
    return mapObjectRow(obj);
}
export async function softDeleteObject(db, id) {
    await db
        .update(objects)
        .set({ deletedAt: new Date() })
        .where(eq(objects.id, id));
}
export async function publishObject(db, id) {
    const rows = await db
        .update(objects)
        .set({
        status: "published",
        publishedAt: new Date(),
    })
        .where(eq(objects.id, id))
        .returning();
    const obj = rows[0];
    if (!obj)
        return null;
    return mapObjectRow(obj);
}
export async function incrementViewCount(db, id) {
    await db
        .update(objects)
        .set({ viewCount: sql `${objects.viewCount} + 1` })
        .where(eq(objects.id, id));
}
