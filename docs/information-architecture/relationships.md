# Relationships

Objects are connected through typed relationships. This is the core of the Knowledge Graph.

## Relationship Types

### Thinker → Theory
- **created** — Thinker developed this Theory
- **criticized** — Thinker opposed this Theory
- **expanded** — Thinker built upon this Theory

### Theory → Concept
- **contains** — Theory includes this Concept
- **defines** — Theory gives specific meaning to this Concept

### Concept → Concept
- **related** — Semantically connected
- **opposes** — Contradictory or dialectical opposite
- **derives_from** — Evolved from another Concept
- **precedes** — Chronologically prior

### Concept → Symbol
- **represented_by** — This Symbol embodies the Concept
- **associated_with** — Loose symbolic association

### Symbol → Book
- **appears_in** — Symbol is discussed or featured in this Book
- **analyzed_in** — Book provides analysis of this Symbol

### Thinker → Book
- **authored** — Thinker wrote this Book
- **influenced_by** — Thinker was influenced by this Book
- **critiqued_in** — Book critiques the Thinker's work

### Thinker → Thinker
- **influenced** — One Thinker influenced another
- **mentored** — Direct teacher-student relationship
- **collaborated_with** — Worked together

### Event → Thinker
- **involved** — Thinker participated in or was affected by this Event

### Event → Concept
- **introduced** — Event marked the introduction of this Concept
- **popularized** — Event brought this Concept to public attention

### Object → Reference
- **supported_by** — Object's claims are supported by this Reference

## Graph Principles

- Every relationship is bidirectional (stored once, traversable both ways)
- Relationships have a "weight" or "strength" hint (primary / secondary / tertiary)
- Some relationships are contextual — they exist only within a specific Theory or School
- The graph is always traversable — no dead ends

## Examples

```
Jung
  └─ created ──→ Analytical Psychology
                    └─ contains ──→ Concept: Unconscious
                                      ├─ related ──→ Concept: Collective Unconscious
                                      ├─ represented_by ──→ Symbol: Shadow
                                      └─ appears_in ──→ Book: Man and His Symbols
```
