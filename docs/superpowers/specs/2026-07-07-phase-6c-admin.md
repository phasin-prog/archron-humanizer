# Phase 6c — Admin App: Full Administration Suite — Design Spec

Date: 2026-07-07
Version: 1.0
Status: Draft

## Overview

Build `apps/admin/` — the administration platform for Editors and Administrators. Next.js App Router + Clerk auth (requireRole "editor"). 8 pages + components + API routes.

## File Structure

```
apps/admin/src/
  app/
    layout.tsx                        # Root: Clerk provider
    page.tsx                          # Redirect → /admin/dashboard
    (auth)/
      layout.tsx                      # Protected: requireRole("editor")
      dashboard/
        page.tsx                      # System overview
      users/
        page.tsx                      # User list + role management
        [id]/
          page.tsx                    # User detail + role change + audit
      moderation/
        page.tsx                      # Moderation queue
        [id]/
          page.tsx                    # Flag detail + action
      content/
        page.tsx                      # Content management (archive, delete, merge)
      configuration/
        page.tsx                      # System config
      audit/
        page.tsx                      # Audit trail log
  components/
    admin/
      sidebar.tsx                     # Admin navigation
      header.tsx                      # Admin header
      stats-cards.tsx                 # Reusable stat cards
  api/
    users/
      route.ts                        # GET list, PUT role change
      [id]/
        route.ts                      # GET/PUT/DELETE user
    moderation/
      route.ts                        # GET flags, POST resolve
    content/
      route.ts                        # PUT archive/delete/merge
    audit/
      route.ts                        # GET audit log
```

Total: ~20 files

---

## Page Specs

### 1. Dashboard — `/admin/dashboard`
```
Stats cards (4):
  Total Users | Active Writers | Content Published | Flagged Content

Quick links:
  Moderation Queue (pending flags count)
  User Management
  Content Management
  Audit Trail

Recent activity feed:
  Last 10 moderation actions + user role changes
```

### 2. Users — `/admin/users`
```
Table with columns: Avatar | Name | Email | Role | Status | Joined | Actions
Filter by role dropdown
Search by name/email
Action buttons per row: Edit Role, View Profile, Suspend
```

### 3. User Detail — `/admin/users/[id]`
```
Profile card: avatar, name, email, role, joined date, reputation
Role management: dropdown to change role, requires confirmation
Activity history: last 20 actions (drafts, comments, reviews)
Audit trail: role changes, moderation actions
Actions: Suspend/Reactivate account
```

### 4. Moderation Queue — `/admin/moderation`
```
Table: Flag ID | Content | Type | Reporter | Date | Status | Actions
Filter: pending, resolved, dismissed
Actions: Review, Resolve, Dismiss
```

### 5. Flag Detail — `/admin/moderation/[id]`
```
Flagged content preview
Flag details: type, reporter, date, description
Content owner info
Actions: Resolve (dismiss flag), Take Action (hide content, warn user)
Note required before resolution
```

### 6. Content Management — `/admin/content`
```
Tabs: Published | Archived | Flagged
Search by title/slug
Bulk actions: Archive, Delete
Per-item: View, Edit, Archive, Delete (with confirmation dialog)
```

### 7. Configuration — `/admin/configuration`
```
Sections:
  General: site name, description, maintenance mode
  Content: max draft count, auto-archive days, review deadline
  Roles: min requirements for writer/reviewer/editor
  Notifications: email templates, webhook URLs
Save button per section
```

### 8. Audit Trail — `/admin/audit`
```
Table: Timestamp | Actor | Action | Target | Details
Filter by: date range, action type, actor
Pagination
Export to CSV button
```

---

## Components

Same pattern as Studio: sidebar nav, header, auth layout. Reuse @archron/ui Table, Dialog, Select, Input, Button, Badge, Tabs, Card.

---

## Acceptance Criteria

- [ ] All 8 pages accessible under `/admin/*`
- [ ] Auth gate blocks non-editor/admin roles
- [ ] Dashboard shows system stats
- [ ] User management: list, search, role change
- [ ] Moderation queue: list flags, resolve/dismiss
- [ ] Content management: archive, delete
- [ ] Configuration: save settings
- [ ] Audit trail: view log entries
- [ ] `pnpm --filter @archron/admin typecheck` passes
