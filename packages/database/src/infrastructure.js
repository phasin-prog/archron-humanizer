import { eq, and, desc } from "drizzle-orm";
import { revisionTypeEnum } from "./schema/enums";
import { slugs, slugRedirects, aliases, revisions, references, objectReferences, } from "./schema/infrastructure";
// --- Slugs ---
export async function registerSlug(db, data) {
    const [slug] = await db
        .insert(slugs)
        .values({
        objectId: data.objectId,
        slug: data.slug,
        locale: data.locale ?? "th",
    })
        .returning();
    return slug;
}
export async function findSlug(db, slugValue) {
    const [result] = await db
        .select()
        .from(slugs)
        .where(and(eq(slugs.slug, slugValue), eq(slugs.isActive, true)))
        .limit(1);
    return result ?? null;
}
export async function redirectSlug(db, oldSlug, newSlug, objectId) {
    await db.transaction(async (tx) => {
        await tx
            .update(slugs)
            .set({ isActive: false })
            .where(and(eq(slugs.slug, oldSlug), eq(slugs.objectId, objectId)));
        await tx.insert(slugRedirects).values({
            oldSlug,
            newSlug,
            objectId,
        });
    });
}
// --- Aliases ---
export async function addAlias(db, data) {
    const [alias] = await db
        .insert(aliases)
        .values({
        objectId: data.objectId,
        name: data.name,
        aliasType: data.aliasType ?? "alternate_name",
        language: data.language ?? "th",
        isPrimary: data.isPrimary ?? false,
    })
        .returning();
    return alias;
}
export async function getAliases(db, objectId) {
    return db.select().from(aliases).where(eq(aliases.objectId, objectId));
}
// --- Revisions ---
export async function saveRevision(db, data) {
    const [revision] = await db
        .insert(revisions)
        .values({
        objectId: data.objectId,
        userId: data.userId,
        revisionType: data.revisionType,
        contentSnapshot: data.contentSnapshot,
        changeSummary: data.changeSummary,
        version: data.version,
    })
        .returning();
    return revision;
}
export async function getRevisions(db, objectId) {
    return db
        .select()
        .from(revisions)
        .where(eq(revisions.objectId, objectId))
        .orderBy(desc(revisions.version));
}
// --- References ---
export async function createReference(db, data) {
    const [ref] = await db
        .insert(references)
        .values({
        title: data.title,
        authors: data.authors ?? [],
        source: data.source,
        url: data.url,
        doi: data.doi,
        publishYear: data.publishYear,
        citationFormat: data.citationFormat ?? "apa",
        fullCitation: data.fullCitation,
    })
        .returning();
    return ref;
}
export async function getReferences(db, objectId) {
    return db
        .select({
        ref: references,
        context: objectReferences.context,
        pageNumber: objectReferences.pageNumber,
        confidence: objectReferences.confidence,
    })
        .from(objectReferences)
        .innerJoin(references, eq(objectReferences.referenceId, references.id))
        .where(eq(objectReferences.objectId, objectId));
}
