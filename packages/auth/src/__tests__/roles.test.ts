import { describe, it, expect } from "vitest"
import { Roles, RoleHierarchy } from "@archron/shared"
import type { Role } from "@archron/shared"

describe("Roles", () => {
  it("exposes the six role names", () => {
    expect(Roles.Guest).toBe("guest")
    expect(Roles.Member).toBe("member")
    expect(Roles.Writer).toBe("writer")
    expect(Roles.Reviewer).toBe("reviewer")
    expect(Roles.Editor).toBe("editor")
    expect(Roles.Administrator).toBe("administrator")
  })
})

describe("RoleHierarchy", () => {
  it("orders roles from guest (0) to administrator (5)", () => {
    expect(RoleHierarchy.guest).toBe(0)
    expect(RoleHierarchy.member).toBe(1)
    expect(RoleHierarchy.writer).toBe(2)
    expect(RoleHierarchy.reviewer).toBe(3)
    expect(RoleHierarchy.editor).toBe(4)
    expect(RoleHierarchy.administrator).toBe(5)
  })

  it("guarantees administrator outranks every other role", () => {
    const roles: Role[] = ["guest", "member", "writer", "reviewer", "editor", "administrator"]
    for (const role of roles) {
      expect(RoleHierarchy.administrator).toBeGreaterThanOrEqual(RoleHierarchy[role])
    }
  })

  it("can be used to compare role levels like requireRole does", () => {
    const userRole: Role = "member"
    const minimum: Role = "writer"
    expect(RoleHierarchy[userRole] < RoleHierarchy[minimum]).toBe(true)
  })
})
