import { describe, it, expect } from "vitest";
import { formatDate, formatYearRange, isRecent } from "../utils/date";
describe("formatDate", () => {
    it("formats a date in Thai locale", () => {
        const s = formatDate(new Date("2026-07-07T00:00:00Z"));
        expect(typeof s).toBe("string");
        expect(s.length).toBeGreaterThan(0);
        expect(s).toContain("2569");
    });
});
describe("formatYearRange", () => {
    it("returns birth-death when both supplied", () => {
        expect(formatYearRange("1875", "1961")).toBe("1875–1961");
    });
    it("returns birth- when only birth supplied", () => {
        expect(formatYearRange("1875")).toBe("1875–");
    });
    it("returns empty string when neither supplied", () => {
        expect(formatYearRange()).toBe("");
    });
});
describe("isRecent", () => {
    it("returns true for now", () => {
        expect(isRecent(new Date())).toBe(true);
    });
    it("returns false for 30 days ago with default 7-day window", () => {
        const d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        expect(isRecent(d)).toBe(false);
    });
    it("honors the days argument", () => {
        const d = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000);
        expect(isRecent(d, 30)).toBe(true);
        expect(isRecent(d, 10)).toBe(false);
    });
});
