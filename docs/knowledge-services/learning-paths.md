# Learning Paths

Milestone 10.3 — Auto-generate learning journeys from the Knowledge Graph.

## Goal

From any Object, generate a structured learning path. No AI required.

## Path Generation Logic

```
Start: "Shadow" (Concept)
    │
    ▼
Find prerequisite Concepts
    │
    ├── "Persona" (Shadow appears after Persona development)
    ├── "Ego" (Ego must exist before Shadow projection)
    └── "Consciousness" (Foundational concept)
    │
    ▼
Find deeper Concepts
    │
    ├── "Anima/Animus" (Next archetype in sequence)
    ├── "Individuation" (Ultimate goal of Shadow work)
    └── "Self" (Final integration)
    │
    ▼
Generate Path
    │
    1. Consciousness (prerequisite)
    2. Ego (prerequisite)
    3. Persona (prerequisite)
    4. Shadow (current)
    5. Anima/Animus (next)
    6. Individuation (goal)
    └── Self (completion)
```

## Path Rules

### Prerequisite Detection
- Concepts that the current Concept "derives_from" or "precedes"
- Thinkers whose work is foundational to the current topic
- Theories that contain the current Concept
- Schools that the current Theory belongs to

### Next Step Detection
- Concepts that "follow" the current Concept (chronological or logical)
- Related Concepts that are more advanced in difficulty
- Guides that include the current Concept as a lesson
- Articles recommended for deeper understanding

### Difficulty Sequencing
```
Beginner      → Prerequisites
Intermediate  → Current Concept + Direct Related
Advanced      → Related theories + Deep articles
Expert        → Original texts + Research papers
```

## Path Display

```
Learning Path: Understanding the Shadow
┌─────────────────────────────────────────────────────┐
│  Path generated from your current interest            │
│                                                     │
│  ① Consciousness                  [Beginner]    ✓   │
│  ② Ego                            [Beginner]    ✓   │
│  ③ Persona                        [Beginner]    →   │
│  ④ Shadow (current)               [Intermediate] ▶  │
│  ⑤ Anima/Animus                   [Intermediate]    │
│  ⑥ Individuation                  [Advanced]        │
│  ⑦ Self                           [Advanced]        │
│                                                     │
│  [Start Guide]  [Save Path]  [Share]                │
└─────────────────────────────────────────────────────┘
```

## Path Sources

Paths are generated from four data sources:

1. **Taxonomy** — Discipline → School → Theory → Concept hierarchy
2. **Relationships** — `precedes`, `derives_from`, `contains` edge types
3. **Difficulty** — Beginner → Intermediate → Advanced metadata
4. **Prerequisite fields** — Guide lessons with explicit prerequisites

## Implementation (No AI)

```python
def generate_learning_path(object_id, max_depth=5):
    # 1. Find prerequisites (objects that should be studied first)
    prerequisites = find_related_by_type(object_id, ['precedes', 'derives_from'])
    
    # 2. Find next steps (objects that follow this one)
    next_steps = find_related_by_type(object_id, ['follows', 'contained_by'])
    
    # 3. Sort by difficulty
    prerequisites = sort_by_difficulty(prerequisites, ascending=True)
    next_steps = sort_by_difficulty(next_steps, ascending=True)
    
    # 4. Build path
    path = prerequisites + [current_object] + next_steps
    
    # 5. Limit depth
    return path[:max_depth]
```

## Acceptance Criteria

- [ ] Every Object can generate a learning path
- [ ] Path includes prerequisites and next steps
- [ ] Path respects difficulty progression
- [ ] Path can be saved as a Guide
- [ ] Path updates when new relationships are added
- [ ] Path generation latency < 100ms
