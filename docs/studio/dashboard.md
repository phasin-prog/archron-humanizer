# Dashboard

The entry point when a Writer opens Studio.

## Layout

```
┌─────────────────────────────────────────────────┐
│  Studio Header  │  Search  │  Notifs  │  Profile │
├─────────────────────────────────────────────────┤
│                                                 │
│  Continue Writing                                │
│  ┌─────────────────────────────────────────┐    │
│  │ Last edited Draft — "The Shadow"        │    │
│  │ Last edited: 2 hours ago                │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Quick Actions                                   │
│  [New Draft]  [New Concept]  [Upload Media]     │
│                                                 │
│  Recent Drafts                                   │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐      │
│  │ Title │  │ Title │  │ Title │  │ Title │      │
│  │ Status│  │ Status│  │ Status│  │ Status│      │
│  └──────┘  └──────┘  └──────┘  └──────┘      │
│                                                 │
│  Publishing Queue                                │
│  ┌─────────────────────────────────────────┐    │
│  │ Draft A — Awaiting Review               │    │
│  │ Draft B — Changes Requested             │    │
│  │ Draft C — Ready to Publish              │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Recent Activity                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ 09:45  Concept "Archetype" approved     │    │
│  │ 09:12  New backlinks added to "Shadow"  │    │
│  │ 08:30  Draft "Persona" submitted        │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Stats (Today)                                   │
│  Words: 1,240  │  Drafts: 3  │  Published: 1    │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Dashboard Rules

- Most recently edited Draft is always visible at the top
- Quick Actions are the primary call-to-action buttons
- Recent Drafts shows the last 4 edited drafts with status badges
- Publishing Queue shows all drafts in review workflow
- Recent Activity is a real-time feed of team/self actions (last 10)
- Stats reset daily — words written, drafts active, objects published
- Dashboard is the default Studio route — no splash screen
