import { describe, it, expect } from "vitest"
import {
  BUILT_IN_SLASH_COMMANDS,
  createInitialState,
  validateMarkdown,
  countWords,
  estimateReadingTime,
  type SlashCommand,
  type ValidationRule,
} from "../index"

describe("BUILT_IN_SLASH_COMMANDS", () => {
  it("exports a non-empty list of slash commands", () => {
    expect(BUILT_IN_SLASH_COMMANDS.length).toBeGreaterThan(0)
  })

  it("every command has a unique id, trigger, label, snippet, and category", () => {
    const ids = new Set<string>()
    for (const cmd of BUILT_IN_SLASH_COMMANDS) {
      expect(cmd.id).toBeTruthy()
      expect(cmd.trigger).toBeTruthy()
      expect(cmd.label).toBeTruthy()
      expect(cmd.snippet).toBeTruthy()
      expect(cmd.category).toBeTruthy()
      expect(ids.has(cmd.id)).toBe(false)
      ids.add(cmd.id)
    }
  })

  it("includes the heading-1 command", () => {
    const h1 = BUILT_IN_SLASH_COMMANDS.find((c) => c.id === "heading-1") as SlashCommand | undefined
    expect(h1).toBeDefined()
    expect(h1?.trigger).toBe("h1")
    expect(h1?.snippet).toContain("#")
  })

  it("categorizes commands into the documented categories", () => {
    const validCategories = new Set(["formatting", "media", "content", "object", "special"])
    for (const cmd of BUILT_IN_SLASH_COMMANDS) {
      expect(validCategories.has(cmd.category)).toBe(true)
    }
  })
})

describe("createInitialState", () => {
  it("returns a default editor state with empty markdown and draft status", () => {
    const state = createInitialState()
    expect(state.markdown).toBe("")
    expect(state.status).toBe("draft")
    expect(state.objectType).toBe("article")
    expect(state.tags).toEqual([])
    expect(state.wordCount).toBe(0)
  })

  it("overrides defaults with supplied values", () => {
    const state = createInitialState({ title: "Shadow", slug: "shadow", markdown: "# Hello" })
    expect(state.title).toBe("Shadow")
    expect(state.slug).toBe("shadow")
    expect(state.markdown).toBe("# Hello")
  })
})

describe("countWords", () => {
  it("counts plain English words", () => {
    expect(countWords("one two three four five")).toBe(5)
  })

  it("returns 0 for empty or whitespace-only input", () => {
    expect(countWords("")).toBe(0)
    expect(countWords("   \n\t   ")).toBe(0)
  })

  it("strips markdown syntax characters before counting", () => {
    expect(countWords("# **bold** _italic_ `code`")).toBe(3)
  })
})

describe("estimateReadingTime", () => {
  it("returns at least 1 minute even for very short text", () => {
    expect(estimateReadingTime(0)).toBe(1)
    expect(estimateReadingTime(10)).toBe(1)
  })

  it("rounds up to the nearest minute at the 200 wpm threshold", () => {
    expect(estimateReadingTime(200)).toBe(1)
    expect(estimateReadingTime(201)).toBe(2)
    expect(estimateReadingTime(400)).toBe(2)
    expect(estimateReadingTime(401)).toBe(3)
  })
})

describe("validateMarkdown", () => {
  it("returns an empty array when no rules match", () => {
    const rules: ValidationRule[] = []
    const results = validateMarkdown("# Hello", rules)
    expect(results).toEqual([])
  })

  it("runs each rule and collects matching results", () => {
    const always: ValidationRule = {
      id: "always",
      name: "Always fires",
      description: "Returns a result for any input",
      test: (md: string) => ({ ruleId: "always", message: `saw ${md.length} chars`, severity: "info" }),
    }
    const never: ValidationRule = {
      id: "never",
      name: "Never fires",
      description: "Returns null for any input",
      test: () => null,
    }
    const results = validateMarkdown("# Hello", [always, never])
    expect(results).toHaveLength(1)
    expect(results[0]!.ruleId).toBe("always")
    expect(results[0]!.severity).toBe("info")
  })
})
