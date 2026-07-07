# Phase 6c — Admin App — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build full `apps/admin/` — 8 pages, admin components, API routes

**Architecture:** Next.js App Router, Clerk auth (requireRole "editor"), @archron packages. Same pattern as apps/studio.

**Tech Stack:** Next.js 15, React 19, Clerk, @archron/ui, @archron/database, @archron/auth

## Global Constraints

- Auth protected: requireRole("editor") minimum
- Uses @archron/ui components (Table, Dialog, Select, Input, Button, Badge, Tabs, Card)
- API routes use @archron/database CRUD
- verbatimModuleSyntax: true, strict: true
- Follow Studio app patterns (layout, sidebar, header structure)

---

## Parallel Execution Map

```
Task 1 (Layout+Shell — 4 files)
Task 2 (Dashboard+Users — 3 files)    ← all independent
Task 3 (Moderation+Content — 4 files)
Task 4 (Config+Audit — 3 files)
Task 5 (API routes — 4 files)
```

---

### Task 1: Layouts + Shell + Sidebar + Header (4 files)

Create: `apps/admin/src/app/layout.tsx`, `page.tsx`, `(auth)/layout.tsx`
Create: `apps/admin/src/components/admin/sidebar.tsx`, `header.tsx`

Pattern: Copy from apps/studio, adapt names and role check to "editor". Sidebar links: Dashboard, Users, Moderation, Content, Configuration, Audit.

- [ ] Create all files + next.config.ts (copy from studio)
- [ ] Verify typecheck
- [ ] Commit: `git commit -m "feat(admin): add layouts, sidebar, header"`

---

### Task 2: Dashboard + Users Pages (3 files)

Create: `apps/admin/src/app/(auth)/dashboard/page.tsx`
Create: `apps/admin/src/app/(auth)/users/page.tsx`
Create: `apps/admin/src/app/(auth)/users/[id]/page.tsx`

Dashboard: 4 stat cards + quick links + activity feed
Users list: Table with avatar/name/email/role/status/actions columns
User detail: Profile card + role dropdown + activity + audit

- [ ] Create all files using @archron/ui Table/Card/Badge
- [ ] Verify typecheck
- [ ] Commit

---

### Task 3: Moderation + Content Pages (4 files)

Create: `apps/admin/src/app/(auth)/moderation/page.tsx`
Create: `apps/admin/src/app/(auth)/moderation/[id]/page.tsx`
Create: `apps/admin/src/app/(auth)/content/page.tsx`

Moderation queue: Table with flags, filter by status
Flag detail: Content preview + resolve/dismiss actions
Content management: Tabs (Published/Archived/Flagged) + archive/delete

- [ ] Create all files
- [ ] Verify typecheck
- [ ] Commit

---

### Task 4: Configuration + Audit Pages (3 files)

Create: `apps/admin/src/app/(auth)/configuration/page.tsx`
Create: `apps/admin/src/app/(auth)/audit/page.tsx`

Configuration: Form sections for general, content, roles, notifications. Save button.
Audit: Table with timestamp/actor/action/target/details. Filter by date/type. Export CSV.

- [ ] Create all files
- [ ] Verify typecheck
- [ ] Commit

---

### Task 5: Admin API Routes (4 files)

Create: `apps/admin/src/api/users/route.ts` + `[id]/route.ts`
Create: `apps/admin/src/api/moderation/route.ts`
Create: `apps/admin/src/api/content/route.ts`
Create: `apps/admin/src/api/audit/route.ts`

All routes: Clerk auth check, require editor+ role, CRUD via @archron/database.

- [ ] Create all files
- [ ] Verify typecheck
- [ ] Commit
