import { describe, it, expect } from "vitest";
import { slugify, isSlugValid } from "../utils/slug";
describe("slugify", () => {
    it("converts spaces to hyphens and lowercases", () => {
        expect(slugify("The Shadow")).toBe("the-shadow");
    });
    it("strips non-word characters", () => {
        expect(slugify("Hello, World!")).toBe("hello-world");
    });
    it("collapses repeated hyphens", () => {
        expect(slugify("a---b")).toBe("a-b");
    });
    it("trims leading and trailing hyphens", () => {
        expect(slugify("---middle---")).toBe("middle");
    });
    it("strips Thai characters because \\w does not match non-ASCII scripts", () => {
        // NOTE: This documents current behavior. Thai slug support is a
        // Phase 10 Group 3 task (Thai search support). When slugify is
        // updated to preserve Thai, this test should be revised to assert
        // the Thai characters survive the strip regex.
        const s = slugify("เงา");
        expect(typeof s).toBe("string");
        expect(s).toBe("");
    });
});
describe("isSlugValid", () => {
    it("accepts a well-formed kebab slug", () => {
        expect(isSlugValid("the-shadow")).toBe(true);
    });
    it("rejects uppercase letters", () => {
        expect(isSlugValid("The-Shadow")).toBe(false);
    });
    it("rejects leading hyphens", () => {
        expect(isSlugValid("-shadow")).toBe(false);
    });
    it("rejects punctuation", () => {
        expect(isSlugValid("shadow!")).toBe(false);
    });
});
