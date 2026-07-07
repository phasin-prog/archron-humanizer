import { describe, it, expect } from "vitest";
import { isNonEmpty, isValidUrl, isWithinRange, isValidEmail } from "../utils/validation";
describe("isNonEmpty", () => {
    it("returns false for empty string", () => {
        expect(isNonEmpty("")).toBe(false);
    });
    it("returns false for whitespace-only string", () => {
        expect(isNonEmpty("   ")).toBe(false);
    });
    it("returns true for non-empty string", () => {
        expect(isNonEmpty("hello")).toBe(true);
    });
});
describe("isValidUrl", () => {
    it("accepts an http URL", () => {
        expect(isValidUrl("http://example.com")).toBe(true);
    });
    it("accepts an https URL", () => {
        expect(isValidUrl("https://example.com/path?q=1")).toBe(true);
    });
    it("rejects a non-URL string", () => {
        expect(isValidUrl("not a url")).toBe(false);
    });
});
describe("isWithinRange", () => {
    it("returns true for a value inside the range", () => {
        expect(isWithinRange(5, 1, 10)).toBe(true);
    });
    it("returns true at the boundaries", () => {
        expect(isWithinRange(1, 1, 10)).toBe(true);
        expect(isWithinRange(10, 1, 10)).toBe(true);
    });
    it("returns false outside the range", () => {
        expect(isWithinRange(0, 1, 10)).toBe(false);
        expect(isWithinRange(11, 1, 10)).toBe(false);
    });
});
describe("isValidEmail", () => {
    it("accepts a standard email", () => {
        expect(isValidEmail("a@b.com")).toBe(true);
    });
    it("rejects a string without an at sign", () => {
        expect(isValidEmail("nope")).toBe(false);
    });
    it("rejects a string without a domain TLD", () => {
        expect(isValidEmail("a@b")).toBe(false);
    });
});
