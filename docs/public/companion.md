# Companion

The Companion is present on every page — but never intrusive.

## Purpose

The Companion helps readers:

- **Define** unfamiliar terms instantly
- **Recommend** related content based on current page
- **Answer** questions about the current topic
- **Guide** discovery through the knowledge ecosystem

## Presence

```
┌─────────────────────────────────────────────────────┐
│  [Page content...]                     [💡 Comp]    │
│                                                 │
│  The Companion lives in the bottom-right        │
│  corner. Always accessible, never in the way.   │
│                                                 │
└─────────────────────────────────────────────────────┘
```

- Small floating button (bottom-right)
- Shows a subtle pulse when new recommendations are available
- No text, no popup — just an icon until clicked

## Expanded State

```
┌─────────────────────────────────────┐
│  💡 Companion                        │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  Ask about this topic...    │    │
│  └─────────────────────────────┘    │
│                                     │
│  Related to this page               │
│  ├── 🧠 Persona                     │
│  ├── 🧠 Anima                       │
│  └── 📖 Psychological Types         │
│                                     │
│  Suggested Guides                   │
│  ├── 🎯 Intro to Analytical         │
│  │    Psychology                    │
│  └── 🎯 Understanding the Self      │
│                                     │
│  [Minimize]                         │
└─────────────────────────────────────┘
```

## Capabilities

| Capability | Trigger | Result |
|-----------|---------|--------|
| Define term | Select text on page | Tooltip with definition |
| Recommend | Viewing any Object | Related content list |
| Answer question | Type in Companion input | Direct answer with references |
| Guide suggestion | Based on viewing history | Suggested learning path |
| Search | Natural language query | Redirect to search results |

## Companion Rules

- **Never interrupts** — no popups, no auto-open, no sound
- **Stateful** — remembers the current page context
- **Context-aware** — recommendations change based on what the user is reading
- **Lightweight** — loads on first click, not on page load
- **Keyboard accessible** — open/close with `Ctrl+.`
- **Privacy** — no conversation history stored on server (local only)
- **Fallback** — if AI is unavailable, show static related content only
- The Companion is not a chatbot — it is a knowledge assistant
