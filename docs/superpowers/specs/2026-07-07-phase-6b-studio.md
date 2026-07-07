# Phase 6b — Studio App: Full Studio Platform — Design Spec

Date: 2026-07-07
Version: 1.0
Status: Draft

## Overview

Build `apps/studio/` — the full Studio platform for writers. Next.js App Router + Clerk auth + @archron packages. 7 pages, 10 components, API routes.

## Tech Stack

Next.js 15 (App Router), @archron/ui, @archron/editor, @archron/database, @archron/auth, @archron/shared, Clerk (@clerk/nextjs)

## File Structure

```
apps/studio/src/
  app/
    layout.tsx                         # Root: Clerk provider + html/body
    page.tsx                           # Redirect -> /studio/dashboard
    (auth)/
      layout.tsx                       # Protected: requireRole("writer")
      dashboard/
        page.tsx                       # Dashboard
      workspace/
        page.tsx                       # Workspace (tabs)
      objects/
        page.tsx                       # Knowledge Manager list
        [slug]/
          page.tsx                     # Object detail
      drafts/
        page.tsx                       # Drafts list
        [id]/
          page.tsx                     # Draft editor (full EditorCore)
      publish/
        page.tsx                       # Publishing queue
  components/
    studio/
      sidebar.tsx                      # Navigation sidebar
      header.tsx                       # Top bar
      dashboard/
        continue-writing.tsx           # Latest draft card
        quick-actions.tsx              # Action buttons
        recent-drafts.tsx              # Draft cards grid
        publishing-queue.tsx           # Review status list
        activity-feed.tsx              # Activity list
        stats-bar.tsx                  # Today's stats
      workspace/
        collections-tab.tsx
        drafts-tab.tsx
        assets-tab.tsx
        references-tab.tsx
  api/
    drafts/
      route.ts                         # GET list, POST create
      [id]/
        route.ts                       # GET, PUT, DELETE
    objects/
      route.ts                         # GET list, POST create
      [slug]/
        route.ts                       # GET, PUT
    publish/
      route.ts                         # POST submit
```

Total: ~20 files

---

## Page Specs

### 1. Root Layout — `app/layout.tsx`
```
Renders: <html lang="th"><body><ArchronClerkProvider>{children}</ArchronClerkProvider></body></html>
Import: ArchronClerkProvider from @archron/auth/client
```

### 2. Root Page — `app/page.tsx`
```
Renders: redirect("/studio/dashboard")
```

### 3. Auth Layout — `app/(auth)/layout.tsx`
```
Purpose: Wraps all studio pages with auth gate

Uses: requireRole("writer") from @archron/auth
Layout:
┌──────────────────────────────────┐
│ Header (search, notifs, profile) │
├────────┬─────────────────────────┤
│Sidebar │ Content                 │
│240px   │ flex-1                  │
└────────┴─────────────────────────┘

Sidebar links:
  - Dashboard
  - Workspace (Collections, Drafts, Assets, References)
  - Objects (Knowledge Manager)
  - Drafts
  - Publishing
```

### 4. Dashboard — `app/(auth)/dashboard/page.tsx`
```
Components:
  <Header />
  <div className="grid gap-6 p-6 max-w-6xl mx-auto">
    <ContinueWriting />
    <QuickActions />
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <RecentDrafts />
        <PublishingQueue />
      </div>
      <div>
        <StatsBar />
        <ActivityFeed />
      </div>
    </div>
  </div>
```

### 5. Workspace — `app/(auth)/workspace/page.tsx`
```
Components:
  <Header />
  <Tabs defaultValue="drafts">
    <TabsList>
      <TabsTrigger value="collections">Collections</TabsTrigger>
      <TabsTrigger value="drafts">Drafts</TabsTrigger>
      <TabsTrigger value="assets">Assets</TabsTrigger>
      <TabsTrigger value="references">References</TabsTrigger>
    </TabsList>
    <TabsContent value="collections"><CollectionsTab /></TabsContent>
    <TabsContent value="drafts"><DraftsTab /></TabsContent>
    <TabsContent value="assets"><AssetsTab /></TabsContent>
    <TabsContent value="references"><ReferencesTab /></TabsContent>
  </Tabs>
```

### 6. Objects (Knowledge Manager) — `app/(auth)/objects/page.tsx`
```
Purpose: List all knowledge objects, filterable by type/status/domain

Components:
  <Header />
  <div className="p-6 max-w-6xl mx-auto">
    <h1>Knowledge Manager</h1>
    <div className="flex gap-4 mb-4">
      <Input placeholder="Search objects..." />
      <Select options={objectTypeOptions} placeholder="Type" />
      <Select options={statusOptions} placeholder="Status" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      {/* Object cards (KnowledgeCard) */}
    </div>
  </div>
```

