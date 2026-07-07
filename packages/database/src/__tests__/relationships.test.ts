import { describe, it, expect, vi } from "vitest"
import { findRelations, removeRelation, getGraphNodes } from "../relationships"

function selectChainMock(resolved: any) {
  // Actual chain order in relationships.ts: select().from().where().limit().offset()
  const offset = vi.fn().mockResolvedValue(resolved)
  const limit = vi.fn().mockReturnValue({ offset })
  const where = vi.fn().mockReturnValue({ limit })
  const from = vi.fn().mockReturnValue({ where })
  const select = vi.fn().mockReturnValue({ from })
  return { select, from, where, limit, offset }
}

describe("findRelations", () => {
  it("filters by outgoing direction and applies the default limit of 50", async () => {
    const c = selectChainMock([])
    const db = { select: c.select } as any
    await findRelations(db, { objectId: "o1", direction: "outgoing" })
    expect(c.where).toHaveBeenCalledTimes(1)
    expect(c.limit).toHaveBeenCalledWith(50)
  })

  it("returns mapped relation rows for direction=both", async () => {
    const rows = [
      {
        id: "rel-1",
        source_id: "o1",
        target_id: "o2",
        relation_type: "created",
        weight: "primary",
        confidence: "verified",
      },
    ]
    const c = selectChainMock(rows)
    const db = { select: c.select } as any
    const result = await findRelations(db, { objectId: "o1", direction: "both" })
    expect(result).toHaveLength(1)
    expect(result[0]!.sourceId).toBe("o1")
    expect(result[0]!.targetId).toBe("o2")
    expect(result[0]!.relationType).toBe("created")
  })
})

describe("removeRelation", () => {
  it("runs the deletion inside a transaction", async () => {
    const selectLimit = vi.fn().mockResolvedValue([{ id: "rel-9", targetId: "o-target" }])
    const whereSelect = vi.fn().mockReturnValue({ limit: selectLimit })
    const fromSelect = vi.fn().mockReturnValue({ where: whereSelect })
    const select = vi.fn().mockReturnValue({ from: fromSelect })

    const deleteWhere = vi.fn().mockResolvedValue(undefined)
    const deleteMock = vi.fn().mockReturnValue({ where: deleteWhere })
    const updateWhere = vi.fn().mockResolvedValue(undefined)
    const updateSet = vi.fn().mockReturnValue({ where: updateWhere })
    const updateMock = vi.fn().mockReturnValue({ set: updateSet })

    const transaction = vi.fn(async (fn: (tx: any) => any) =>
      fn({
        select,
        delete: deleteMock,
        update: updateMock,
      }),
    )
    const db = { transaction } as any
    await removeRelation(db, "rel-9")
    expect(transaction).toHaveBeenCalledTimes(1)
    expect(deleteMock).toHaveBeenCalled()
  })
})

describe("getGraphNodes", () => {
  it("returns graph nodes with the default limit of 100 when no filter is supplied", async () => {
    const rows = [{ id: "n1", objectId: "o1", label: "Shadow", nodeType: "concept" }]
    const c = selectChainMock(rows)
    const db = { select: c.select } as any
    const result = await getGraphNodes(db)
    expect(result).toHaveLength(1)
    expect(result[0]!.label).toBe("Shadow")
    expect(c.limit).toHaveBeenCalledWith(100)
  })
})
