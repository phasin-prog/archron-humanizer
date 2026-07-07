# Moderation

Focused on **knowledge quality**, not popularity.

## Moderation Principles

- **Knowledge first** — moderation decisions are based on content quality, not popularity
- **Transparent** — all moderation actions are logged and visible to the affected user
- **Appealable** — every moderation decision can be appealed
- **Progressive** — warnings before penalties, education before punishment
- **Human-centered** — AI assists detection, but humans make the final decision

## Content Moderation

### What is Moderated

| Category | Examples | Action |
|----------|----------|--------|
| Inaccurate content | Factual errors, misleading claims | Flag for correction |
| Plagiarism | Unattributed copying | Content removal + warning |
| Low quality | Insufficient depth, poor writing | Return to Draft with feedback |
| Duplicate content | Same concept already exists | Merge with existing |
| Inappropriate content | Offensive material | Content removal + account action |
| Spam | Promotional content | Content removal + account action |

### Moderation Flow

```
Flagged Content
    │
    ├── Automated Detection (duplicate, plagiarism check)
    │
    ├── User Report (any user can flag)
    │
    ▼
Moderation Queue
    │
    ├── Editor reviews
    │
    ├── No issue → Dismiss flag
    │
    └── Issue found
          ├── Minor → Notify author + request correction
          ├── Moderate → Content flagged + author notified
          └── Severe → Content hidden + author suspended
```

### Appeal Process

```
Moderation Action
    │
    ▼
User receives notification with reason
    │
    ▼
User can appeal within 14 days
    │
    ├── Appeal submitted with explanation
    │
    ▼
Senior Editor reviews appeal
    │
    ├── Appeal accepted → Action reversed
    │
    └── Appeal denied → Final decision with explanation
```

## User Moderation

| Violation | First Offense | Second Offense | Third Offense |
|-----------|---------------|----------------|---------------|
| Plagiarism | Warning + content removed | 30-day suspension | Account termination |
| Inaccurate content | Request correction | Temporary write suspension | Review requirement |
| Abusive behavior | Warning | 7-day suspension | Account termination |
| Spam | Warning + content removed | 30-day suspension | Account termination |
| Gaming reputation | Warning + reputation reset | 90-day suspension | Account termination |

## Moderation Roles

| Role | Can Moderate | Can Appeal |
|------|--------------|------------|
| Editor | Content in assigned domain | — |
| Senior Editor | All content | Yes |
| Curator | Collections, Guides | — |
| Administrator | All content + users | Yes |

## Moderation Rules

- All moderation actions are logged with timestamp and reason
- Users are notified of all moderation actions affecting their content
- Moderation history is visible to the affected user only
- No moderation based on popularity, viewpoint, or personal preference
- Appeals are reviewed by a different moderator than the original action
- Automated moderation flags are reviewed by a human within 24 hours
- False flags by users are tracked — repeated false flagging leads to flagging restrictions
