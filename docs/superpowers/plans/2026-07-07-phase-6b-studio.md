# Phase 6b — Studio App — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build full `apps/studio/` — 7 pages, 10 components, 5 API routes

**Architecture:** Next.js App Router, Clerk auth, @archron packages, protected routes via (auth) group

**Tech Stack:** Next.js 15, React 19, Clerk (@clerk/nextjs), @archron/ui, @archron/editor, @archron/database, @archron/auth, @archron/shared, Tailwind CSS

## Global Constraints

- All pages are server components by default, "use client" only where needed (state, hooks)
- Auth protected via @archron/auth/middleware + requireRole("writer")
- Uses @archron/ui components (Card, Button, Badge, Tabs, Input, Select, Dialog, etc.)
- Uses @archron/editor components (EditorCore, EditorToolbar, etc.)
- API routes use @archron/database CRUD functions
- verbatimModuleSyntax: true, strict: true
- Next.js 15 App Router conventions (layout.tsx, page.tsx, route.ts)

---

## Parallel Execution Map

```
Task 1 (Layout+Shell — 5 files)
Task 2 (Dashboard — 7 files)      ← all independent, parallel
Task 3 (Workspace+Objects — 4 files)
Task 4 (Drafts+Publish — 3 files)
Task 5 (API routes — 5 files)
```

All 5 tasks create separate files — no shared files → safe for full parallel dispatch.

---

### Task 1: Layouts + Shell (5 files)

**Files:**
- Create: `apps/studio/src/app/layout.tsx`
- Create: `apps/studio/src/app/page.tsx`
- Create: `apps/studio/src/app/(auth)/layout.tsx`
- Create: `apps/studio/src/components/studio/sidebar.tsx`
- Create: `apps/studio/src/components/studio/header.tsx`

- [ ] **Step 1: apps/studio/src/app/layout.tsx**

```tsx
import type { Metadata } from "next"
import { ArchronClerkProvider } from "@archron/auth/client"
import "../../../apps/web/src/styles/globals.css"

export const metadata: Metadata = {
  title: "ARCHRON Studio",
  description: "Knowledge creation platform",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ArchronClerkProvider>{children}</ArchronClerkProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: apps/studio/src/app/page.tsx**

```tsx
import { redirect } from "next/navigation"

export default function StudioPage() {
  redirect("/studio/dashboard")
}
```

- [ ] **Step 3: apps/studio/src/app/(auth)/layout.tsx**

```tsx
import { requireRole } from "@archron/auth"
import { Sidebar } from "@/components/studio/sidebar"
import { Header } from "@/components/studio/header"

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const auth = await requireRole("writer")

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={auth.user} />
        <main className="flex-1 overflow-y-auto bg-muted/5">{children}</main>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: apps/studio/src/components/studio/sidebar.tsx**

```tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@archron/ui"
import { UserButton } from "@clerk/nextjs"

const NAV_ITEMS = [
  { href: "/studio/dashboard", label: "Dashboard", icon: "⌂" },
  { href: "/studio/workspace", label: "Workspace", icon: "⊞" },
  { href: "/studio/objects", label: "Objects", icon: "◈" },
  { href: "/studio/drafts", label: "Drafts", icon: "✎" },
  { href: "/studio/publish", label: "Publishing", icon: "⇧" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r bg-surface">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <span className="text-card-title font-serif font-bold">ARCHRON</span>
        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary">Studio</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-body transition-colors hover:bg-muted",
              pathname.startsWith(item.href) && "bg-muted text-primary font-medium",
            )}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t p-3">
        <UserButton afterSignOutUrl="/" />
      </div>
    </aside>
  )
}
```

- [ ] **Step 5: apps/studio/src/components/studio/header.tsx**

```tsx
import { Input } from "@archron/ui"

interface HeaderProps { user?: { email?: string } }

export function Header({ user }: HeaderProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-surface px-6">
      <div className="flex-1" />
      <div className="w-64">
        <Input placeholder="Search..." type="search" />
      </div>
      <span className="text-caption text-muted-foreground">{user?.email}</span>
    </header>
  )
}
```

- [ ] **Step 6: Verify typecheck**

```bash
pnpm --filter @archron-studio typecheck
```

- [ ] **Step 7: Commit**

```bash
git add apps/studio/src/
git commit -m "feat(studio): add layouts and shell — root layout, auth gate, sidebar, header"
```

---

### Task 2: Dashboard Page + Components (7 files)

**Files:**
- Create: `apps/studio/src/app/(auth)/dashboard/page.tsx`
- Create: `apps/studio/src/components/studio/dashboard/continue-writing.tsx`
- Create: `apps/studio/src/components/studio/dashboard/quick-actions.tsx`
- Create: `apps/studio/src/components/studio/dashboard/recent-drafts.tsx`
- Create: `apps/studio/src/components/studio/dashboard/publishing-queue.tsx`
- Create: `apps/studio/src/components/studio/dashboard/activity-feed.tsx`
- Create: `apps/studio/src/components/studio/dashboard/stats-bar.tsx`

- [ ] **Step 1: Dashboard page.tsx**

