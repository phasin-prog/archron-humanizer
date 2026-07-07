# Publishing

## Publishing Pipeline

```
Draft
    │
    ▼
Preview (Writer reviews rendered output)
    │
    ▼
Validate (Automatic checks run)
    │
    ├── Pass → Continue
    │
    └── Fail → Show errors → Fix → Re-validate
    │
    ▼
References Check (Auto: missing/empty references flagged)
    │
    ▼
SEO Check (Auto: title, description, slug, OG image)
    │
    ▼
Submit for Review
    │
    ▼
Reviewer notified → Review page
    │
    ├── Approve → Ready for Publish
    │
    └── Changes requested → Returned to Writer
    │
    ▼
Publish (Editor one-click)
    │
    ├── HTML generated via Renderer
    ├── Search Engine indexed
    ├── Knowledge Graph updated
    ├── Backlinks recalculated
    ├── Sitemap regenerated
    └── CDN cache purged (per-path)
```

## Publishing Interface

When Writer clicks "Submit for Review":

```
┌─────────────────────────────────────────────┐
│  Submit for Review                           │
│                                             │
│  ✅ Validation passed                       │
│  ✅ References: 4 attached                  │
│  ✅ SEO: All fields complete                │
│  ⚠️ Backlinks: 2 new found                  │
│                                             │
│  Reviewer: [select reviewer]                 │
│  Note: (optional) "Please review..."        │
│                                             │
│  [Cancel]  [Submit]                         │
└─────────────────────────────────────────────┘
```

## Publishing Rules

- Writer cannot publish their own content — requires Editor approval
- Editor can publish with one click from the Review page
- Published Objects are immutable — corrections require version bump
- Publishing triggers: ISR revalidation, sitemap update, search index update
- Failed publishing rolls back all changes
