# Phase 9 — Community & Companion: Full — Design Spec

Date: 2026-07-07
Version: 1.0
Status: Draft

## Overview

Build full community system in `apps/web/` — profiles, contributions, achievements, notifications, review system, settings, creator studio.

## Pages + API Routes

```
apps/web/src/app/
  (auth)/
    profile/
      [username]/
        page.tsx               Public profile page
    settings/
      page.tsx                 Account settings (profile edit, preferences)
    notifications/
      page.tsx                 Notifications inbox
    achievements/
      page.tsx                 Achievements showcase
    contributions/
      page.tsx                 Contribution history
    reviews/
      page.tsx                 Review dashboard (for reviewers)
    studio/
      page.tsx                 Creator studio (member dashboard)
  api/
    profile/
      [username]/
        route.ts              GET public profile
    settings/
      route.ts                GET/PUT user settings
    notifications/
      route.ts                GET list, PUT mark-read
    achievements/
      route.ts                GET user achievements
```

## Page Specs

### 1. Public Profile — `/(auth)/profile/[username]/page.tsx`
Layout per docs: Avatar + Name + Role Badge + Level
Left: Bio, Contributions (counts per type), Achievements (badges), Collections, Recent Activity
Right: Stats (Reputation bar, Published counts, Total views, Reading streak), Expertise tags
No follower counts, no friends, no social feed.

### 2. Settings — `/(auth)/settings/page.tsx`
Edit profile: display name, bio (max 280), expertise tags (select from taxonomy), avatar upload placeholder, privacy toggle (public/private), email preferences.

### 3. Notifications — `/(auth)/notifications/page.tsx`
Inbox list: notification cards grouped by date. Types: review_requested, content_published, achievement_earned, comment_received, mention, level_up, review_decision. Mark read on click. Mark all read button. Unread badge count.

### 4. Achievements — `/(auth)/achievements/page.tsx`
Grid of achievement badges. 4 categories as tabs: Milestone, Quality, Domain, Community. Each badge: icon, name, description, earned date. Locked badges shown greyed out.

### 5. Contributions — `/(auth)/contributions/page.tsx`
List of user's contributions grouped by type: Articles, Concepts, Thinkers, Books, Symbols, References, Reviews, Collections. Each item: title, date, status badge. Filter by type. Pagination.

### 6. Reviews — `/(auth)/reviews/page.tsx`
For reviewers: dashboard showing pending reviews, completed reviews. Stats: total reviews, acceptance rate, average review time.

### 7. Creator Studio — `/(auth)/studio/page.tsx`
Member dashboard: quick actions (New Article, New Concept, Upload Media), recent activity, drafts in progress, publishing queue, reputation overview, daily stats.

## API Routes

- `GET /api/profile/[username]` — public profile data
- `GET /api/settings` — user settings
- `PUT /api/settings` — update settings
- `GET /api/notifications` — list notifications
- `PUT /api/notifications` — mark read
- `GET /api/achievements` — user achievements

## Multi-Agent Groups

| Agent | Pages | Files |
|-------|-------|-------|
| A | Profile + Settings | 4 |
| B | Notifications + Achievements | 4 |
| C | Contributions + Reviews + Creator Studio | 3 |
| D | API routes | 6 |

4 agents parallel dispatch.
