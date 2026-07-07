# Workflows

## 2.4 Content Lifecycle

An Article's journey through the system.

```
Create Draft
    │
    ▼
Edit (Writer)
    │
    ▼
Preview (Writer)
    │
    ▼
Submit for Review
    │
    ▼
┌──────────────────────────────────────────┐
│              Review Loop                 │
│                                          │
│  Reviewer → Approve?                     │
│      ├── Yes ──→ Ready for Publish       │
│      └── No ───→ Revisions Requested     │
│                     │                    │
│                     ▼                    │
│                  Writer Edits            │
│                     │                    │
│                     ▼                    │
│               Re-submit for Review       │
│                                          │
└──────────────────────────────────────────┘
    │
    ▼
Publish (Editor)
    │
    ▼
Indexed (Search Engine)
    │
    ▼
Linked (Knowledge Graph)
    │
    ▼
Searchable (Public)
```

## 2.5 Knowledge Lifecycle

A Concept's journey.

```
New Concept Identified
    │
    ▼
Validate (Reviewer/Editor)
    │
    ├── Valid ──→ Proceed
    │
    └── Invalid ──→ Reject
    │
    ▼
Link to Related Objects
    │
    ▼
Write Content (Writer)
    │
    ▼
Review (Reviewer)
    │
    ▼
Publish (Editor)
    │
    ├──→ Renderer generates page
    ├──→ Knowledge Graph updated
    ├──→ Search Engine indexed
    └──→ Backlinks recalculated
    │
    ▼
Continuous Updates
    │
    └──→ New links added as system grows
```

## 2.6 Studio Workflow

The Writer's workspace flow.

```
Studio Dashboard
    │
    ├──→ New Draft
    ├──→ Edit Existing Draft
    ├──→ Review Feedback
    └──→ Published Objects
    │
    ▼
Editor (Markdown + Live Preview)
    │
    ├── Write content
    ├── Add References
    ├── Link to Objects
    │   └── [[concept:shadow]] → auto-resolved
    ├── Insert Media
    └── Preview
    │
    ▼
Submit for Review
    │
    ▼
Track Status
    ├── Pending Review
    ├── Changes Requested
    └── Published
```
