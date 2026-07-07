# Workspace

The central hub for all work-in-progress.

## Concept

Workspace is not a dashboard — it is an active workspace. Dashboard shows what happened. Workspace is where work happens.

## Layout

```
┌─────────────────────────────────────────────────┐
│  Workspace    [Collections] [Drafts] [Assets]   │
├─────────────────────────────────────────────────┤
│                                                 │
│  Collections                                     │
│  ┌──────────────┐  ┌──────────────┐            │
│  │ Jung Reading  │  │ Archetypes   │            │
│  │ 12 items      │  │ 8 items      │            │
│  └──────────────┘  └──────────────┘            │
│                                                 │
│  Active Drafts                                   │
│  ┌──────────────────────────────────────────┐   │
│  │ The Shadow          Status: Draft        │   │
│  │ Last edited: 2h ago  Words: 1,240        │   │
│  ├──────────────────────────────────────────┤   │
│  │ Persona              Status: Review      │   │
│  │ Last edited: 1d ago  Words: 2,100        │   │
│  ├──────────────────────────────────────────┤   │
│  │ Individuation        Status: Changes     │   │
│  │ Last edited: 3d ago  Words: 890          │   │
│  └──────────────────────────────────────────┘   │
│                                                 │
│  Recent Assets                                   │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│  │img │ │img │ │pdf │ │img │ │img │          │
│  └────┘ └────┘ └────┘ └────┘ └────┘          │
│                                                 │
│  References Library                              │
│  ┌──────────────────────────────────────────┐   │
│  │ Jung, C. (1964). Man and His Symbols     │   │
│  │ Jung, C. (1921). Psychological Types     │   │
│  └──────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Tabs

| Tab | Content |
|-----|---------|
| Collections | All user-created Collections |
| Drafts | All Drafts owned by the user (filterable by status) |
| Assets | All uploaded Media files |
| References | All saved academic References |

## Workspace Rules

- Workspace shows all content owned or created by the logged-in Writer
- Tabs are persistent — switching tabs does not lose state
- Drag and drop to organize Collections
- Quick search across all workspace content
- Bulk actions (select multiple drafts to submit, tag, archive)
- Infinity scroll — no pagination within workspace
- Filter by status, type, date, domain
