import { describe, it, expect, vi } from "vitest"
import { findObjectBySlug, createObject, publishObject, softDeleteObject } from "../objects"

function chainMock(resolved: any) {
  const limit = vi.fn().mockResolvedValue(resolved)
  const where = vi.fn().mockReturnValue({ limit })
  const from = vi.fn().mockReturnValue({ where })
  const select = vi.fn().mockReturnValue({ from })
  return { select, from, where, limit }
}

describe("findObjectBySlug", () => {
  it("returns null when no row matches", async () => {
    const c = chainMock([])
    const db = { select: c.select } as any
    const result = await findObjectBySlug(db, "missing")
    expect(result).toBeNull()
  })

  it("returns a mapped object when a row matches", async () => {
    const row = {
      id: "obj-1",
      objectType: "concept",
      slug: "shadow",
      title: "Shadow",
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
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-02"),
    }
    const c = chainMock([row])
    const db = { select: c.select } as any
    const result = await findObjectBySlug(db, "shadow")
    expect(result).not.toBeNull()
    expect(result?.id).toBe("obj-1")
    expect(result?.slug).toBe("shadow")
    expect(result?.title).toBe("Shadow")
  })
})

describe("createObject", () => {
  it("inserts the object and returns the mapped row", async () => {
    const returning = vi.fn().mockResolvedValue([
      {
        id: "obj-2",
        objectType: "concept",
        slug: "persona",
        title: "Persona",
        status: "draft",
        visibility: "public",
        language: "th",
        difficulty: "intermediate",
        description: "The social mask",
        aliases: [],
        domains: [],
        tags: [],
        thumbnail: null,
        readingTime: null,
        wordCount: null,
        viewCount: 0,
        backlinkCount: 0,
        version: 1,
        authorId: null,
        editorId: null,
        publishedAt: null,
        createdAt: new Date("2026-01-01"),
        updatedAt: new Date("2026-01-01"),
      },
    ])
    const insert = vi.fn().mockReturnValue({ values: vi.fn().mockReturnValue({ returning }) })
    const transaction = vi.fn(async (fn: (tx: any) => any) => fn({ insert }))
    const db = { transaction } as any
    const result = await createObject(db, {
      objectType: "concept",
      slug: "persona",
      title: "Persona",
      description: "The social mask",
    })
    expect(result.id).toBe("obj-2")
    expect(transaction).toHaveBeenCalledTimes(1)
  })
})

describe("publishObject", () => {
  it("sets status to published and returns the mapped row", async () => {
    const returning = vi.fn().mockResolvedValue([
      {
        id: "obj-3",
        objectType: "concept",
        slug: "ego",
        title: "Ego",
        status: "published",
        visibility: "public",
        language: "th",
        difficulty: "intermediate",
        description: "The center of consciousness",
        aliases: [],
        domains: [],
        tags: [],
        thumbnail: null,
        readingTime: null,
        wordCount: null,
        viewCount: 0,
        backlinkCount: 0,
        version: 1,
        authorId: null,
        editorId: null,
        publishedAt: new Date("2026-07-07"),
        createdAt: new Date("2026-01-01"),
        updatedAt: new Date("2026-07-07"),
      },
    ])
    const set = vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ returning }) })
    const update = vi.fn().mockReturnValue({ set })
    const db = { update } as any
    const result = await publishObject(db, "obj-3")
    expect(result).not.toBeNull()
    expect(result?.status).toBe("published")
    expect(set).toHaveBeenCalledWith(expect.objectContaining({ status: "published" }))
  })
})

describe("softDeleteObject", () => {
  it("sets deletedAt to the current time", async () => {
    const set = vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) })
    const update = vi.fn().mockReturnValue({ set })
    const db = { update } as any
    await softDeleteObject(db, "obj-4")
    expect(set).toHaveBeenCalledTimes(1)
    const arg = set.mock.calls[0]![0]
    expect(arg.deletedAt).toBeInstanceOf(Date)
  })
})
