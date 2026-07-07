import { describe, it, expect } from "vitest";
import { truncate, capitalize, pluralize } from "../utils/string";
describe("truncate", () => {
    it("returns text unchanged when within the limit", () => {
        expect(truncate("abc", 5)).toBe("abc");
    });
    it("appends ellipsis when over the limit", () => {
        expect(truncate("abcdef", 3)).toBe("abc...");
    });
    it("trims trailing whitespace before appending ellipsis", () => {
        expect(truncate("abc   ", 3)).toBe("abc...");
    });
});
describe("capitalize", () => {
    it("capitalizes the first letter", () => {
        expect(capitalize("hello")).toBe("Hello");
    });
    it("leaves an empty string empty", () => {
        expect(capitalize("")).toBe("");
    });
    it("does not change already-capitalized text", () => {
        expect(capitalize("Hello")).toBe("Hello");
    });
});
describe("pluralize", () => {
    it("uses the singular form when count is 1", () => {
        expect(pluralize(1, "concept")).toBe("concept");
    });
    it("appends an s when count is not 1 and no plural is given", () => {
        expect(pluralize(0, "concept")).toBe("concepts");
        expect(pluralize(2, "concept")).toBe("concepts");
    });
    it("uses the supplied plural form when count is not 1", () => {
        expect(pluralize(2, "child", "children")).toBe("children");
    });
});
