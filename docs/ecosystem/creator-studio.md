# Creator Studio

The workspace for Contributors, Writers, and Reviewers.

## Dashboard (Creator Home)

```
┌─────────────────────────────────────────────────────┐
│  Creator Studio                                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Overview                                            │
│  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐          │
│  │  8    │ │  3    │ │  56   │ │  240  │          │
│  │Articles│ │Drafts  │ │Refs   │ │Citations│          │
│  └───────┘ └───────┘ └───────┘ └───────┘          │
│                                                     │
│  My Drafts                                           │
│  ┌──────────────────────────────────────────────┐   │
│  │ Shadow — Status: In Review · Submitted 2d ago │   │
│  │ Persona — Status: Draft · Last edited 1h ago  │   │
│  │ Anima — Status: Changes · 3 items to address  │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  Review Queue (Reviewers)                            │
│  ┌──────────────────────────────────────────────┐   │
│  │ Projection — Maria K. · Due in 5 days        │   │
│  │ Individuation — John D. · Due in 3 days      │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  Recent Activity                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │ 10:30  ✅ "Shadow" published                 │   │
│  │ 09:15  📝 "Persona" draft auto-saved         │   │
│  │ 08:00  🏆 Achievement: "First Attempt"     │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Creator Sections

### Analytics

```
Content Performance
┌─────────────────────────────────────────────────────┐
│  Views (30 days)                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │  ████████████████░░░░░░░░░░ 1,240 views      │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  Top Content                                         │
│  1. The Shadow — 450 views                          │
│  2. Persona — 320 views                             │
│  3. Archetype — 280 views                           │
│                                                     │
│  Citations                                           │
│  Your content has been cited 12 times                │
│  └── 8 Articles · 3 Concepts · 1 Guide              │
└─────────────────────────────────────────────────────┘
```

### Publishing History

```
┌─────────────────────────────────────────────────────┐
│  Published Content (24 total)                        │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │ The Shadow          │ Jun 15, 2024 │ 450 views│   │
│  │ Persona             │ Jun 10, 2024 │ 320 views│   │
│  │ Anima               │ Jun 1, 2024  │ 280 views│   │
│  │ Archetype           │ May 20, 2024 │ 200 views│   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  [View All] [Filter by type] [Export]               │
└─────────────────────────────────────────────────────┘
```

### Achievements

```
┌─────────────────────────────────────────────────────┐
│  Achievements (12 earned)                            │
│                                                     │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐               │
│  │ 🏆  │ │ 🏆  │ │ 🏆  │ │ 🏆  │ │ 🏆  │               │
│  │First│ │Know.│ │Ref. │ │Ed's │ │ Per.│               │
│  │Words│ │Bldr │ │Mast │ │Choice│ │ Rect│               │
│  └────┘ └────┘ └────┘ └────┘ └────┘               │
│                                                     │
│  Next Achievements Available                        │
│  ┌──────────────────────────────────────────────┐   │
│  │ 🏆 High Impact — 3 more citations needed       │   │
│  │ 🏆 Guide Maker — 3 more guides needed          │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## Creator Studio Rules

- Accessible from `/studio` route
- Shows content owned by the logged-in user only
- Writers see: Drafts, Published, Analytics, Collections
- Reviewers see: Review Queue, Review History, Review Statistics
- Editors see: All of the above + Publishing Queue + Moderation Queue
- Analytics data is read-only — no export to external tools (future)
- Creator Studio is mobile-responsive
- No ads displayed within Creator Studio
