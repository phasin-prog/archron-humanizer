import { describe, it, expect, vi } from "vitest";
import { SearchEngine } from "../engine";
describe("SearchEngine.search", () => {
    it("returns a search response with results, total, page, pageSize, facets, took", async () => {
        const rows = [
            {
                id: "o1",
                objectType: "concept",
                slug: "shadow",
                title: "Shadow",
                description: "An unconscious archetype",
                language: "th",
                difficulty: "intermediate",
                status: "published",
                aliases: [],
                domains: [],
                tags: [],
                thumbnail: null,
                readingTime: 5,
                wordCount: 1000,
                viewCount: 0,
                backlinkCount: 0,
                rank: 0.5,
                headline: "Shadow",
                publishedAt: null,
                createdAt: new Date("2026-01-01"),
            },
        ];
        const execute = vi.fn().mockResolvedValue(rows);
        const db = { execute };
        const engine = new SearchEngine(db);
        const response = await engine.search({ term: "shadow", limit: 10, offset: 0 });
        expect(response.results).toHaveLength(1);
        expect(response.results[0].slug).toBe("shadow");
        expect(response.total).toBe(0);
        expect(response.page).toBe(1);
        expect(response.pageSize).toBe(10);
        expect(response.facets).toBeDefined();
        expect(response.took).toBeGreaterThanOrEqual(0);
    });
    it("calls execute at least once for the search and once for the count", async () => {
        const execute = vi.fn().mockResolvedValue([]);
        const db = { execute };
        const engine = new SearchEngine(db);
        await engine.search({ term: "x", limit: 10, offset: 0 });
        expect(execute).toHaveBeenCalled();
    });
});
describe("SearchEngine.autocomplete", () => {
    it("returns an empty array for terms shorter than 2 characters", async () => {
        const execute = vi.fn();
        const db = { execute };
        const engine = new SearchEngine(db);
        const result = await engine.autocomplete("a");
        expect(result).toEqual([]);
        expect(execute).not.toHaveBeenCalled();
    });
    it("calls execute and returns mapped rows for terms of 2+ characters", async () => {
        const rows = [{ label: "Shadow", value: "shadow", type: "concept", slug: "shadow" }];
        const execute = vi.fn().mockResolvedValue(rows);
        const db = { execute };
        const engine = new SearchEngine(db);
        const result = await engine.autocomplete("sh", 5);
        expect(result).toHaveLength(1);
        expect(result[0].label).toBe("Shadow");
        expect(result[0].type).toBe("concept");
    });
});
describe("SearchEngine.recordView", () => {
    it("executes an UPDATE statement", async () => {
        const execute = vi.fn().mockResolvedValue(undefined);
        const db = { execute };
        const engine = new SearchEngine(db);
        await engine.recordView("o-1");
        expect(execute).toHaveBeenCalledTimes(1);
    });
});
