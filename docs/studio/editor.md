# Editor

Not a Word clone. Obsidian + Notion + VS Code — with ARCHRON's knowledge layer on top.

## Editor Layout

```
┌─────────────────────────────────────────────────────┐
│  Breadcrumb: Studio / Draft / The Shadow            │
├───────────────────┬─────────────────┬───────────────┤
│                   │                 │               │
│  Navigator        │  Editor         │  Knowledge    │
│                   │                 │  Sidebar      │
│  Outline          │  ┌───────────┐  │               │
│  ├─ Introduction  │  │ Markdown  │  │ Related       │
│  ├─ Definition    │  │ + Blocks  │  │ Concepts      │
│  ├─ History       │  │           │  │ Thinkers      │
│  └─ Related       │  │ Live      │  │ Books         │
│                   │  │ Preview   │  │ References    │
│  Draft Info       │  └───────────┘  │ Backlinks     │
│  ├─ Status        │                 │               │
│  ├─ Words: 1,240  │                 │               │
│  ├─ Reading: 5m   │                 │               │
│  └─ References: 3 │                 │               │
│                   │                 │               │
└───────────────────┴─────────────────┴───────────────┘
```

## Features

### Markdown
- Full GFM (GitHub Flavored Markdown) support
- Wikilink syntax: `[[concept:shadow]]`, `[[thinker:carl-jung]]`
- Frontmatter for metadata: `---\ntitle: "The Shadow"\n---`

### Slash Commands
- Type `/` to trigger command menu
- Insert blocks: heading, list, quote, image, callout, divider
- Insert knowledge: concept card, thinker card, book reference, quote
- Insert media: image, audio, video
- Actions: save, preview, submit for review

### Block Commands
- Type `>` for blockquote
- Type `- ` for list
- Type `1. ` for numbered list
- Type `[]` for checkbox
- Type `---` for divider
- Type `#` `##` `###` for headings

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` | Save (auto-save also runs every 30s) |
| `Ctrl+P` | Preview |
| `Ctrl+K` | Command Palette |
| `Ctrl+B` | Bold |
| `Ctrl+I` | Italic |
| `Ctrl+Shift+K` | Insert wikilink |
| `Ctrl+Shift+L` | Open Knowledge Sidebar |
| `Ctrl+Shift+F` | Search within draft |
| `Ctrl+Enter` | Submit for review |
| `Tab` | Indent / complete block |
| `Shift+Tab` | Unindent |

### Auto Save
- Every 30 seconds
- On focus loss
- Never lose more than 30 seconds of work
- Version created on every save (see Versioning)

### Auto Link
- As you type `[[`, system suggests Objects by name
- Fuzzy search across all Object types
- Tab to autocomplete
- Esc to dismiss
