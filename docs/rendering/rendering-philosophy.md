# Rendering Philosophy

## Principle

The Renderer is not a Markdown Parser.

The Renderer is an **Interpreter**.

It interprets **Knowledge** and transforms it into **UI**.

```
Knowledge
    │
    ▼
Experience
```

Not:

```
Markdown
    │
    ▼
HTML
```

## Core Beliefs

**Meaning over Syntax.**
The Renderer reads the semantic intent of content, not just its formatting. `[[concept:shadow]]` is not a link — it is a knowledge reference that should be rendered as an interactive Concept Card.

**Knowledge Object over Raw Text.**
Every reference to a Concept, Thinker, or Book is resolved through the Knowledge Engine before rendering begins. The Renderer never sees strings — it sees Objects.

**Context over Consistency.**
The same `[[timeline:1912]]` renders differently depending on context. In a Concept page, it's a compact callout. In a dedicated article, it's a full interactive timeline.

**Component over Template.**
There is no template system. Every piece of content maps to a registered React Component. The Renderer's job is to choose the right component for the right context.

## Design Goals

- The Renderer must never produce broken HTML — every path is a valid component
- Adding a new Object type means registering a component, not writing a template
- The same Markdown source produces different output for different themes (light, dark, print)
- Writers think in meaning — the Renderer handles presentation
- The Renderer does not know about the database — it asks the Knowledge Engine
