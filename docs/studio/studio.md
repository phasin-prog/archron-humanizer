# Studio Architecture

## Product Map

```
Studio
├── Dashboard        Entry point, overview, quick actions
├── Workspace        Collections, Drafts, Assets, References
├── Drafts           Draft management
├── Editor           Markdown + Block Editor
├── Preview          Multi-device rendering preview
├── Assets           Media management
├── References       Citation management
├── Knowledge Manager  Concept registry, relationships, aliases
├── Review           Content review interface
├── Publishing       Publishing pipeline
└── Analytics        Content performance data
```

## Philosophy

**Studio is an IDE.** The Editor is just one feature.

Just as VS Code is not a "text editor," Studio is not a "content editor." It is an integrated environment for knowledge work:

- Writing is one mode of operation
- Managing concepts, references, and relationships is another
- Reviewing and publishing is a third
- Analytics and insights is a fourth

## Design Principles

- **Keyboard-first** — every action has a keyboard shortcut
- **Command palette** — Ctrl+K to access anything
- **Minimal chrome** — content is primary, UI is secondary
- **Real-time** — no save button, auto-save always on
- **Context-aware** — sidebar changes based on what you're doing
- **Offline-capable** — future: work without internet, sync when connected