### 7. Object Detail — `app/(auth)/objects/[slug]/page.tsx`
```
Purpose: View/edit a knowledge object

Uses: fetch object by slug from API, display in EditorLayout
Components: <EditorLayout><Navigator/><EditorCore/><KnowledgeSidebar/></EditorLayout>
```

### 8. Drafts List — `app/(auth)/drafts/page.tsx`
```
Purpose: List all drafts with filter + bulk actions

Components:
  <Header />
  <Select options={statusFilter} />
  <div className="space-y-2">
    {drafts.map(d => <DraftCard key={d.id} {...d} />)}
  </div>
```

### 9. Draft Editor — `app/(auth)/drafts/[id]/page.tsx`
```
Purpose: Full editor experience

Components:
  <EditorLayout>
    <div> {/* Navigator */}
      <h2>{draft.title}</h2>
      <StatusBadge status={draft.status} />
      <p>Words: {wordCount} | Reading: {readingTime}m</p>
    </div>
    <div> {/* Editor */}
      <EditorToolbar editor={editor} />
      <SlashCommandMenu editor={editor} />
      <WikiLinkAutocomplete editor={editor} />
      <EditorCore editorRef={ref} content={draft.body} onChange={handleChange} />
      <LivePreview markdown={markdown} />
      <StatusBar {...stats} />
    </div>
    <div> {/* Knowledge Sidebar */}
      <KnowledgeSidebar objectId={draft.objectId} />
    </div>
  </EditorLayout>
```

### 10. Publishing Queue — `app/(auth)/publish/page.tsx`
```
Purpose: Show all drafts in review workflow

Columns:
  - Drafts Awaiting Review
  - Changes Requested
  - Ready to Publish

Each item: title, author, submitted date, status badge, actions
```

---

## Component Specs

### Sidebar — `components/studio/sidebar.tsx`
```
Props: none (uses usePathname for active state)
Shows: Studio logo, nav links with icons, active highlight
Bottom: user avatar + logout
```

### Header — `components/studio/header.tsx`
```
Shows: Breadcrumb (current page), Search input, Notification bell, Profile avatar
```

### Dashboard Components (6)
Each is a server/client component rendering card-based UI using @archron/ui components:
- `continue-writing.tsx` — Card with latest draft info + "Continue" button
- `quick-actions.tsx` — 3 large Button cards (New Draft, New Concept, Upload Media)
- `recent-drafts.tsx` — Grid of 4 DraftCards
- `publishing-queue.tsx` — List of review status items
- `activity-feed.tsx` — Timeline of recent 10 events
- `stats-bar.tsx` — 3 stat cards (words, drafts, published)

### Workspace Tab Components (4)
Each is a tab content panel:
- `collections-tab.tsx` — Grid of CollectionCards with item counts
- `drafts-tab.tsx` — Filterable list with status badges, edit/delete actions
- `assets-tab.tsx` — Grid of Media thumbnail cards with upload button
- `references-tab.tsx` — List of Reference entries with formatted citations

---

## API Routes

### `api/drafts/route.ts`
```
GET — list drafts (query: status, limit, offset)
POST — create draft (body: { title, objectType, body })
```

### `api/drafts/[id]/route.ts`
```
GET — get draft by id
PUT — update draft (body: { title, body, tags })
DELETE — delete draft
```

### `api/objects/route.ts`
```
GET — list objects (query: type, status, limit, offset, sort)
POST — create object (body: create data)
```

### `api/objects/[slug]/route.ts`
```
GET — get object by slug
PUT — update object
```

### `api/publish/route.ts`
```
POST — submit for review (body: { draftId })
Returns: updated draft with status "review"
```

All routes use `@archron/database` CRUD functions + Clerk auth for user identity.

---

## Acceptance Criteria

- [ ] All pages accessible under `/studio/*`
- [ ] Auth gate blocks non-writer roles
- [ ] Dashboard shows mock/production data via API
- [ ] Workspace tabs render content
- [ ] Draft editor loads EditorCore + toolbar + preview
- [ ] Knowledge manager lists objects
- [ ] Publishing queue shows review statuses
- [ ] API routes return JSON
- [ ] `pnpm --filter @archron-studio typecheck` passes
- [ ] `pnpm --filter @archron-studio dev` starts without errors
