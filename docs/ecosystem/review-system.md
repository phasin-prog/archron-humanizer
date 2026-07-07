# Review System

Human-centered quality control pipeline.

## Review Pipeline

```
Draft Submitted
    │
    ▼
AI Validation (automated checks)
    │
    ├── Pass → Human Review Queue
    │
    └── Fail → Return to Writer with issues
    │
    ▼
Human Review
    │
    ├── Reviewer assigned (or selected by Writer)
    ├── Reviewer reads Draft + checks References + validates accuracy
    │
    ├── Approve → Editor Queue
    │
    ├── Changes Requested → Return to Writer
    │       └── Writer fixes → Re-submit
    │
    └── Reject → Draft closed (with reason)
    │
    ▼
Editor Approval
    │
    ├── Final check by Editor
    │
    └── Publish
```

## Review Criteria

Reviewers evaluate Drafts against:

| Criterion | Weight | Description |
|-----------|--------|-------------|
| **Accuracy** | Critical | Facts, dates, claims are correct |
| **Clarity** | High | Clear writing, well-structured |
| **Completeness** | High | All sections filled, no gaps |
| **Citations** | Critical | References support claims |
| **Objectivity** | Medium | Neutral tone, balanced view |
| **Originality** | Medium | Not a copy of existing content |
| **Consistency** | Medium | Consistent with taxonomy and ontology |
| **Language** | Low | Grammar, spelling, readability |

## Reviewer Interface

```
┌─────────────────────────────────────────────────────┐
│  Review: "The Shadow" — Draft v3                    │
│  Writer: Maria K.  │  Submitted: Jun 15, 2024       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  Content (rendered)                        │    │
│  │  [Same as published view]                  │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Validation Results                                  │
│  ✅ All checks passed                               │
│                                                     │
│  References (4)                                      │
│  [1] Jung, C. (1964)... ✓ Validated                  │
│  [2] Jung, C. (1921)... ✓ Validated                  │
│  [3] ... ✓ Validated                                 │
│  [4] ... ⚠ Could not verify source                   │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  Review Decision                             │    │
│  │                                             │    │
│  │  ○ Approve — Ready for publication           │    │
│  │  ○ Changes Requested — minor revisions       │    │
│  │  ○ Major Changes — needs significant rework  │    │
│  │  ○ Reject — does not meet quality threshold   │    │
│  │                                             │    │
│  │  Feedback: (required for changes/reject)     │    │
│  │  ┌─────────────────────────────────────┐    │    │
│  │  │                                   │    │    │
│  │  └─────────────────────────────────────┘    │    │
│  │                                             │    │
│  │  [Submit Review]                             │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Review Rules

- Every Draft must pass AI validation before human review
- Reviewer must have expertise in the Draft's domain
- A Writer can request a specific Reviewer (but not guarantee assignment)
- Reviews are anonymous (Reviewer identity hidden from Writer)
- Review feedback must be constructive and specific
- Reviewer has 7 days to complete review (auto-expire and reassign)
- Disputed reviews can be escalated to an Editor
- Reviewer reputation is affected by review quality (accuracy, timeliness, helpfulness)
- Completed reviews are logged and visible to the author
