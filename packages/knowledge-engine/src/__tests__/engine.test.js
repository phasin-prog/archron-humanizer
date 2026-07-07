import { describe, it, expect, vi, beforeEach } from "vitest";
const { findObjectBySlug, findObjectById, listObjects, findRelations } = vi.hoisted(() => ({
    findObjectBySlug: vi.fn(),
    findObjectById: vi.fn(),
    listObjects: vi.fn(),
    findRelations: vi.fn(),
}));
vi.mock("@archron/database/objects", () => ({
    findObjectBySlug,
    findObjectById,
    listObjects,
}));
vi.mock("@archron/database/relationships", () => ({
    findRelations,
}));
import { KnowledgeEngine } from "../index";
function makeObject(slug) {
    return {
        id: "obj-" + slug,
        objectType: "concept",
        slug,
        title: slug.charAt(0).toUpperCase() + slug.slice(1),
        status: "published",
        visibility: "public",
        language: "th",
        difficulty: "intermediate",
        description: "An unconscious archetype",
        aliases: [],
        domains: [],
        tags: [],
        thumbnail: null,
        readingTime: 5,
        wordCount: 1000,
        viewCount: 0,
        backlinkCount: 0,
        version: 1,
        authorId: null,
        editorId: null,
        publishedAt: null,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
    };
}
beforeEach(() => {
    findObjectBySlug.mockReset();
    findObjectById.mockReset();
    listObjects.mockReset();
    findRelations.mockReset();
});
describe("KnowledgeEngine.getObject", () => {
    it("returns null when the slug is not found", async () => {
        findObjectBySlug.mockResolvedValue(null);
        const engine = new KnowledgeEngine({ db: {} });
        const result = await engine.getObject("missing");
        expect(result).toBeNull();
        expect(findObjectBySlug).toHaveBeenCalledTimes(1);
    });
    it("returns the object when found and caches it for subsequent calls", async () => {
        const obj = makeObject("shadow");
        findObjectBySlug.mockResolvedValue(obj);
        const engine = new KnowledgeEngine({ db: {} });
        const first = await engine.getObject("shadow");
        const second = await engine.getObject("shadow");
        expect(first).toEqual(obj);
        expect(second).toEqual(obj);
        expect(findObjectBySlug).toHaveBeenCalledTimes(1);
    });
});
describe("KnowledgeEngine.clearCache", () => {
    it("empties the cache and resets getCacheSize to 0", () => {
        const engine = new KnowledgeEngine({ db: {} });
        engine.clearCache();
        expect(engine.getCacheSize()).toBe(0);
    });
});
describe("KnowledgeEngine.getCacheSize", () => {
    it("returns 0 for a fresh engine", () => {
        const engine = new KnowledgeEngine({ db: {} });
        expect(engine.getCacheSize()).toBe(0);
    });
    it("increases after an object is cached", async () => {
        findObjectBySlug.mockResolvedValue(makeObject("shadow"));
        const engine = new KnowledgeEngine({ db: {} });
        await engine.getObject("shadow");
        expect(engine.getCacheSize()).toBe(1);
    });
});
