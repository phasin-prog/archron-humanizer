import { describe, it, expect } from "vitest";
import { buildAST, parseMarkdown, tokenize } from "../parser";
describe("tokenize", () => {
    it("parses a heading token with its depth", () => {
        const tokens = tokenize("# Hello");
        expect(tokens).toHaveLength(1);
        expect(tokens[0].type).toBe("heading");
        expect(tokens[0].depth).toBe(1);
    });
    it("parses a horizontal rule", () => {
        const tokens = tokenize("---");
        expect(tokens).toHaveLength(1);
        expect(tokens[0].type).toBe("hr");
    });
    it("parses a paragraph for plain text", () => {
        const tokens = tokenize("just text");
        expect(tokens).toHaveLength(1);
        expect(tokens[0].type).toBe("paragraph");
    });
});
describe("buildAST", () => {
    it("returns a root node containing children", () => {
        const ast = buildAST("# Hello");
        expect(ast.type).toBe("root");
        expect(ast.children).toHaveLength(1);
        expect(ast.children[0].type).toBe("heading");
    });
    it("parses bold inline text into a bold node", () => {
        const ast = buildAST("**bold**");
        expect(ast.children[0].type).toBe("paragraph");
        const para = ast.children[0];
        expect(para.children[0].type).toBe("bold");
    });
    it("parses an empty document into a root with a single empty text node", () => {
        const ast = buildAST("");
        expect(ast.type).toBe("root");
        expect(ast.children).toHaveLength(1);
        expect(ast.children[0].type).toBe("text");
    });
});
describe("parseMarkdown", () => {
    it("returns a pipeline result with AST, HTML, and metadata", async () => {
        const result = await parseMarkdown("# Hello");
        expect(result.ast.type).toBe("root");
        expect(result.html).toContain("<h1>");
        expect(result.html).toContain("Hello");
        expect(result.context.metadata.headingCount).toBe(1);
    });
    it("counts word count and reading time in metadata", async () => {
        const result = await parseMarkdown("one two three four five");
        expect(result.context.metadata.wordCount).toBe(5);
        expect(result.context.metadata.readingTime).toBeGreaterThanOrEqual(1);
    });
});
