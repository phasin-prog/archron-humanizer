# Publishing

## Content States

```
Draft
    │  (visible only to Writer + invited Reviewers)
    ▼
Review
    │  (submitted for validation)
    ▼
Published
    │  (live, indexed, immutable)
    ▼
Archived
    │  (removed from search, URL preserved)
```

## State Transitions

| From | To | Trigger | By |
|------|----|---------|----|
| Draft | Review | Submit | Writer |
| Review | Draft | Request changes | Reviewer / Editor |
| Review | Published | Approve | Editor |
| Published | Archived | Archive | Editor |
| Archived | Published | Restore | Editor |

## Publishing Rules

- Published Objects are immutable — no edits after publish
- Corrections require publishing a new version
- Previous versions are preserved in version history
- URLs (slugs) never change — redirects if a correction changes the slug
- Deletion is not allowed — only Archive
- Archived Objects preserve their URL but return a 410 Gone for search engines (200 for direct link visitors showing an archived notice)
- All published Objects must have at least 1 Reference
- References are validated by the Reviewer before approval
