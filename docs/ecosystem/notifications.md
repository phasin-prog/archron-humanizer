# Notifications

Only what matters. No noise.

## Notification Types

### Content Notifications

| Type | Trigger | Priority |
|------|---------|----------|
| Draft Reviewed | Reviewer completed review | High |
| Changes Requested | Reviewer requested changes | High |
| Draft Approved | Draft approved by Editor | High |
| Draft Published | Draft published | High |
| Mention | Someone @mentioned you in a review | Medium |
| Correction | Someone corrected your published content | Medium |
| Citation | Your content was cited by new content | Low |
| Reference Validated | Your suggested reference was accepted | Low |

### Community Notifications

| Type | Trigger | Priority |
|------|---------|----------|
| Collection Followed | Someone followed your Collection | Low |
| Achievement Earned | System awarded an achievement | Medium |
| Level Up | Reputation reached new level | Medium |
| Review Request | Writer requested you as Reviewer | Medium |
| Assignment | Editor assigned you a Draft | High |

### System Notifications

| Type | Trigger | Priority |
|------|---------|----------|
| Role Change | Your role was changed | High |
| Account Notice | Password change, email change | High |
| Support | Contribution acknowledgment | Low |
| Maintenance | Scheduled downtime | Low |

## Notification Preferences

Users can configure notifications per type:

```
Notification Settings
┌─────────────────────────────────────────────┐
│  Push Notifications                          │
│  │  Draft Reviewed                       ●  │
│  │  Changes Requested                     ●  │
│  │  Draft Approved                        ●  │
│  │  Draft Published                       ●  │
│  │  Mention                               ○  │
│  │  Achievement Earned                    ○  │
│  │  Level Up                              ○  │
│  │  Review Request                        ●  │
│  │  Assignment                            ●  │
│  │  Correction                            ○  │
│  │  Citation                              ○  │
│  │  Collection Followed                   ○  │
│  └────────────────────────────────────────┘  │
│                                              │
│  Email Notifications                         │
│  │  Daily Digest                     ●      │
│  │  Instant (High priority only)      ○      │
│  └────────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

## Notification Delivery

| Priority | In-app | Push | Email |
|----------|--------|------|-------|
| High | Instant | Instant | Instant |
| Medium | Instant | Instant | Digest |
| Low | Instant | Off | Digest |

## Notification Rules

- Notifications are grouped by Object (not individual events)
- "Mark all as read" available
- Notifications older than 90 days are auto-archived
- No promotional notifications (unless opted in)
- Notification count badge on the bell icon
- Clicking a notification navigates to the relevant context
- Unread count is capped at 99+
- Notifications can be disabled entirely