```tsx
import { ContinueWriting } from "@/components/studio/dashboard/continue-writing"
import { QuickActions } from "@/components/studio/dashboard/quick-actions"
import { RecentDrafts } from "@/components/studio/dashboard/recent-drafts"
import { PublishingQueue } from "@/components/studio/dashboard/publishing-queue"
import { ActivityFeed } from "@/components/studio/dashboard/activity-feed"
import { StatsBar } from "@/components/studio/dashboard/stats-bar"

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <h1 className="text-page-title font-serif font-bold">Dashboard</h1>
      <ContinueWriting />
      <QuickActions />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <RecentDrafts />
          <PublishingQueue />
        </div>
        <div className="space-y-6">
          <StatsBar />
          <ActivityFeed />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: continue-writing.tsx**

```tsx
import Link from "next/link"
import { Card, CardContent, CardTitle, Badge } from "@archron/ui"

export function ContinueWriting() {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-caption text-muted-foreground">Continue Writing</p>
          <CardTitle className="text-card-title">The Shadow</CardTitle>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="warning">Draft</Badge>
            <span className="text-caption text-muted-foreground">Last edited: 2 hours ago</span>
          </div>
        </div>
        <Link href="/studio/drafts/1" className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
          Continue
        </Link>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 3: quick-actions.tsx**

```tsx
import Link from "next/link"
import { Card, CardContent } from "@archron/ui"

const ACTIONS = [
  { href: "/studio/drafts/new", label: "New Draft", desc: "Start writing a new article", icon: "✎" },
  { href: "/studio/objects/new", label: "New Concept", desc: "Add a concept to the knowledge base", icon: "◈" },
  { href: "/studio/workspace?tab=assets", label: "Upload Media", desc: "Upload images, audio, or video", icon: "⬆" },
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {ACTIONS.map((action) => (
        <Link key={action.href} href={action.href}>
          <Card className="cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/50">
            <CardContent className="flex items-center gap-4 p-4">
              <span className="text-2xl">{action.icon}</span>
              <div>
                <p className="text-body font-medium">{action.label}</p>
                <p className="text-caption text-muted-foreground">{action.desc}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: recent-drafts.tsx** — grid of 4 Card components with title + badge + date

- [ ] **Step 5: publishing-queue.tsx** — list of cards with status badges (awaiting review, changes requested, ready)

- [ ] **Step 6: activity-feed.tsx** — timeline of 5-10 recent events (text + timestamp)

- [ ] **Step 7: stats-bar.tsx** — 3 stat cards (Words Today, Active Drafts, Published)

- [ ] **Step 8: Verify typecheck + commit**

---

### Task 3: Workspace + Objects Pages (4 files)

**Files:**
- Create: `apps/studio/src/app/(auth)/workspace/page.tsx`
- Create: `apps/studio/src/components/studio/workspace/collections-tab.tsx`
- Create: `apps/studio/src/components/studio/workspace/drafts-tab.tsx`
- Create: `apps/studio/src/app/(auth)/objects/page.tsx`

Workspace uses Tabs component with 4 tab panels (collections, drafts, assets, references). Objects page shows filterable knowledge object grid.

- [ ] **Create all 4 files with Card/Table/Tab components**
- [ ] **Verify typecheck + commit**

---

### Task 4: Drafts + Publish Pages (3 files)

**Files:**
- Create: `apps/studio/src/app/(auth)/drafts/page.tsx`
- Create: `apps/studio/src/app/(auth)/drafts/[id]/page.tsx`
- Create: `apps/studio/src/app/(auth)/publish/page.tsx`

Drafts list page: filterable list with status badges. Draft editor: full EditorLayout with EditorCore + Toolbar + Preview + StatusBar. Publish page: review queue columns.

- [ ] **Create all 3 files using @archron/editor components**
- [ ] **Verify typecheck + commit**

---

### Task 5: API Routes (5 files)

**Files:**
- Create: `apps/studio/src/api/drafts/route.ts`
- Create: `apps/studio/src/api/drafts/[id]/route.ts`
- Create: `apps/studio/src/api/objects/route.ts`
- Create: `apps/studio/src/api/objects/[slug]/route.ts`
- Create: `apps/studio/src/api/publish/route.ts`

Each route imports DB and Clerk auth. Uses Next.js Route Handlers (GET, POST, PUT, DELETE exports).

Example — `api/drafts/route.ts`:

```ts
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@archron/database"
import { listObjects, type ObjectQuery } from "@archron/database/objects"

export async function GET(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const query: ObjectQuery = {
    types: searchParams.get("types")?.split(",") ?? [],
    status: searchParams.get("status")?.split(",") ?? [],
    limit: Number(searchParams.get("limit")) || 20,
    offset: Number(searchParams.get("offset")) || 0,
  }

  const results = await listObjects(db, query)
  return NextResponse.json(results)
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  // createObject(db, { ...body, authorId: userId })
  return NextResponse.json({ created: true })
}
```

- [ ] **Create all 5 API route files**
- [ ] **Verify typecheck + commit**

---

## Verification

After all tasks:

```bash
pnpm --filter @archron-studio typecheck
```

Expected: PASS with zero errors.
